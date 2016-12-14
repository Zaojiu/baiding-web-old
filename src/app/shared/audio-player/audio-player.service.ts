import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import {MessageModel} from '../api/message/message.model';
import {AudioBridge} from "../bridge/audio.interface";

@Injectable()
export class AudioPlayerService {

  private static playingMessageId: string;
  private static audioEl = null;

  userActivated = false;

  constructor(private audioService: AudioBridge) {
    if (!AudioPlayerService.audioEl) {
      AudioPlayerService.audioEl = document.createElement('audio');
    }
  }

  play(msg: MessageModel): Observable<string> {

    return new Observable<string>(observer => {

      if (msg.audio.localId) {
        observer.next('loaded');
        this.audioService.playVoice(msg.audio.localId).then(localId => {
          observer.complete();
        });
        return;
      } else if (msg.audio.audioData) {
        this.playLocalBlobAudio(msg, observer);
        return;
      }

      AudioPlayerService.playingMessageId = msg.id;
      this.playRemoteURLAudio(msg.audio.link, observer);
    });
  }

  playLocalBlobAudio(msg: MessageModel, observer: any) {

    let url = URL.createObjectURL(msg.audio.audioData);

    AudioPlayerService.playingMessageId = msg.id;
    this.playRemoteURLAudio(url, observer);
  }

  playRemoteURLAudio(link: string, observer: any) {

    AudioPlayerService.audioEl.onplaying = () => {
      observer.next('loaded');
    };

    AudioPlayerService.audioEl.onended = () => {
      AudioPlayerService.playingMessageId = '';
      observer.complete();
    };
    AudioPlayerService.audioEl.src = link;
    AudioPlayerService.audioEl.play();
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

}
