import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import {MessageModel} from '../api/message/message.model';
import {AudioBridge} from "../bridge/audio.interface";

@Injectable()
export class AudioPlayerService {
  private static playingMessageId: string;
  private static audioEl: HTMLAudioElement = null;

  userActivated = false;

  constructor(private audioService: AudioBridge) {
    if (!AudioPlayerService.audioEl) {
      AudioPlayerService.audioEl = document.createElement('audio');
    }
  }

  play(msg: MessageModel, offset = 0, rate = 1): Observable<string> {
    return new Observable<string>(observer => {
      if (msg.audio.localId) {
        observer.next('loaded');
        this.audioService.playVoice(msg.audio.localId).then(() => {
          observer.complete();
        });
        return;
      }

      let link = msg.audio.link;
      if (msg.audio.audioData) link = URL.createObjectURL(msg.audio.audioData);

      AudioPlayerService.playingMessageId = msg.id;
      this.playRemoteURLAudio(link, observer, offset, rate);
    });
  }

  playRemoteURLAudio(link: string, observer: any, offset = 0, rate = 1) {
    AudioPlayerService.audioEl.onplaying = () => {
      observer.next('loaded');
    };

    AudioPlayerService.audioEl.onended = () => {
      AudioPlayerService.playingMessageId = '';
      observer.complete();
    };
    AudioPlayerService.audioEl.src = link;
    AudioPlayerService.audioEl.play();
    AudioPlayerService.audioEl.currentTime = offset;
    AudioPlayerService.audioEl.playbackRate = rate;
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
    if (AudioPlayerService.audioEl) {
      try {
        AudioPlayerService.audioEl.onplaying = null;
        AudioPlayerService.audioEl.onended = null;
        AudioPlayerService.audioEl.pause();
      } catch (Error) {
      }
    }
  }

  // 当前正在播放音频
  get hasPlaying(): boolean {
    return !!AudioPlayerService.playingMessageId;
  }

  get currentTime(): number {
    return AudioPlayerService.audioEl.currentTime;
  }

  preloadAudio(msg: MessageModel) {
    if (msg.audio.localId || msg.audio.audioData) return;

    let audioEl = document.createElement('audio');
    audioEl.preload = 'auto';
    audioEl.src = msg.audio.link;
    audioEl.onloadeddata = () => audioEl.remove();
  }

  get playbackRate(): number {
    return AudioPlayerService.audioEl.playbackRate;
  }

  set playbackRate(rate: number) {
    AudioPlayerService.audioEl.playbackRate = rate;
  }
}
