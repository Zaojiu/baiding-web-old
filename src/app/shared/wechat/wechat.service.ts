import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {AppConfig} from '../../app.config';
import {WechatConfigModel, WechatAudioModel} from './wechat.model';
import {StoreService} from '../store/store.service';

interface Window {
  navigator: any;
}

declare var window: Window;
declare var wx: any;

@Injectable()
export class WechatService {
  private wechatUrl: string;
  private hasInit: boolean;
  playingVoiceId = '';
  private _onVoicePlayEnd: (id: string) => void;
  private autoCompleteResolver: (audioModel: WechatAudioModel) => void;
  private autoCompleteRejecter: (reason: string) => void;

  constructor(private http: Http, private config: AppConfig, private store: StoreService) {
    this.wechatUrl = `${config.urlPrefix.io}/api/wechat/signature/config`;
  }

  static isInWechat(): boolean {
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
      ];

      console.log('wechat config: ', config);

      wx.config(config);
    })
  }


  initWechat(): Promise<string> {
    var hasRetry: boolean;

    return new Promise<string>((resolve, reject) => {
      wx.error(reason => {
        console.log('wx err:', reason);

        if (hasRetry) {
          return reject(reason);
        }// TODO：全局错误处理

        this.configWechat();

        hasRetry = true;
      });

      wx.ready(() => {
        this.hasInit = true;

        console.log('wechat init');

        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: (res) => {
            if (this.autoCompleteResolver) {
              this.processVoice(res.localId).then(audioModel => {
                audioModel.duration = 60;
                this.autoCompleteResolver(audioModel);
                console.log('wechat record translate & upload done successful: ', res.localId, audioModel);
              }, (err) => {
                this.autoCompleteRejecter(err);
              });
            }
          }
        });

        wx.onVoicePlayEnd({
          success: res => {
            if (this._onVoicePlayEnd) {
              this._onVoicePlayEnd(this.playingVoiceId);
            }
            this.playingVoiceId = ''; // 返回音频的本地ID
          }
        });

        resolve();
      });

      this.configWechat();
    })
  }

  share(title: string, desc: string, cover: string, link: string, liveId?: string) {
    if (desc.length > 19) desc = `${desc.slice(0, 18)}...`;
    desc = `${desc}#白丁直播#`;

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
      },
      cancel: () => {
      }
    });

    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
      },
      cancel: () => {
      }
    });

    wx.onMenuShareQQ({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
      },
      cancel: () => {
      }
    });

    wx.onMenuShareWeibo({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId);
      },
      cancel: () => {
      }
    });

    wx.onMenuShareQZone({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: cover, // 分享图标
      success: () => {
        if (liveId) this.confirmShare(liveId)
      },
      cancel: () => {
      }
    })
  }

  confirmShare(liveId: string): Promise<void> {
    let url = `${this.config.urlPrefix.io}/api/live/streams/${liveId}/share`;

    return this.http.post(url, null).toPromise().then(res => {});
  }

  startRecord(): Promise<void> {
    if (!this.hasInit) return Promise.reject('微信未初始化');

    return new Promise((resolve, reject) => {
      wx.startRecord({
        success: () => {
          resolve();
        },
        fail: (err) => {
          reject(err);
        }
      })
    });
  }

  autoCompelete(): Promise<WechatAudioModel> {
    if (!this.hasInit)  return Promise.reject('微信未初始化');

    return new Promise((resolve, reject) => {
      this.autoCompleteResolver = resolve;
      this.autoCompleteResolver = reject;
    });
  }

  stopRecord(duration: number): Promise<WechatAudioModel> {
    if (!this.hasInit) return Promise.reject('微信未初始化');

    return new Promise((resolve, reject) => {
      wx.stopRecord({
        success: (res) => {
          console.log('wechat record stop successful');

          this.processVoice(res.localId).then((audioModel) => {
            audioModel.duration = duration;
            resolve(WechatAudioModel);
            console.log('wechat record translate & upload done successful: ', res.localId, audioModel);
          }, (err) => {
            reject(err);
          });
        },
        fail: (err) => {
          reject(err);
        }
      })
    });
  }

  cancelRecord(): Promise<void> {
    if (!this.hasInit) return Promise.reject('微信未初始化');

    return new Promise((resolve, reject) => {
      wx.stopRecord({
        success: () => {
          resolve();
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  }

  playVoice(id: string): Promise<string> {

    if (this.playingVoiceId !== '') {
      this.stopVoice(this.playingVoiceId);
    }

    return new Promise<string>((resolve, reject) => {

      this._onVoicePlayEnd = localId => {
        resolve(localId);
        this.playingVoiceId = '';
      };

      wx.playVoice({
        localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
      });

      this.playingVoiceId = id;
    });
  }

  stopVoice(id: string) {
    wx.stopVoice({
      localId: id // 需要播放的音频的本地ID，由stopRecord接口获得
    });

    this.playingVoiceId = '';
  }

  uploadVoice(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      wx.uploadVoice({
        localId: id, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: (res) => {
          resolve(res.serverId); // 返回音频的服务器端ID
        },
        fail: (err) => {
          reject(err);
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
          resolve(res.localId); // 返回音频的本地ID
        },
        fail: (err) => {
          reject(err);
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
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  }

  processVoice(id: string): Promise<WechatAudioModel> {
    console.log('start process voice');

    return new Promise<WechatAudioModel>((resolve, reject) => {
      Promise.all([this.translateVoice(id), this.uploadVoice(id)]).then(result => {
        console.log('process voice result: ', result);
        let translateResult = result[0];
        let serverId = result[1];
        var audioModel = new WechatAudioModel();
        audioModel.localId = id;
        audioModel.serverId = serverId;
        audioModel.translateResult = translateResult;

        resolve(audioModel)
      }, (err) => {
        reject(err);
      });
    })
  }
}
