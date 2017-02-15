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

        wx.chooseWXPay({
          timestamp: wxPayReq.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: wxPayReq.timeStamp, // 支付签名随机串，不长于 32 位
          package: wxPayReq.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: wxPayReq.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: wxPayReq.paySign, // 支付签名
          success: (res) => {
            if (res.err_msg == "get_brand_wcpay_request：ok" ) {
              resolve('');
            } else {
              reject(res.err_msg);
            }
          }
        });

        history.back();
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
