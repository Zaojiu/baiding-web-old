import {host} from "../../env/environment";
import {post} from "../api/xhr";
import {AxiosResponse} from "axios";
import {showTips} from "../../store/tip";
import {appendAfterEachHook} from "../../hooks";
import {isAndroid, isInWechat, isiOS} from './utils';

declare const wx: any;

class WechatConfigModel {
  debug: boolean;
  appId: number;
  nonceStr: string;
  timestamp: string;
  signature: string;
  jsApiList: string[];
}

let cachedConfig: WechatConfigModel;
let needResign = true;
let num = 0;
let onVoicePlayEnd: () => void;
let autoCompleteResolver: (localId: string) => void;
let autoCompleteRejecter: (reason: string) => void;

if (isAndroid && isInWechat) {
  appendAfterEachHook((to, from) => needResign = true);
}

if (isiOS && isInWechat) {
  appendAfterEachHook((to, from) => {
    if (num === 0) {
      needResign = true
    } else {
      needResign = false
    }
  });
}

const getConfig = async (): Promise<WechatConfigModel> => {
  let resp: AxiosResponse;
  try {
    resp = await post(`${host.io}/api/wechat/signature/config`, null);
  } catch (e) {
    throw e;
  }

  return resp.data;
};

const configWechat = async (needRefresh = false) => {
  if (cachedConfig && !needRefresh) {
    console.log('cache wechat config: ', cachedConfig);
    wx.config(cachedConfig);
    needResign = false;
    return;
  }

  let config: WechatConfigModel;
  try {
    config = await getConfig();
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
  cachedConfig = config;
};

export const initWechat = async (): Promise<void> => {
  num++;
  console.log('wechat init');
  if (!needResign) return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    wx.error((err: any) => {
      console.log('wx err:', err);
      showTips('微信初始化失败, 请刷新页面');
      needResign = true;
      throw new Error(err && err.errMsg ? err.errMsg : err);
    });

    wx.ready(() => {
      console.log('wechat ready');

      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: (res: any) => {
          if (autoCompleteResolver) autoCompleteResolver(res.localId);
        },
        fail: (reason: any) => {
          if (autoCompleteRejecter) autoCompleteRejecter(reason);
        }
      });

      wx.onVoicePlayEnd({
        success: (res: any) => {
          if (onVoicePlayEnd) onVoicePlayEnd();
        }
      });

      resolve();
    });

    console.log('config wechat at init');
    configWechat(true);
  });
};
