import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {PayBridge} from "../pay.interface";
import {Headers, Http} from "@angular/http";
import {PayPopupService} from "../../pay-popup/pay-popup.service";
import {LiveService} from "../../api/live/live.service";
import {clearInterval} from "timers";

@Injectable()
export class PcPayService implements PayBridge {
  constructor(private http: Http, private payPopupService: PayPopupService, private liveService: LiveService) {
  }

  _pay(liveId: string): Promise<string> {
    const payUrl = `${environment.config.host.io}/api/live/streams/${liveId}/pay`;
    let headers = new Headers({'Content-Type': 'application/json'});

    return new Promise((resolve, reject) => {
      this.http.post(payUrl, JSON.stringify({"platform": 2}), {headers: headers}).toPromise().then(res => {
        let data = res.json();
        this.payPopupService.setPayUrl(data.wxPay.codeUrl);
      });

      let count = 0;
      let timer = setInterval(() => {
        this.liveService.getLiveInfo(liveId, true).then(liveInfo => {
          if (liveInfo.paid) {
            clearInterval(timer);
            resolve('');
            return;
          }

          if (count > 100) {
            clearInterval(timer);
            return;
          }

          count++;
        });
      }, 3000);
    });

  }


  pay(liveId: string): Promise<string> {
    this.payPopupService.popup();

    return this._pay(liveId);
  }
}
