import {Component, Input, OnDestroy, OnInit, ViewChild, ElementRef} from '@angular/core';

import {AudioPlayerService} from './audio-player.service';
import {MessageModel} from '../api/message/message.model';
import {AudioListPlayerPosition, AudioListPlayerEventType} from "./audio-list-player.model";
import {UtilsService} from "../utils/utils";
import {Subscription} from "rxjs";

declare var $: any;

@Component({
  selector: 'audio-list-player',
  templateUrl: './audio-list-player.component.html',
  styleUrls: ['./audio-list-player.component.scss'],
})

export class AudioListPlayerComponent implements OnInit, OnDestroy {
  @Input() messages: MessageModel[] = [];
  @Input() coverUrl: string;
  @Input() avatarUrl: string;
  lastPosition: AudioListPlayerPosition;
  totalDuration = moment.duration(0);
  currentDuration = moment.duration(0);
  currentDurationTimer: any;
  isLoaded = true;
  isPlaybackRatePopup = false;
  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('progressBarWrapper') progressBarWrapper: ElementRef;
  progressBarWidth = -1;
  progressBarWrapperWidth = 0;
  isEnded = true;
  globalAudioSub: Subscription;
  private cursorOrigin = -1;
  private progressBarOriginWidth = 0;
  private _playbackRate = 1;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.globalAudioSub = this.audioPlayerService.globalAudio$.subscribe(e => {
      if (e.type === AudioListPlayerEventType.Play) {
        this.isLoaded = true;
        this.setCurrentDuration(e.data.offset);
        this.prefetch(e.data.message);
        this.progressBarWidth = -1;

        if (!this.currentDurationTimer) {
          this.isEnded = false;
          this.setPlaybackTimer();
        }
      }

      if (e.type === AudioListPlayerEventType.Loading) {
        this.isLoaded = false;
      }

      if (e.type === AudioListPlayerEventType.End || e.type === AudioListPlayerEventType.Pause || e.type === AudioListPlayerEventType.Abort) {
        clearInterval(this.currentDurationTimer);
        this.currentDurationTimer = null;
        this.lastPosition = e.data;
      }

      if (e.type === AudioListPlayerEventType.End) {
        this.playNext(e.data.message);
      }
    });

    this.setTotalDuration();
  }

  ngOnDestroy() {
    if (this.playingIndex !== -1) this.audioPlayerService.stop(this.messages[this.playingIndex]);
    if (this.currentDurationTimer) clearInterval(this.currentDurationTimer);
    if (this.globalAudioSub) this.globalAudioSub.unsubscribe();
  }

  playVoice(force = false) {
    if (!this.messages.length) return;

    if (this.playingIndex === -1 || force) {
      if (!this.lastPosition || force) {
        this.play(this.messages[0]);
      } else {
        this.play(this.lastPosition.message, this.lastPosition.offset);
      }
    }
  }

  stopVoice() {
    if (!this.messages.length) return;

    let playingIndex = this.playingIndex;
    if (playingIndex !== -1) {
      let message = this.messages[this.playingIndex];
      this.audioPlayerService.stop(message);
    }
  }

  playOrStopVoice() {
    if (!this.messages.length) return;

    if (this.playingIndex === -1) {
      this.playVoice();
    } else {
      this.stopVoice();
    }
  }

  private play(msg: MessageModel, offset = 0) {
    this.audioPlayerService.userActivated = true;

    this.audioPlayerService.play(msg, offset).subscribe();
  }

  private playNext(currentMsg: MessageModel) {
    for (let i in this.messages) {
      if (this.messages[i] === currentMsg) {
        if (+i + 1 < this.messages.length) {
          this.play(this.messages[+i + 1]);
          return;
        }
      }
    }

    this.currentDuration = moment.duration(0);
    this.lastPosition = null;
    this.isEnded = true;
  }

  private setTotalDuration() {
    let duration = 0;

    for (let message of this.messages) {
      duration += message.audio.duration;
    }

    this.totalDuration = moment.duration(duration);
  }

  private setCurrentDuration(offset?: number) {
    let duration = 0;

    for (let i = 0; i < this.playingIndex; i++) {
      duration += this.messages[i].audio.duration;
    }

    duration += offset ? offset * 1000 : this.audioPlayerService.currentTime * 1000;

    this.currentDuration = moment.duration(duration);
  }

  private setPlaybackTimer() {
    if (this.currentDurationTimer) clearInterval(this.currentDurationTimer);

    this.currentDurationTimer = setInterval(() => {
      this.setCurrentDuration();
    }, 1000 / this._playbackRate);
  }

  private prefetch(currentMsg: MessageModel) {
    for (let i in this.messages) {
      if (this.messages[i] === currentMsg) {
        if (+i + 1 < this.messages.length) {
          this.audioPlayerService.preloadAudio(this.messages[+i + 1]);
        }
        break;
      }
    }
  }

  setCursorOrigin(e) {
    if (e.type === 'touchstart') e.preventDefault();

    let cli = e.touches ? e.touches[0] : e;

    if (this.cursorOrigin === -1) {
      this.cursorOrigin = cli.clientX;
      this.progressBarOriginWidth = this.progressBar.nativeElement.clientWidth;
      this.progressBarWrapperWidth = this.progressBarWrapper.nativeElement.clientWidth;
    }
  }

  moveCursor(e) {
    if (this.cursorOrigin === -1) return;

    if (e.type === 'touchmove') e.preventDefault();

    let cli = e.touches ? e.touches[0] : e;
    let offset = cli.clientX - this.cursorOrigin;

    if (this.progressBarOriginWidth + offset >= 0 && this.progressBarOriginWidth + offset <= this.progressBarWrapperWidth) {
      this.progressBarWidth = (this.progressBarOriginWidth + offset) / this.progressBarWrapperWidth;
    } else if (this.progressBarOriginWidth + offset < 0) {
      this.progressBarWidth = 0;
    } else {
      this.progressBarWidth = 1;
    }
  }

  resetAudioCursor() {
    if (this.cursorOrigin === -1 || this.progressBarWidth === -1) return;

    let duration = 0;
    let message = null;
    let currentDuration = +this.totalDuration * this.progressBarWidth;

    for (let msg of this.messages) {
      duration += msg.audio.duration;

      if (duration >= currentDuration) {
        message = msg;
        break;
      }
    }

    let offset = Math.round((message.audio.duration - (duration - currentDuration)) / 1000);

    this.cursorOrigin = -1;
    this.play(message, offset);
  }

  get playingIndex() {
    for (let i in this.messages) {
      if (this.audioPlayerService.isPlaying(this.messages[i])) return +i;
    }
    return -1;
  }

  set playbackRate(rate: number) {
    this._playbackRate = rate;
    if (!this.isEnded) this.setPlaybackTimer();
    this.audioPlayerService.playbackRate = rate;
  }

  get playbackRate(): number {
    return this._playbackRate;
  }

  get isAndroid(): boolean {
    return UtilsService.isAndroid;
  }
}

