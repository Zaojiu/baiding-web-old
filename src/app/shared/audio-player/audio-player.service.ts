import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import {WechatService} from '../wechat/wechat.service';
import {MessageModel} from '../api/message/message.model';
import {Http, ResponseContentType} from '@angular/http';

@Injectable()
export class AudioPlayerService {

  private static h5AudioContext: AudioContext;
  private static playingSource: AudioBufferSourceNode;
  private static playingMessageId: string;

  private loadingAudios: { [key: string]: boolean; } = {};

  constructor(private wechatService: WechatService, private $http: Http) {
    (<any>window).AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
    AudioPlayerService.h5AudioContext = AudioPlayerService.h5AudioContext || new AudioContext();
  }

  play(msg: MessageModel): Observable<string> {

    return new Observable<string>(observer => {

      if (msg.audio.localId) {
        observer.next('loaded');
        this.wechatService.playVoice(msg.audio.localId).then(localId => {
          observer.complete();
        });
        return;
      }

      try {
        if (AudioPlayerService.playingSource) {
          AudioPlayerService.playingSource.onended = null;
          AudioPlayerService.playingSource.stop();
        }
      } catch (Error) {
      }

      AudioPlayerService.playingSource = AudioPlayerService.h5AudioContext.createBufferSource();
      AudioPlayerService.playingMessageId = msg.id;
      this.playRemoteURLAudio(AudioPlayerService.h5AudioContext, msg, observer);
    });
  }

  playRemoteURLAudio(context: AudioContext, msg: MessageModel, observer: any) {

    if (this.loadingAudios[msg.id]) {
      return;
    }
    this.loadingAudios[msg.id] = true;

    this.$http.get(msg.audio.link, {
      withCredentials: false,
      responseType: ResponseContentType.ArrayBuffer
    }).toPromise().then(res => {
      observer.next('loaded');
      context.decodeAudioData(res.arrayBuffer(), buffer => {
        if (AudioPlayerService.playingMessageId === msg.id && AudioPlayerService.playingSource) {
          this.playBuffer(context, AudioPlayerService.playingSource, buffer, observer);
        }
      }, null);
    }).finally(() => {
      delete this.loadingAudios[msg.id];
    });
  }

  playBuffer(context: AudioContext, source: AudioBufferSourceNode, buffer: AudioBuffer, observer: any) {
    alert('start play');
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    source.onended = () => {
      AudioPlayerService.playingMessageId = '';
      observer.complete();
    };
  }

  isPlaying(msg: MessageModel): boolean {

    if (msg.audio.localId) {
      return msg.audio.localId === this.wechatService.playingVoiceId;
    }
    return msg.id === AudioPlayerService.playingMessageId;
  }

  stop(msg: MessageModel) {

    if (msg.audio.localId) {
      return this.wechatService.stopVoice(msg.audio.localId);
    }

    AudioPlayerService.playingMessageId = '';
    if (AudioPlayerService.playingSource) {
      try {
        AudioPlayerService.playingSource.onended = null;
        AudioPlayerService.playingSource.stop();
      } catch (Error) {
      }
    }
    AudioPlayerService.playingSource = null;
  }

  // 当前正在播放音频
  get hasPlaying(): boolean {
    return !!AudioPlayerService.playingMessageId;
  }

}
