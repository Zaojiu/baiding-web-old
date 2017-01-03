import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

import {MessageModel} from '../api/message/message.model';
import {AudioBridge} from "../bridge/audio.interface";
import {Subject} from "rxjs";
import {AudioListPlayerPosition, AudioListPlayerEvent, AudioListPlayerEventType} from "./audio-list-player.model";

@Injectable()
export class AudioPlayerService {
  private static playingMessageId: string;
  private static audioEl = document.createElement('audio');
  private static preloadAudioEl = document.createElement('audio');
  private _playbackRate = 1.0;
  private playingLock = false;
  private globalAudioSource = new Subject<AudioListPlayerEvent>();
  globalAudio$: Observable<AudioListPlayerEvent> = this.globalAudioSource.asObservable();

  userActivated = false;

  constructor(private audioService: AudioBridge) {}

  play(msg: MessageModel, offset = 0, rate?: number): Observable<string> {
    rate = rate || this.playbackRate;

    return new Observable<string>(observer => {
      if (msg.audio.localId) {
        observer.next('loaded');
        this.audioService.playVoice(msg.audio.localId).then(() => {
          observer.complete();
        });
        return;
      }

      this.playURLAudio(observer, msg, offset, rate);
    });
  }

  playURLAudio(observer: any, msg: MessageModel, offset = 0, rate = 1) {
    let link = msg.audio.audioData ? URL.createObjectURL(msg.audio.audioData) : msg.audio.link;
    let timer = null;

    AudioPlayerService.audioEl.onloadstart = () => {
      timer = setTimeout(() => { // avoid short loading flash
        let data = new AudioListPlayerPosition(msg, offset);
        this.globalAudioSource.next(new AudioListPlayerEvent(AudioListPlayerEventType.Loading, data));
      }, 100);
    };

    AudioPlayerService.audioEl.onabort = () => {
      let data = new AudioListPlayerPosition(msg, offset);
      this.globalAudioSource.next(new AudioListPlayerEvent(AudioListPlayerEventType.Abort, data));
    };

    AudioPlayerService.audioEl.onplaying = () => {
      if (this.playingLock) return;
      this.playingLock = true;
      AudioPlayerService.audioEl.playbackRate = rate;
      let data = new AudioListPlayerPosition(msg, offset);
      this.globalAudioSource.next(new AudioListPlayerEvent(AudioListPlayerEventType.Play, data));
      observer.next('loaded');
    };

    AudioPlayerService.audioEl.onloadeddata = () => {
      if (timer) clearTimeout(timer);
      AudioPlayerService.audioEl.currentTime = offset;
    };

    AudioPlayerService.audioEl.onended = () => {
      AudioPlayerService.playingMessageId = '';
      let data = new AudioListPlayerPosition(msg, AudioPlayerService.audioEl.currentTime);
      this.globalAudioSource.next(new AudioListPlayerEvent(AudioListPlayerEventType.End, data));
      observer.complete();
    };

    this.playingLock = false;
    AudioPlayerService.playingMessageId = msg.id;
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
        let data = new AudioListPlayerPosition(msg, AudioPlayerService.audioEl.currentTime);
        this.globalAudioSource.next(new AudioListPlayerEvent(AudioListPlayerEventType.Pause, data));
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

    AudioPlayerService.preloadAudioEl.preload = 'auto';
    AudioPlayerService.preloadAudioEl.src = msg.audio.link;
    AudioPlayerService.preloadAudioEl.load();
  }

  get playbackRate(): number {
    return this._playbackRate;
  }

  set playbackRate(rate: number) {
    this._playbackRate = rate;
    AudioPlayerService.audioEl.playbackRate = rate;
  }
}
