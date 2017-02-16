import {Injectable} from "@angular/core";
import {Http, ConnectionBackend, Request, RequestOptionsArgs, Response, RequestOptions} from "@angular/http";
import {Observable} from "rxjs";
import {OperationTipsService} from "../operation-tips/operation-tips.service";

@Injectable()
export class CustomHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private operationTipsService: OperationTipsService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, options));
  }

  post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, options));
  }

  put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, options));
  }

  intercept(observable: Observable<Response>): Observable<Response> {
    return observable.catch((err, source) => {
      switch (err.status) {
        case 400:
          this.operationTipsService.popup('提交数据错误');
          break;
        case 403 :
          this.operationTipsService.popup('无访问权限');
          break;
        case 404:
          this.operationTipsService.popup('资源不存在');
          break;
        case 408:
          this.operationTipsService.popup('请求超时，请重试');
          break;
      }

      if (err.status >= 500 && err.status < 600) {
        switch (err.status) {
          case 502:
            this.operationTipsService.popup('网络错误');
            break;
          case 504:
            this.operationTipsService.popup('请求超时，请重试');
            break;
          default:
            this.operationTipsService.popup('服务器内部错误，请重试');
            break;
        }
      }

      if (err._body.code) {
        switch (err._body.code) {
          case 400001: {
            this.operationTipsService.popup('请支付');
          }
          case 400002: {
            this.operationTipsService.popup('无需支付');
          }
          case 400003: {
            this.operationTipsService.popup('无法识别支付平台');
          }
          case 400101: {
            this.operationTipsService.popup('订单已支付');
          }
          case 400102: {
            this.operationTipsService.popup('订单已关闭');
          }
        }
      }

      return Observable.throw(err);
    });
  }
}

