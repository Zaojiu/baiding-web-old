import {isInWechat, readCookie, serializeObj} from "./utils";
import {post} from "../api/xhr";
import {environment, host} from "../../env/environment";

declare const wx: any;
declare const trackJs: any;

enum App {
  AppH5 = 1,
  AppMiniapp = 11,
  AppIOS = 20,
  AppAndroid = 21,
}

export enum EventType {
  Enterpage = 1,
  Pageview = 2,
  Praise = 3,
  Favorite = 4,
  Share = 5,
  Online = 7,
  MediaPlay = 20,
  MediaBuffer = 21,
  MediaSeek = 22,
}

export enum ObjectType {
  stream = 1,
  talk = 2,
  media = 3,
  message = 100,
}

export enum SharePlatform {
  zaojiu = 1,
  qq = 20,
  qzone = 21,
  wechatTimeline = 22,
  wechatFriend = 23,
  wechatGroup = 24,
  weibo = 50,
}

export enum MediaPlayer {
  h5 = 1,
  flash = 2,
  native = 3,
}

export enum MediaType {
  Video = 1,
  Audio = 2,
}

export enum MediaAction {
  Buffer = 1,
  Play = 2,
  Seek = 3,
}

export enum MediaQuality {
  Original = 1,
  SD360P = 2,
  SD540P = 3,
  HD720P = 4,
  HD1080P = 5,
}

export enum MediaFormat {
  flv = 1,
  mp4 = 2,
  m3u8 = 3,
  rtmp = 4,
}

export enum NetworkType {
  Other = 0,
  Wifi = 1,
  Net2G = 2,
  Net3G = 3,
  Net4G = 4,
}

export class MediaInfo {
  mediaUrl: string;
  mediaType: MediaType;
  mediaQuality: MediaQuality;
  mediaFormat: MediaFormat;
  mediaOffset: number;
  mediaTotalDur: number;
  mediaLive: boolean;
  mediaPlayer: MediaPlayer;
}

export class TargetInfo {
  targetId: string;
  targetType: ObjectType;
}

export class OnlineInfo {
  stayDur: number;
  playDur: number;
  scroll: number;
}

export class OnlineParams {
  isPlaying: () => boolean;
  getMediaInfo: () => MediaInfo;
  currentScroll: () => number;
}

let inited = false;
let network = NetworkType.Other;
let lastTime = 0;

const updateNetworkType = () => {
  if (!isInWechat) return;

  const now = (new Date()).getTime();
  if (now - lastTime < 10000) return;

  wx.getNetworkType({
    success: (res: any) => {
      switch (res.networkType) {
        case "2g":
          network = NetworkType.Net2G;
          break;
        case "3g":
          network = NetworkType.Net3G;
          break;
        case "4g":
          network = NetworkType.Net4G;
          break;
        case "wifi":
          network = NetworkType.Wifi;
          break;
        default:
          network = NetworkType.Other;
      }
    },
    fail: () => {
      network = NetworkType.Other;
    }
  })
};

updateNetworkType();

const collectCommonValues = (event: EventType): any => {
  return {
    app: App.AppH5,
    event: event,
    url: location.href,
    referer: document.referrer,
    lang: navigator.language,
    network: network,
  }
};

const collectPerformanceValues = (): any => {
  const params: {[key: string]: number} = {};
  const t = window.performance.timing;
  if (!t) {
    return params
  }
  params['dnsLookup'] = t.domainLookupEnd - t.domainLookupStart || 0;
  if (t.secureConnectionStart > 0) {
    params['connSecure'] = t.connectEnd - t.secureConnectionStart || 0;
  }
  if (t.connectEnd > 0) {
    params['connInit'] = t.connectEnd - t.connectStart || 0;
  }
  if (t.responseStart > 0) {
    params['requestDur'] = t.responseStart - t.requestStart || 0;
  }
  if (t.responseEnd > 0) {
    params['responseDur'] = t.responseEnd - t.responseStart || 0;
    params['networkDur'] = t.responseEnd - t.navigationStart || 0;
    params['loadDur'] = (new Date()).getTime() - t.responseEnd || 0;
  }
  return params
};

const sendRequest = async (event: EventType, params: any) => {
  let values = Object.assign(collectCommonValues(event), params);

  updateNetworkType();

  let body = new URLSearchParams();
  for (let key in values) {
    body.set(key, values[key])
  }
  if (environment.production) {
    await post(`${host.io}/api/stats/record`, body);
    const userCookie = readCookie('_cur_user');
    const userObj = serializeObj(userCookie);
    const uid = userObj['uid'];
    const sessCookie = readCookie('_sess');
    const sessObj = serializeObj(sessCookie);
    const sessId = sessObj['v'];
    if (trackJs && uid) trackJs.configure({ userId: uid});
    if (trackJs && sessId) trackJs.configure({ sessionId: sessId});
  }
};

export const eventEnterpage = () => {
  if (inited) return;
  inited = true;
  const params = collectPerformanceValues();
  sendRequest(EventType.Enterpage, params)
};

export const eventPageview = () => {
  const params = {};
  sendRequest(EventType.Pageview, params)
};

export const eventPraise = (obj?: TargetInfo) => {
  const params = Object.assign({}, obj);
  sendRequest(EventType.Praise, params)
};

export const eventFavorite = (obj?: TargetInfo) => {
  const params = Object.assign({}, obj);
  sendRequest(EventType.Favorite, params);
};

export const eventShare = (platform: SharePlatform) => {
  const params = {
    shareTo: platform,
  };
  sendRequest(EventType.Share, params);
};

export const eventMediaPlay = (media: MediaInfo, bufferDur: number) => {
  const params = Object.assign({
    bufferDur: bufferDur,
  }, media);
  sendRequest(EventType.MediaPlay, params)
};

export const eventMediaBuffer = (media: MediaInfo) => {
  const params = Object.assign({
  }, media);
  sendRequest(EventType.MediaBuffer, params)
};

export const eventMediaSeek = (media: MediaInfo, from: number, to: number, dur: number) => {
  const params = Object.assign({
    seekFrom: from,
    seekTo: to,
    seekDur: dur,
  }, media);
  sendRequest(EventType.MediaSeek, params)
};

export const eventOnline = (media: MediaInfo, online: OnlineInfo) => {
  const params = Object.assign({}, media, online);
  sendRequest(EventType.Online, params)
};
