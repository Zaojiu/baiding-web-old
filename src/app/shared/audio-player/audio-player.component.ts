import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {LocalStorage} from "angular2-localstorage/WebStorage";

import {AudioPlayerService} from './audio-player.service';
import {MessageModel} from '../api/message/message.model';
import {PostMessageStatus} from "../api/message/message.enum";

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  providers: [AudioPlayerService]
})

export class AudioPlayerComponent implements OnInit, OnDestroy {
  @Input() message: MessageModel;
  @Input() isWhiteTheme: MessageModel;
  @LocalStorage() public audioPlayed: Object = {};
  postStatus = PostMessageStatus;

  @Output() playEnded = new EventEmitter();

  played: boolean;

  isLoaded = false;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.played = this.audioPlayed[this.message.id] === true;
  }

  playOrStopVoice() {
    this._isPlaying() ? this.audioPlayerService.stop(this.message) : this.play();
  }

  play() {

    if (!this.played) {
      this.played = true;
      this.audioPlayed[this.message.id] = true;
    }

    this.audioPlayerService.userActivated = true;
    this.audioPlayerService.play(this.message).subscribe(value => {
      if (value === 'loaded') {
        this.isLoaded = true;
      }
    }, () => {
    }, () => {
      this.playEnded.emit(this.message);
    });
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
  }
}
