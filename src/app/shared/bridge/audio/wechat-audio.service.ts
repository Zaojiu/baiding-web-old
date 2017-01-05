import {Injectable} from '@angular/core';
import {WechatConfigService} from "../../wechat/wechat.service";
import {AudioBridge} from "../audio.interface";

declare var wx: any;

@Injectable()
export class WechatAudioService implements AudioBridge {
  playingVoiceId = '';

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
          console.log('wechat audio start failed', err);
          reject(err);
        }
      })
    })
  }

  startRecord(): Promise<void> {
    return this.wechatConfigService.init().then(() => {
      return this._startRecord();
    });
  }

  autoCompelete(): Promise<string> {
    return this.wechatConfigService.init().then(() => {
      return new Promise((resolve, reject) => {
        this.wechatConfigService.autoCompleteResolver = resolve;
        this.wechatConfigService.autoCompleteRejecter = reject;
      });
    });
  }

  private _stopRecord(): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.stopRecord({
        success: (res) => {
          console.log('wechat audio stop successful');

          resolve(res.localId);
        },
        fail: (err) => {
          console.log('wechat audio stop failed');
          reject(err);
        }
      })
    });
  }

  stopRecord(): Promise<string> {
    return this._stopRecord();
  }

  private _cancelRecord(): Promise<void> {
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
    return this._cancelRecord();
  }

  playVoice(id: string): Promise<string> {
    if (this.playingVoiceId !== '') {
      this.stopVoice(this.playingVoiceId);
    }

    return new Promise<string>((resolve, reject) => {
      this.wechatConfigService.onVoicePlayEnd = () => {
        resolve(this.playingVoiceId);
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
        isShowProgressTips: 0, // 默认为1，显示进度提示
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
        isShowProgressTips: 0, // 默认为1，显示进度提示
        success: (res) => {
          resolve(res.translateResult); // 语音识别的结果
        },
        fail: (err) => {
          reject(err);
        }
      })
    })
  }

  // 微信不需要用到转码
  encodeVoice(data: Blob): Promise<Blob> {
    return Promise.resolve(null);
  }
}
