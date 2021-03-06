import {Injectable} from "@angular/core";
import {
  Http,
  ConnectionBackend,
  Request,
  RequestOptionsArgs,
  Response,
  RequestOptions,
  RequestMethod
} from "@angular/http";
import {Observable} from "rxjs";
import {OperationTipsService} from "../operation-tips/operation-tips.service";
import {ApiError, DefaultErrorMessage} from "./code-map.enum";
import {StoreService} from "../store/store.service";
import {Router} from "@angular/router";

interface CustomRequestOptionsArgs extends RequestOptionsArgs {
  useIntercept?: boolean;
  customCodeMap?: { [key: number]: string }
}

const whiteList = [{
  regexp: /api\/stats\/record$/,
  method: 'POST',
}];

const handleInterceptOption = (url: string, method: RequestMethod, options?: CustomRequestOptionsArgs) => {
  let useIntercept = options && options.useIntercept === false ? false : true;

  if (useIntercept) {
    let methodStr = '';

    switch (method) {
      case RequestMethod.Get:
        methodStr = 'GET';
        break;
      case RequestMethod.Delete:
        methodStr = 'DELETE';
        break;
      case RequestMethod.Head:
        methodStr = 'HEAD';
        break;
      case RequestMethod.Options:
        methodStr = 'OPTIONS';
        break;
      case RequestMethod.Patch:
        methodStr = 'PATCH';
        break;
      case RequestMethod.Post:
        methodStr = 'POST';
        break;
      case RequestMethod.Put:
        methodStr = 'PUT';
        break;
    }

    for (let item of whiteList) {
      if (item.regexp.test(url) && methodStr === item.method) {
        useIntercept = false;
        break;
      }
    }
  }

  return useIntercept;
};

@Injectable()
export class CustomHttp extends Http {
  constructor(backend: ConnectionBackend,
              defaultOptions: RequestOptions,
              private operationTipsService: OperationTipsService,
              private router: Router,
  ) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options);
  }

  get(url: string, options?: CustomRequestOptionsArgs): Observable<Response> {
    const useIntercept = handleInterceptOption(url, RequestMethod.Get, options);
    return useIntercept ? this.intercept(super.get(url, options), options) : super.get(url, options);
  }

  post(url: string, body: any, options?: CustomRequestOptionsArgs): Observable<Response> {
    const useIntercept = handleInterceptOption(url, RequestMethod.Post, options);
    return useIntercept ? this.intercept(super.post(url, body, options), options) : super.post(url, body, options);
  }

  put(url: string, body: any, options?: CustomRequestOptionsArgs): Observable<Response> {
    const useIntercept = handleInterceptOption(url, RequestMethod.Put, options);
    return useIntercept ? this.intercept(super.put(url, body, options), options) : super.put(url, body, options);
  }

  delete(url: string, options?: CustomRequestOptionsArgs): Observable<Response> {
    const useIntercept = handleInterceptOption(url, RequestMethod.Delete, options);
    return useIntercept ? this.intercept(super.delete(url, options), options) : super.delete(url, options);
  }

  intercept(observable: Observable<Response>, options: CustomRequestOptionsArgs): Observable<Response> {
    return observable.catch((err, source) => {
      const data = err.json();
      const code = data && data.code ? data.code : 0;

      if (err.status === 401 || code === ApiError.ErrUnauthorized || code === ApiError.ErrNeedToLogin) {
        StoreService.localStore.delete('userinfo');
        this.operationTipsService.popup(`请登录`);
        this.router.navigate(['/signin'], {queryParams: {redirectTo: location.href}});
      } else if (data) {
        if (code) {
          let codeMap = options && options.customCodeMap ? options.customCodeMap : null;

          if (codeMap) {
            codeMap = Object.assign({}, DefaultErrorMessage, codeMap);
          } else {
            codeMap = DefaultErrorMessage;
          }

          const message = codeMap[code];
          if (message) {
            this.operationTipsService.popup(message);
          }
        } else {
          this.operationTipsService.popup(`未知错误`);
        }
      } else {
        if (err.status === 0) {
          this.operationTipsService.popup('请求错误');
        } else if (err.status >= 400 && err.status < 500) {
          switch (err.status) {
            case 400:
              this.operationTipsService.popup('提交数据错误');
              break;
            case 403 :
              this.operationTipsService.popup('无访问权限');
              break;
            case 404:
              // 404有些一些不期望提示错误, 所以暂时隐藏
              // this.operationTipsService.popup('资源不存在');
              break;
            case 408:
              this.operationTipsService.popup('请求超时，请重试');
              break;
            default:
              this.operationTipsService.popup('提交数据错误');
          }
        } else if (err.status >= 500 && err.status < 600) {
          switch (err.status) {
            case 502:
              this.operationTipsService.popup('请求错误');
              break;
            case 504:
              this.operationTipsService.popup('请求超时，请重试');
              break;
            case 599:
              this.operationTipsService.popup('请重试或者咨询客服');
              break;
            default:
              this.operationTipsService.popup('服务器内部错误，请重试');
              break;
          }
        } else {
          this.operationTipsService.popup('请求错误');
        }
      }

      return Observable.throw(err);
    });
  }
}

