import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {WechatConfigModel} from './wechat.model';
import {environment} from "../../../environments/environment";

declare var wx: any;

@Injectable()
export class WechatConfigService {
  hasInit: boolean;

  constructor(private http: Http) {}

  private getConfig(): Promise<WechatConfigModel> {
    return this.http.post(`${environment.config.host.io}/api/wechat/signature/config`, null).toPromise()
      .then(res => {
        return res.json() as WechatConfigModel;
      })
  }

  private configWechat() {
    this.getConfig().then(config => {
      config.jsApiList = [
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'onVoicePlayEnd',
        'uploadVoice',
        'downloadVoice',
        'translateVoice',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
      ];

      config.debug = false;

      console.log('wechat config: ', config);

      wx.config(config);
    })
  }


  initWechat(): Promise<void> {
    if (this.hasInit) return Promise.resolve();

    var hasRetry: boolean;

    return new Promise<void>((resolve, reject) => {
      wx.error(reason => {
        console.log('wx err:', reason);

        if (hasRetry) return reject(reason); // TODO：全局错误处理

        this.configWechat();

        hasRetry = true;
      });

      wx.ready(() => {
        this.hasInit = true;

        resolve();
      });

      this.configWechat();
    })
  }

  closeWindow() {
    wx.closeWindow();
  }
}
