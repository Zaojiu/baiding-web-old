import {Injectable}     from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {appConfig, host} from "../../../../../vue/src/env/environment";
import {EventModel, EventTicketFeeModel, OrderModel} from "./ticket.model";
import {UtilsService} from "../../utils/utils";
import {WechatConfigService} from "../../wechat/wechat.service";
import {PayPopupService} from "../../pay-popup/pay-popup.service";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class EventApiService {
  private payPopupSub: Subscription;

  constructor(private http: Http, private wechatConfigService: WechatConfigService, private payPopupService: PayPopupService) {
  }

  getEventData(id: string): Promise<EventModel> {
    const url = `${host.io}/api/live/events/${id}`;
    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      return new EventModel(data);
    });
  }

  getOrderData(oid: string): Promise<OrderModel> {
    const url = `${host.io}/api/wallet/order/${oid}`;
    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      return new OrderModel(data);
    });
  }

  private _wechatPay(eventId: string, quantity: number): Promise<string> {
    const payUrl = `${host.io}/api/live/events/${eventId}/tickets/pay`;

    return this.http.post(payUrl, {"platform": 1, quantity: quantity}).toPromise().then(res => {
      return new Promise((resolve, reject) => {
        let data = res.json();
        let wxPayReq = data.wxPay.request;

        //hack uiwebview
        if (UtilsService.isiOS) {
          let url = location.href;

          location.href = `${appConfig.payAddress}?req=${encodeURIComponent(JSON.stringify(wxPayReq))}&backto=${encodeURIComponent(url)}`;

          return '';
        }

        if (!(<any>window).WeixinJSBridge) {
          reject('weixin_js_bridge_not_found');
        }

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
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              resolve('');
            } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              reject('cancel');
            } else {
              reject(res.err_msg);
            }
          }
        );
      });
    });
  }

  wechatPay(eventId: string, quantity: number): Promise<string> {
    history.pushState({}, '微信支付', appConfig.payAddress);

    return this.wechatConfigService.init().then(() => {
      return this._wechatPay(eventId, quantity);
    }).finally(() => {
      history.back();
    });
  }

  _pcPay(eventId: string, quantity: number): Promise<string> {
    const payUrl = `${host.io}/api/live/events/${eventId}/tickets/pay`;

    return new Promise((resolve, reject) => {
      this.http.post(payUrl, {"platform": 2}).toPromise().then(res => {
        const data = res.json();
        const orderNo = data.orderNo;
        this.payPopupService.setPayUrl(data.wxPay.codeUrl);
        this.payPopupSub = this.payPopupService.close$.subscribe(() => {
          reject('cancel');
          this.payPopupSub.unsubscribe();
        });

        // TODO check payment status?
        let count = 0;
        let timer = setInterval(() => {
          this.getOrderData(orderNo).then(result => {
            if (result.isSuccess) {
              clearInterval(timer);
              resolve('');
              this.payPopupService.switch(false);
              return;
            }

            if (count > 100) {
              clearInterval(timer);
              reject('timeout'); //若不扫码，最后会出现支付失败，叠加在下面
              if (this.payPopupSub) this.payPopupSub.unsubscribe();
              this.payPopupService.switch(false);
              return;
            }

            count++;
          });
        }, 2500);
      });
    });

  }

  pcPay(eventId: string, quantity: number): Promise<string> {
    this.payPopupService.switch(true);

    return this._pcPay(eventId, quantity);
  }

  fee(eventId: string, quantity: number): Promise<EventTicketFeeModel> {
    const payUrl = `${host.io}/api/live/events/${eventId}/tickets/fee`;

    return this.http.post(payUrl, {"platform": 1, quantity: quantity}).toPromise().then(res => {
      const data = res.json();
      return new EventTicketFeeModel(data.totalDiscountedFee, data.totalFee, data.totalPrice);
    });
  }
}
