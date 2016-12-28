import {Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';

import {AudioPlayerService} from './audio-player.service';
import {MessageModel} from '../api/message/message.model';
import {UtilsService} from "../utils/utils";

@Component({
  selector: 'audio-player-small',
  templateUrl: './audio-player-small.component.html',
  styleUrls: ['./audio-player-small.component.scss'],
})

export class AudioPlayerSmallComponent implements OnInit, OnDestroy {
  @Input() message: MessageModel;
  @Output() playEnded = new EventEmitter();
  played: boolean;
  isLoaded = true;

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.played = !!UtilsService.getStorage('audioPlayed')[this.message.id];
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
    if (!this.played) {
      this.played = true;
      this.setPlayed(this.message.id);
    }

    this.isLoaded = false;

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
