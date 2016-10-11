import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {WechatService} from '../wechat/wechat.service';
import {MessageModel} from '../api/message.model';
import {Http, ResponseContentType} from '@angular/http';

@Injectable()
export class AudioPlayerService {

  private static h5AudioContext: AudioContext;
  private static playingSource: AudioBufferSourceNode;
  private static playingMessageId: string;
  private static audioBufferCache = new Map<string, AudioBuffer>(); // TODO: use ring cache

  constructor(private wechatService: WechatService, private $http: Http) {
    (<any>window).AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
    AudioPlayerService.h5AudioContext = AudioPlayerService.h5AudioContext || new AudioContext();
  }

  play(msg: MessageModel): Promise<MessageModel> {

    return new Promise((resolve, reject) => {

      if (msg.audio.localId) {
        return this.wechatService.playVoice(msg.audio.localId).then(localId => {
          resolve(msg);
        });
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

      let buffer = AudioPlayerService.audioBufferCache.get(msg.id);
      if (buffer) {
        return this.playBuffer(AudioPlayerService.h5AudioContext, AudioPlayerService.playingSource, buffer, msg, resolve);
      }
      this.playRemoteURLAudio(AudioPlayerService.h5AudioContext, AudioPlayerService.playingSource, msg, resolve);
    });
  }

  playRemoteURLAudio(context: AudioContext, source: AudioBufferSourceNode, msg: MessageModel, resolve: any) {

    this.$http.get(msg.audio.link, {
      withCredentials: false,
      responseType: ResponseContentType.ArrayBuffer
    }).toPromise().then(res => {
      context.decodeAudioData(res.arrayBuffer(), buffer => {
        AudioPlayerService.audioBufferCache.set(msg.id, buffer);
        this.playBuffer(context, source, buffer, msg, resolve);
      }, null);
    });
  }

  playBuffer(context: AudioContext, source: AudioBufferSourceNode, buffer: AudioBuffer, msg: MessageModel, resolve: any) {
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    source.onended = () => {
      AudioPlayerService.playingMessageId = '';
      resolve(msg);
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

}
