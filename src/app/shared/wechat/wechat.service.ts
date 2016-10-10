import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Subject} from 'rxjs/Subject';

import {AppConfig} from '../../app.config';
import {WechatConfigModel, WechatAudioModel} from './wechat.model';
import {StoreService} from '../store/store.service';

declare var wx: any;

@Injectable()
export class WechatService {
  private wechatUrl: string;
  private recordSource = new Subject<WechatAudioModel>();
  private hasInit: boolean;
  playingVoiceId = '';
  onVoicePlayEnd: any;

  record$ = this.recordSource.asObservable();

  constructor(private http: Http, private config: AppConfig, private store: StoreService) {
    this.wechatUrl = `${config.urlPrefix.io}/api/wechat/signature/config`;
  }

  isInWechat(): boolean {
    return /micromessenger/i.test(window.navigator.userAgent);
  }

  getWechatConfig(): Promise<WechatConfigModel> {
    return this.http.post(this.wechatUrl, null).toPromise()
      .then(res => {
        return res.json() as WechatConfigModel;
      })
  }

  configWechat() {
    this.getWechatConfig().then(config => {
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
      ]

      wx.config(config)
    })
  }


  initWechat(): Promise<string> {
    var hasRetry: boolean
    let thiz = this;

    return new Promise<string>((resolve, reject) => {
      wx.error(reason => {
        console.log('wx err:', reason)
        if (hasRetry) return reject(reason) // TODO：全局错误处理

        this.configWechat()

        hasRetry = true
      })

      wx.ready(() => {
        this.hasInit = true

        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: (res) => {
            this.recordSource.next(res.localId)
          }
        })

        wx.onVoicePlayEnd({
          success: function (res) {
            thiz.onVoicePlayEnd(this.playingVoiceId);
            this.playingVoiceId = '' // 返回音频的本地ID
          }
        })

        resolve()
      })

      this.configWechat()
    })
  }

  share(title: string, desc: string, cover: string, link: string, liveId?: string) {
    if (desc.length > 19) desc = `${desc.slice(0, 18)}...`
    desc = `${desc}#白丁直播#`

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: function () {
        if (liveId) this.confirmShare(liveId)
      },
      cancel: function () {
      }
    })

    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: function () {
        if (liveId) this.confirmShare(liveId)
      },
      cancel: function () {
      }
    })

    wx.onMenuShareQQ({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: function () {
        if (liveId) this.confirmShare(liveId)
      },
      cancel: function () {
      }
    })

    wx.onMenuShareWeibo({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: function () {
        if (liveId) this.confirmShare(liveId)
      },
      cancel: function () {
      }
    })

    wx.onMenuShareQZone({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: function () {
        if (liveId) this.confirmShare(liveId)
      },
      cancel: function () {
      }
    })
  }

  confirmShare(liveId: string): Promise<void> {
    let url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/share`
    return this.http.post(url, null).toPromise()
      .then(res => {
        return
      })
  }

  startRecord() {
    if (!this.hasInit) return

    wx.startRecord()
  }

  stopRecord() {
    if (!this.hasInit) return

    wx.stopRecord({
      success: (res) => {
        this.processVoice(res.localId).then((audioModel) => {
          this.recordSource.next(audioModel)
        })
      }
    })
  }

  cancelRecord() {
    if (!this.hasInit) return

    wx.stopRecord({})
  }

  playVoice(id: string) {
    if (this.playingVoiceId != '') this.stopVoice(this.playingVoiceId)

    wx.playVoice({
      localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
    })

    this.playingVoiceId = id
  }

  stopVoice(id: string) {
    wx.stopVoice({
      localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
    })

    this.playingVoiceId = ''
  }

  uploadVoice(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      wx.uploadVoice({
        localId: id, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: (res) => {
          resolve(res.serverId) // 返回音频的服务器端ID
        }
      })
    })
  }

  downloadVoice(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      wx.downloadVoice({
        serverId: id, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function (res) {
          resolve(res.localId) // 返回音频的本地ID
        }
      })
    })
  }

  translateVoice(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      wx.translateVoice({
        localId: id, // 需要识别的音频的本地Id，由录音相关接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: (res) => {
          resolve(res.translateResult); // 语音识别的结果
        }
      })
    })
  }

  processVoice(id: string): Promise<WechatAudioModel> {
    return new Promise<WechatAudioModel>((resolve, reject) => {
      Promise.all([this.translateVoice(id), this.uploadVoice(id)]).then(result => {
        let translateResult = result[0]
        let serverId = result[1]
        var audioModel = new WechatAudioModel()
        audioModel.localId = id
        audioModel.serverId = serverId
        audioModel.translateResult = translateResult

        resolve(audioModel)
      })
    })
  }
}
