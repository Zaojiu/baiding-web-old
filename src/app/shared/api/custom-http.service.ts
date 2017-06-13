import {Injectable} from "@angular/core";
import {
  Http, ConnectionBackend, Request, RequestOptionsArgs, Response, RequestOptions,
  RequestMethod
} from "@angular/http";
import {Observable} from "rxjs";
import {OperationTipsService} from "../operation-tips/operation-tips.service";
import {ApiErrorMessage} from "./code-map.enum";

const whiteList = [{
  regexp: /api\/stats\/record$/,
  method: 'POST',
}];

@Injectable()
export class CustomHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private operationTipsService: OperationTipsService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    const urlStr = typeof url === 'string' ? url : url.url;
    const method = typeof url === 'string' ? options.method : url.method;
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
    return this.intercept(super.request(url, options), urlStr, methodStr);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, options), url, 'GET');
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, options), url, 'POST');
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, options), url, 'PUT');
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, options), url, 'DELETE');
  }

  intercept(observable: Observable<Response>, url: string, method: string): Observable<Response> {
    return observable.catch((err, source) => {
      for (let item of whiteList) {
        if (item.regexp.test(url) && method === item.method) {
          return Observable.throw(err);
        }
      }

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

