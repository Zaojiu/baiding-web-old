import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {WechatConfigModel} from './wechat.model';
import {environment} from "../../../environments/environment";
import {OperationTipsService} from "../operation-tips/operation-tips.service";
import {Router, RoutesRecognized} from "@angular/router";

declare var wx: any;

@Injectable()
export class WechatConfigService {
  private cachedConfig = null;
  private needResign = true;
  onVoicePlayEnd: () => void;
  autoCompleteResolver: (localId: string) => void;
  autoCompleteRejecter: (reason: string) => void;

  constructor(private http: Http, private tipsService: OperationTipsService, private router: Router) {
    this.router.events.filter(e => e instanceof RoutesRecognized).subscribe(() => {
      this.needResign = true;
    });
  }

  private getConfig(): Promise<WechatConfigModel> {
    return this.http.post(`${environment.config.host.io}/api/wechat/signature/config`, null).toPromise()
      .then(res => {
        return res.json() as WechatConfigModel;
      });
  }

  private configWechat(needRefresh = false) {
    if (this.cachedConfig && !needRefresh) {
      console.log('cache wechat config: ', this.cachedConfig);
      wx.config(this.cachedConfig);
      return;
    }

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
        'onMenuShareQZone',
        'chooseImage',
        'uploadImage',
      ];

      config.debug = false;

      console.log('new wechat config: ', config);

      wx.config(config);
      this.cachedConfig = config;
    });
  }

  init(): Promise<void> {
    console.log('wechat init');

    if (!this.needResign) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      wx.error(err => {
        console.log('wx err:', err);

        if (err.errMsg === 'config:invalid signature') {
          this.configWechat(true);
        } else {
          this.tipsService.popup('微信初始化失败, 请刷新页面');
          throw new Error(err && err.errMsg ? err.errMsg : err);
        }
      });

      wx.ready(() => {
        console.log('wechat ready');

        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: (res) => {
            console.log(this.autoCompleteResolver, res.localId, 'had auto complete');
            if (this.autoCompleteResolver) this.autoCompleteResolver(res.localId);
          },
          fail: (reason) => {
            if (this.autoCompleteRejecter) this.autoCompleteRejecter(reason);
          }
        });

        wx.onVoicePlayEnd({
          success: res => {
            if (this.onVoicePlayEnd) this.onVoicePlayEnd();
          }
        });

        resolve();
      });

      console.log('config wechat at init');
      this.configWechat();
      this.needResign = false;
    });
  }

  closeWindow() {
    wx.closeWindow();
  }
}
