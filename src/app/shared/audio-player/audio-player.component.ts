import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';

import {AudioPlayerService} from './audio-player.service';
import {MessageModel} from '../api/message/message.model';
import {PostMessageStatus} from "../api/message/message.enum";
import {UtilsService} from "../utils/utils";
import {Subscription} from "rxjs";

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})

export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() message: MessageModel;
  @Input() isWhiteTheme: boolean;
  @Input() isLightBrandTheme: boolean;
  postStatus = PostMessageStatus;

  @Output() playEnded = new EventEmitter();

  played: boolean;

  isLoaded = false;
  globalSub: Subscription;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.played = !!UtilsService.getStorage('audioPlayed')[this.message.id];
    this.globalSub = this.audioPlayerService.globalAudio$.filter(e => e.data.message.id === this.message.id).subscribe(e => {
      if (!this.played) {
        this.played = true;
        this.setPlayed(this.message.id);
      }

      if (e.isEnded) this.playEnded.emit(this.message);
      if (e.isPlaying) this.isLoaded = true;
    });
  }

  playOrStopVoice() {
    this._isPlaying() ? this.audioPlayerService.stop(this.message) : this.play();
  }

  setPlayed(id: string) {
    let audioPlayed = UtilsService.getStorage('audioPlayed');
    audioPlayed[id] = true;
    UtilsService.setStorage('audioPlayed', audioPlayed);
  }

  play() {
    this.audioPlayerService.userActivated = true;
    this.audioPlayerService.play(this.message).subscribe();
  }

  private _isPlaying() {
    return this.audioPlayerService.isPlaying(this.message);
  }

  get isPlaying(): boolean {
    return this._isPlaying();
  }

  get isPlayed(): boolean {
    return this.played;
  }

  get audioDuration(): number {
    return Math.round(this.message.audio.duration / 1000);
  }

  ngOnDestroy() {
    if (this.isPlaying) {
      this.audioPlayerService.stop(this.message);
    }

    if (this.globalSub) this.globalSub.unsubscribe();
  }
}
