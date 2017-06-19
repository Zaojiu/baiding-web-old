import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { environment } from '../../../environments/environment';
import { UtilsService } from "../utils/utils";

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
  mediaUrl: string
  mediaType: MediaType
  mediaQuality: MediaQuality
  mediaFormat: MediaFormat
  mediaOffset: number
  mediaTotalDur: number
  mediaLive: boolean
  mediaPlayer: MediaPlayer
}

export class TargetInfo {
  targetId: string
  targetType: ObjectType
}

export class OnlineInfo {
  stayDur: number
  playDur: number
  scroll: number
}

type OnlineCallbackSet = (MediaInfo, OnlineInfo) => void
export class OnlineParams {
  isPlaying: () => boolean
  getMediaInfo: () => MediaInfo
  currentScroll: () => number
}

export class OnlineService {
  private timer: any
  private firstStay: boolean
  private stayDur: number = 0
  private playDur: number = 0
  private scroll: number = 0
  private lastScroll: number = 0

  constructor(private analytics: AnalyticsService, private params: OnlineParams) {
  }

  start() {
    this.timer = setInterval(() => {

      this.stayDur += 1000
      if (this.params.isPlaying()) {
        this.playDur += 1000
      }

      let scroll = this.params.currentScroll()
      if (scroll < this.lastScroll) {
        this.scroll += this.lastScroll - scroll
      } else {
        this.scroll += scroll - this.lastScroll
      }
      this.lastScroll = scroll

      if (this.stayDur >= 10000 || !this.firstStay && this.stayDur >= 5000) {
        this.firstStay = true
        let media = this.params.getMediaInfo()
        let online = new OnlineInfo()
        online.playDur = this.playDur
        online.stayDur = this.stayDur
        online.scroll = this.scroll

        this.stayDur = 0
        this.playDur = 0
        this.scroll = 0

        this.analytics.eventOnline(media, online)
      }

    }, 1000);
  }

  destroy() {
    clearInterval(this.timer)
  }
}

@Injectable()
export class AnalyticsService {
  private static inited: boolean;
  private static network: NetworkType = NetworkType.Other;
  private static lastTime: number = 0;

  constructor(private http: Http) {
    this.updateNetworkType()
  }

  eventEnterpage() {
    let inited = AnalyticsService.inited;
    if (inited) {
      return
    }
    AnalyticsService.inited = true
    var params = this.collectPerformanceValues()
    this.sendRequest(EventType.Enterpage, params)
  }

  eventPageview() {
    var params = {}
    this.sendRequest(EventType.Pageview, params)
  }

  eventPraise(obj: TargetInfo = null) {
    var params = {}
    params = _.assign(params, obj)
    this.sendRequest(EventType.Praise, params)
  }

  eventFavorite(obj: TargetInfo = null) {
    var params = _.assign({}, obj)
    this.sendRequest(EventType.Favorite, params)
  }

  eventShare(platform: SharePlatform) {
    var params = {
      shareTo: platform,
    }
    this.sendRequest(EventType.Share, params)
  }

  eventMediaPlay(media: MediaInfo, bufferDur: number) {
    var params = _.assign({
      bufferDur: bufferDur,
    }, media)
    this.sendRequest(EventType.MediaPlay, params)
  }

  eventMediaBuffer(media: MediaInfo) {
    var params = _.assign({
    }, media)
    this.sendRequest(EventType.MediaBuffer, params)
  }

  eventMediaSeek(media: MediaInfo, from: number, to: number, dur: number) {
    var params = _.assign({
      seekFrom: from,
      seekTo: to,
      seekDur: dur,
    }, media)
    this.sendRequest(EventType.MediaSeek, params)
  }

  onlineService(params: OnlineParams) {
    return new OnlineService(this, params)
  }

  eventOnline(media: MediaInfo, online: OnlineInfo) {
    var params = _.assign({}, media, online)
    this.sendRequest(EventType.Online, params)
  }

  private collectCommonValues(event: EventType): any {
    return {
      app: App.AppH5,
      event: event,
      url: location.href,
      referer: document.referrer,
      lang: navigator.language,
      network: AnalyticsService.network,
    }
  }

  private updateNetworkType() {
    if (!UtilsService.isInWechat) {
      return
    }

    let now = (new Date()).getTime()
    if (now - AnalyticsService.lastTime < 10000) {
      return
    }

    wx.getNetworkType({
      success: (res) => {
        switch (res.networkType) {
          case "2g":
            AnalyticsService.network = NetworkType.Net2G
            break
          case "3g":
            AnalyticsService.network = NetworkType.Net3G
            break
          case "4g":
            AnalyticsService.network = NetworkType.Net4G
            break
          case "wifi":
            AnalyticsService.network = NetworkType.Wifi
            break
          default:
            AnalyticsService.network = NetworkType.Other
        }
      },
      fail: (err) => {
        AnalyticsService.network = NetworkType.Other
      }
    })
  }

  private collectPerformanceValues(): any {
    var params = {}
    let t = window.performance.timing
    if (!t) {
      return params
    }
    params['dnsLookup'] = t.domainLookupEnd - t.domainLookupStart || 0
    if (t.secureConnectionStart > 0) {
      params['connSecure'] = t.connectEnd - t.secureConnectionStart || 0
    }
    if (t.connectEnd > 0) {
      params['connInit'] = t.connectEnd - t.connectStart || 0
    }
    if (t.responseStart > 0) {
      params['requestDur'] = t.responseStart - t.requestStart || 0
    }
    if (t.responseEnd > 0) {
      params['responseDur'] = t.responseEnd - t.responseStart || 0
      params['networkDur'] = t.responseEnd - t.navigationStart || 0
      params['loadDur'] = (new Date()).getTime() - t.responseEnd || 0
    }
    return params
  }

  private sendRequest(event: EventType, params: any) {
    let values = _.assign(this.collectCommonValues(event), params)

    this.updateNetworkType()

    let body = new URLSearchParams();
    for (let key in values) {
       body.set(key, values[key])
    }
    if (environment.production) {
      this.http.post(`${environment.config.host.io}/api/stats/record`, body).toPromise();
      const userCookie = UtilsService.readCookie('_cur_user');
      const userObj = UtilsService.serializeObj(userCookie);
      const uid = userObj['uid'];
      const sessCookie = UtilsService.readCookie('_sess');
      const sessObj = UtilsService.serializeObj(sessCookie);
      const sessId = sessObj['v'];
      if (trackJs && uid) trackJs.configure({ userId: uid});
      if (trackJs && sessId) trackJs.configure({ sessionId: sessId});
    }
  }
}
