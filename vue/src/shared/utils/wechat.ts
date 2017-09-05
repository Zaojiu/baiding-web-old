import {host} from "../../env/environment";
import {post} from "../api/xhr";
import {AxiosResponse} from "axios";
import {showTips} from "../../store/tip";
import router from "../../router";
import {RawLocation, Route} from "vue-router";
import Vue from "vue";

declare const wx: any;

class WechatConfigModel {
  debug: boolean;
  appId: number;
  nonceStr: string;
  timestamp: string;
  signature: string;
  jsApiList: string[];
}

class Wechat {
  private cachedConfig: WechatConfigModel;
  needResign = true;
  onVoicePlayEnd: () => void;
  autoCompleteResolver: (localId: string) => void;
  autoCompleteRejecter: (reason: string) => void;

  constructor() {
    router.beforeEach((to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) => {
      this.needResign = true;
      next();
    });
  }

  private async getConfig(): Promise<WechatConfigModel> {
    let resp: AxiosResponse;
    try {
      resp = await post(`${host.io}/api/wechat/signature/config`, null);
    } catch (e) {
      throw e;
    }

    return resp.data;
  }

  private async configWechat(needRefresh = false) {
    if (this.cachedConfig && !needRefresh) {
      console.log('cache wechat config: ', this.cachedConfig);
      wx.config(this.cachedConfig);
      return;
    }

    let config: WechatConfigModel;
    try {
      config = await this.getConfig();
    } catch (e) {
      throw e;
    }

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
  }

  async init(): Promise<void> {
    console.log('wechat init');

    if (!this.needResign) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      wx.error((err: any) => {
        console.log('wx err:', err);
        showTips('微信初始化失败, 请刷新页面');
        throw new Error(err && err.errMsg ? err.errMsg : err);
      });

      wx.ready(() => {
        console.log('wechat ready');

        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: (res: any) => {
            if (this.autoCompleteResolver) this.autoCompleteResolver(res.localId);
          },
          fail: (reason: any) => {
            if (this.autoCompleteRejecter) this.autoCompleteRejecter(reason);
          }
        });

        wx.onVoicePlayEnd({
          success: (res: any) => {
            if (this.onVoicePlayEnd) this.onVoicePlayEnd();
          }
        });

        resolve();
      });

      console.log('config wechat at init');
      this.configWechat(true);
      this.needResign = false;
    });
  }

  closeWindow() {
    wx.closeWindow();
  }

  pay(wxPayReq: any): Promise<void> {
    return new Promise((resolve, reject) => {
      (<any>window).WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          "appId": wxPayReq.appId,     //公众号名称，由商户传入
          "timeStamp": wxPayReq.timeStamp,         //时间戳，自1970年以来的秒数
          "nonceStr": wxPayReq.nonceStr, //随机串
          "package": wxPayReq.package,
          "signType": wxPayReq.signType,         //微信签名方式：
          "paySign": wxPayReq.paySign //微信签名
        },
        function (res: any) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            resolve();
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
            reject('cancel');
          } else {
            reject(`wechat pay failed: ${res.err_msg}`);
          }
        }
      );
    });
  }
}

export const wechat = new Wechat();
