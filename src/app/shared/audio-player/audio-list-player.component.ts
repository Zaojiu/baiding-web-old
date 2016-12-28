import {Component, Input, OnDestroy, OnInit, DoCheck, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

import {AudioPlayerService} from './audio-player.service';
import {MessageModel} from '../api/message/message.model';
import {AudioListPlayerPosition} from "./audio-list-player.model";
import {SafeUrl} from "@angular/platform-browser";

declare var $: any;

@Component({
  selector: 'audio-list-player',
  templateUrl: './audio-list-player.component.html',
  styleUrls: ['./audio-list-player.component.scss'],
})

export class AudioListPlayerComponent implements DoCheck, OnDestroy {
  @Input() messages: MessageModel[] = [];
  @Input() coverUrl: SafeUrl;
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
  private cursorOrigin = -1;
  private progressBarOriginWidth = 0;
  private isCursorReseting = false;
  private _playbackRate = 1;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngDoCheck() {
    this.setTotalDuration();
  }

  playOrStopVoice(fouce = false) {
    if (!this.messages.length) return;

    let playingIndex = this.playingIndex;
    if (playingIndex === -1 || fouce) {
      if (this.lastPosition && !fouce) {
        this.play(this.lastPosition.message, this.lastPosition.offset);
      } else {
        this.play(this.messages[0]);
      }

      this.isEnded = false;
      this.setCurrentDuration();
      this.setPlaybackTimer();
    } else {
      this.lastPosition = new AudioListPlayerPosition(this.messages[this.playingIndex], this.audioPlayerService.currentTime);
      this.audioPlayerService.stop(this.messages[this.playingIndex]);
    }
  }

  play(msg: MessageModel, offset = 0): Promise<void> {
    this.isLoaded = false;
    this.audioPlayerService.userActivated = true;

    return new Promise((resolve, reject) => {
      this.audioPlayerService.play(msg, offset, this._playbackRate).subscribe(value => {
        if (value === 'loaded') {
          resolve();
          this.isLoaded = true;
        }
      }, () => {
        reject();
      }, () => {
        if (!this.isCursorReseting) this.playNext(msg);
      });
    });


  }

  private playNext(currentMsg: MessageModel) {
    for (let i in this.messages) {
      if (this.messages[i] === currentMsg) {
        if (+i + 1 < this.messages.length) {
          this.play(this.messages[+i + 1]);
        }
        return;
      }
    }

    this.setCurrentDuration();
    this.isEnded = true;
  }

  setTotalDuration() {
    let duration = 0;

    for (let message of this.messages) {
      duration += message.audio.duration;
    }

    this.totalDuration = moment.duration(duration);
  }

  setCurrentDuration() {
    if (this.playingIndex === -1) {
      this.currentDuration = moment.duration(0);
      return;
    }

    let duration = 0;

    for (let i = 0; i < this.playingIndex; i++) duration += this.messages[i].audio.duration;

    duration += this.audioPlayerService.currentTime * 1000;

    this.currentDuration = moment.duration(duration);
  }

  setPlaybackTimer() {
    if (this.currentDurationTimer) clearInterval(this.currentDurationTimer);

    this.currentDurationTimer = setInterval(() => {
      if (this.playingIndex !== -1) this.setCurrentDuration();
    }, 1000 / this._playbackRate);
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

    this.isCursorReseting = true;
    this.cursorOrigin = -1;
    this.play(message, offset).finally(() => {
      this.isCursorReseting = false;
      this.setCurrentDuration();
      this.progressBarWidth = -1;
    });
  }

  get playingIndex(): number {
    for (let i in this.messages) {
      if (this.audioPlayerService.isPlaying(this.messages[i])) return +i;
    }

    return -1
  }

  set playbackRate(rate: number) {
    this._playbackRate = rate;
    this.setPlaybackTimer();
    this.audioPlayerService.playbackRate = rate;
  }

  get playbackRate(): number {
    return this._playbackRate;
  }

  ngOnDestroy() {
    if (this.playingIndex !== -1) this.audioPlayerService.stop(this.messages[this.playingIndex]);
    if (this.currentDurationTimer) clearInterval(this.currentDurationTimer);
  }
}

