import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {PayBridge} from "../pay.interface";
import {Headers, Http} from "@angular/http";
import {WechatConfigService} from "../../wechat/wechat.service";
declare var wx: any;

@Injectable()
export class WechatPayService implements PayBridge {

  constructor(private http: Http, private wechatConfigService: WechatConfigService) {
  }

  private _pay(liveId: string): Promise<string> {
    const payUrl = `${environment.config.host.io}/api/live/streams/${liveId}/pay`;
    let headers = new Headers({'Content-Type': 'application/json'})

    return this.http.post(payUrl, JSON.stringify({"platform": 1}), {headers: headers}).toPromise().then(res => {
      return new Promise((resolve, reject) => {
        let data = res.json();
        let wxPayReq = data.wxPay.request;

        history.pushState({}, '微信支付', environment.config.payAddress);

        (<any>window).WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": wxPayReq.appId,     //公众号名称，由商户传入
            "timeStamp": wxPayReq.timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr": wxPayReq.nonceStr, //随机串
            "package": wxPayReq.package,
            "signType": wxPayReq.signType,         //微信签名方式：
            "paySign": wxPayReq.paySign //微信签名
          },
          function (res) {
            console.log(res);

            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              resolve('');
            } else {
              reject(res.err_msg);
            }

            history.back();
          }
        );
      });
    });
  }

  pay(liveId: string): Promise<string> {
    return this.wechatConfigService.init().then(() => {
      console.log('init done');
      return this._pay(liveId);
    })
  }
}
