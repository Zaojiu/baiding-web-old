import {Injectable} from "@angular/core";
import {
  Http, ConnectionBackend, Request, RequestOptionsArgs, Response, RequestOptions,
  RequestMethod
} from "@angular/http";
import {Observable} from "rxjs";
import {OperationTipsService} from "../operation-tips/operation-tips.service";
import {ApiErrorMessage} from "./code-map.enum";

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
  if (!useIntercept) {
    delete options.useIntercept;
  }

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
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private operationTipsService: OperationTipsService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options);
  }

  get(url: string, options?: CustomRequestOptionsArgs): Observable<Response> {
    const useIntercept = handleInterceptOption(url, RequestMethod.Get, options);
    return useIntercept ? this.intercept(super.get(url, options)) : super.get(url, options);
  }

  post(url: string, body: any, options?: CustomRequestOptionsArgs): Observable<Response> {
    const useIntercept = handleInterceptOption(url, RequestMethod.Post, options);
    return useIntercept ? this.intercept(super.post(url, body, options)) : super.post(url, body, options);
  }

  put(url: string, body: any, options?: CustomRequestOptionsArgs): Observable<Response> {
    const useIntercept = handleInterceptOption(url, RequestMethod.Put, options);
    return useIntercept ? this.intercept(super.put(url, body, options)) : super.put(url, body, options);
  }

  delete(url: string, options?: CustomRequestOptionsArgs): Observable<Response> {
    const useIntercept = handleInterceptOption(url, RequestMethod.Delete, options);
    return useIntercept ? this.intercept(super.delete(url, options)) : super.delete(url, options);
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err, source) => {
      const data = err.json();
      if (data) {
        const code = data && data.code ? data.code : 0;
        const message = ApiErrorMessage[code];
        if (message) {
          this.operationTipsService.popup(message);
        } else {
          this.operationTipsService.popup(`请求错误: ${code}`);
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

