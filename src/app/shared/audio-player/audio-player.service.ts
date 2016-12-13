import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import {MessageModel} from '../api/message/message.model';
import {Http, ResponseContentType} from '@angular/http';
import {AudioBridge} from "../bridge/audio.interface";
import {UtilsService} from '../utils/utils'

@Injectable()
export class AudioPlayerService {

  private static h5AudioContext: AudioContext;
  private static gainNode: GainNode;
  private static playingSource: AudioBufferSourceNode;
  private static playingMessageId: string;
  private static unlockedWebAudio = false;

  private loadingAudios: { [key: string]: boolean; } = {};

  userActivated = false;

  constructor(private audioService: AudioBridge, private $http: Http) {
    AudioPlayerService.h5AudioContext = AudioPlayerService.h5AudioContext || new AudioContext();
    AudioPlayerService.gainNode = AudioPlayerService.gainNode || AudioPlayerService.h5AudioContext.createGain();
    AudioPlayerService.gainNode.gain.value = 1;
  }

  // ref: https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
  unlockWebAudio() {
    if (!UtilsService.isiOS || AudioPlayerService.unlockedWebAudio) {
      return;
    }
    let buffer = AudioPlayerService.h5AudioContext.createBuffer(1, 1, 22050);
    let source = AudioPlayerService.h5AudioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(AudioPlayerService.h5AudioContext.destination);
    source.start(0);
    AudioPlayerService.unlockedWebAudio = true;
  }

  play(msg: MessageModel): Observable<string> {

    this.unlockWebAudio();

    return new Observable<string>(observer => {

      if (msg.audio.localId) {
        observer.next('loaded');
        this.audioService.playVoice(msg.audio.localId).then(localId => {
          observer.complete();
        });
        return;
      } else if (msg.audio.audioData) {
        this.playLocalBlobAudio(msg, observer);
      }

      try {
        if (AudioPlayerService.playingSource) {
          AudioPlayerService.playingSource.onended = null;
          AudioPlayerService.playingSource.stop();
        }
      } catch (err) {
        // TODO: 错误提示
      }

      AudioPlayerService.playingSource = AudioPlayerService.h5AudioContext.createBufferSource();
      AudioPlayerService.playingMessageId = msg.id;
      this.playRemoteURLAudio(AudioPlayerService.h5AudioContext, msg, observer);
    });
  }

  playLocalBlobAudio(msg: MessageModel, observer: any) {
    let context = AudioPlayerService.h5AudioContext;
    AudioPlayerService.playingSource = AudioPlayerService.h5AudioContext.createBufferSource();
    AudioPlayerService.playingMessageId = msg.id;

    var reader = new FileReader();

    reader.onloadend = (e) => {
      let arrayBuffer = e.target['result'];
      context.decodeAudioData(arrayBuffer, buffer => {
        observer.next('loaded');

        if (AudioPlayerService.playingMessageId === msg.id && AudioPlayerService.playingSource) {
          this.playBuffer(context, AudioPlayerService.playingSource, buffer, observer);
        }
      });
    };

    reader.readAsArrayBuffer(msg.audio.audioData);
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
      return msg.audio.localId === this.audioService.playingVoiceId;
    }
    return msg.id === AudioPlayerService.playingMessageId;
  }

  stop(msg: MessageModel) {

    if (msg.audio.localId) {
      return this.audioService.stopVoice(msg.audio.localId);
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
