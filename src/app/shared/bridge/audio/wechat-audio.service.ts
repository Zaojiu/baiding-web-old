import {Injectable} from '@angular/core';
import {WechatConfigService} from "../../wechat/wechat.service";
import {AudioModel} from "../bridge.interface";

declare var wx: any;

@Injectable()
export class WechatAudioService {
  playingVoiceId = '';
  private onVoicePlayEnd: (id: string) => void;
  private autoCompleteResolver: (localId: string) => void;
  private autoCompleteRejecter: (reason: string) => void;

  constructor(private wechatConfigService: WechatConfigService) {
  }

  private _startRecord(): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.startRecord({
        success: () => {
          console.log('wechat audio start successful');
          resolve();
        },
        fail: (err) => {
          console.log('wechat audio start failed');
          reject(err);
        }
      })
    })
  }

  startRecord(): Promise<void> {
    if (!this.wechatConfigService.hasInit) {
      return this.wechatConfigService.initWechat().then(() => {
        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: (res) => {
            if (this.autoCompleteResolver) this.autoCompleteResolver(res.localId);
          },
          fail: (reason) => {
            if (this.autoCompleteRejecter) this.autoCompleteRejecter(reason);
          }
        });

        wx.onVoicePlayEnd({
          success: res => {
            if (this.onVoicePlayEnd) {
              this.onVoicePlayEnd(this.playingVoiceId);
            }

            this.playingVoiceId = ''; // 返回音频的本地ID
          }
        });

        return this._startRecord();
      });
    } else {
      return this._startRecord();
    }
  }

  autoCompelete(): Promise<string> {
    if (!this.wechatConfigService.hasInit) {
      return this.wechatConfigService.initWechat().then(() => {
        return new Promise((resolve, reject) => {
          this.autoCompleteResolver = resolve;
          this.autoCompleteRejecter = reject;
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.autoCompleteResolver = resolve;
        this.autoCompleteRejecter = reject;
      });
    }

  }

  private _stopRecord(duration: number): Promise<AudioModel> {
    return new Promise((resolve, reject) => {
      wx.stopRecord({
        success: (res) => {
          console.log('wechat audio stop successful');

          this.processVoice(res.localId).then((audioModel) => {
            audioModel.duration = duration;
            console.log('wechat audio translate & upload done successful: ', res.localId, audioModel);
            resolve(audioModel);
          }, (err) => {
            console.log('wechat audio translate & upload done failed');
            reject(err);
          });
        },
        fail: (err) => {
          console.log('wechat audio stop failed');
          reject(err);
        }
      })
    });
  }

  stopRecord(duration: number): Promise<AudioModel> {
    if (!this.wechatConfigService.hasInit) {
      return this.wechatConfigService.initWechat().then(() => {
        return this._stopRecord(duration);
      });
    } else {
      return this._stopRecord(duration);
    }
  }

  private _cancelRecord():Promise<void> {
    return new Promise((resolve, reject) => {
      wx.stopRecord({
        success: () => {
          console.log('wechat audio cancel successful');
          resolve();
        },
        fail: (err) => {
          console.log('wechat audio cancel failed');
          reject(err);
        }
      });
    });
  }

  cancelRecord(): Promise<void> {
    if (!this.wechatConfigService.hasInit) {
      return this.wechatConfigService.initWechat().then(() => {
        return this._cancelRecord();
      });
    } else {
      return this._cancelRecord();
    }
  }

  playVoice(id: string): Promise<string> {
    if (this.playingVoiceId !== '') {
      this.stopVoice(this.playingVoiceId);
    }

    return new Promise<string>((resolve, reject) => {
      this.onVoicePlayEnd = localId => {
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

  private processVoice(id: string): Promise<AudioModel> {
    console.log('start process voice');

    return new Promise<AudioModel>((resolve, reject) => {
      Promise.all([this.translateVoice(id), this.uploadVoice(id)]).then(result => {
        console.log('process voice result: ', result);
        let translateResult = result[0] || '';
        let serverId = result[1];
        var audioModel = new AudioModel();
        audioModel.localId = id;
        audioModel.serverId = serverId;
        audioModel.translateResult = translateResult;

        resolve(audioModel);
      }, (err) => {
        reject(err);
      });
    })
  }
}
