import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {LocalStorage} from "angular2-localstorage/WebStorage";

import {AudioPlayerService} from './audio-player.service';
import {MessageModel} from '../api/message/message.model';

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  providers: [AudioPlayerService]
})

export class AudioPlayerComponent implements OnInit {
  @Input() message: MessageModel;
  @Input() isWhiteTheme: MessageModel;
  @LocalStorage() public audioPlayed: Object = {};

  @Output() playEnded = new EventEmitter();

  played: boolean;

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

    this.audioPlayerService.play(this.message).then(msg => {
      this.playEnded.emit(msg);
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
}
