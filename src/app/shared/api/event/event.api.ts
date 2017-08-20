import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {EventModel, EventTicketFeeModel} from "./event.model";
import {UtilsService} from "../../utils/utils";
import {WechatConfigService} from "../../wechat/wechat.service";
import {PayPopupService} from "../../pay-popup/pay-popup.service";
import {Subscription} from "rxjs/Subscription";
import {CustomHttp} from "../custom-http.service";
import {OrderApiService} from "../order/order.api";
import {appConfig, host} from "../../../../environments/environment";

@Injectable()
export class EventApiService {
  private payPopupSub: Subscription;

  constructor(private http: CustomHttp,
              private wechatConfigService: WechatConfigService,
              private payPopupService: PayPopupService,
              private orderApiService: OrderApiService) {
  }

  getEventData(id: string): Promise<EventModel> {
    const url = `${host.io}/api/live/events/${id}`;
    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      return new EventModel(data);
    });
  }

  private wechatPay(eventId: string, quantity: number, ticketId: string): Promise<string> {
    const payUrl = `${host.io}/api/live/events/${eventId}/tickets/pay`;

    return new Promise((resolve, reject) => {
      this.http.post(payUrl, {"platform": 1, quantity: quantity, ticketId: ticketId}).toPromise().then(res => {
        const data = res.json();

        if (data.isOngoing) {
          resolve('');
          return;
        }

        const wxPayReq = data.wxPay.request;

        //hack uiwebview
        if (UtilsService.isiOS) {
          let url = location.href;
          location.href = `${appConfig.payAddress}?req=${encodeURIComponent(JSON.stringify(wxPayReq))}&backto=${encodeURIComponent(url)}`;
          resolve('cancel');
          return;
        }

        // for android
        history.pushState({}, '微信支付', appConfig.payAddress);

        setTimeout(() => {
          this.wechatConfigService.init().then(() => {
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
                  reject('fail');
                  throw `wechat pay failed: ${res.err_msg}`;
                }
              }
            );
          }).finally(() => {
            history.back();
          });
        });
        
      }, (err) => {
        reject('fail');
      });
    });
  }

  _pcPay(eventId: string, quantity: number, ticketId: string): Promise<string> {
    const payUrl = `${host.io}/api/live/events/${eventId}/tickets/pay`;
    const clear = (timer?: any) => {
      clearInterval(timer);
      if (this.payPopupSub) this.payPopupSub.unsubscribe();
      this.payPopupService.switch(false);
    };

    return new Promise((resolve, reject) => {
      this.http.post(payUrl, {"platform": 2, quantity: quantity, ticketId: ticketId}).toPromise().then(res => {
        const data = res.json();

        if (data.isOngoing) {
          resolve('');
          return;
        }

        const orderNo = data.orderNo;

        this.payPopupService.switch(true);
        this.payPopupService.setPayUrl(data.wxPay.codeUrl);
        this.payPopupSub = this.payPopupService.close$.subscribe(() => {
          reject('cancel');
          this.payPopupSub.unsubscribe();
        });

        // TODO check payment status?
        let count = 0;
        const timer = setInterval(() => {
          this.orderApiService.getOrderData(orderNo).then(result => {
            if (result.isSuccess) {
              resolve('');
              clear(timer);
              return;
            }

            if (result.isClosed) {
              resolve('closed');
              clear(timer);
              return;
            }

            if (count > 100) {
              reject('timeout');
              clear(timer);
              return;
            }

            count++;
          });
        }, 3 * 1000);
      }, (err) => {
        reject('fail');
        clear();
      });
    });
  }

  pcPay(eventId: string, quantity: number, ticketId: string): Promise<string> {
    return this._pcPay(eventId, quantity, ticketId);
  }

  pay(eventId: string, quantity: number, ticketId: string): Promise<string> {
    if (UtilsService.isInWechat && !UtilsService.isWindowsWechat) {
      return this.wechatPay(eventId, quantity, ticketId);
    } else if (UtilsService.isInApp) {
      // TODO: app payment, 在ios中不能使用微信支付, 付费直播间app中不可点击
    } else {
      return this.pcPay(eventId, quantity, ticketId);
    }
  }

  fee(eventId: string, quantity: number, ticketId: string): Promise<EventTicketFeeModel> {
    const payUrl = `${host.io}/api/live/events/${eventId}/tickets/fee`;
    const data = {"platform": 1, quantity: quantity, ticketId: ticketId};

    return this.http.post(payUrl, data).toPromise().then(res => {
      const data = res.json();
      return new EventTicketFeeModel(data.totalDiscountedFee, data.totalFee, data.totalPrice);
    });
  }
}
