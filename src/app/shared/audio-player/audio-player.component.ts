import {Component, Input} from '@angular/core';
import {LocalStorage} from "angular2-localstorage/WebStorage";


import {AudioPlayerService} from './audio-player.service';

import {MessageModel} from '../api/message.model';

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
  providers: [AudioPlayerService]
})

export class AudioPlayerComponent {

  @Input() message: MessageModel;
  @Input() isWhiteTheme: MessageModel;
  @LocalStorage() public audioPlayed: Object = {};

  played: boolean;


  constructor(private audioPlayerService: AudioPlayerService) {
  }

  ngOnInit() {
    this.played = this.audioPlayed[this.message.id] === true;
  }

  playOrStopVoice() {
    this.audioPlayed[this.message.id] = true;
    this.played = true;
    this.isPlaying() ? this.audioPlayerService.stop(this.message) : this.play();
  }

  play() {
    this.audioPlayerService.play(this.message).then(msg => {
      // console.log(msg.id);
    });
  }

  isPlaying() {
    return this.audioPlayerService.isPlaying(this.message);
  }

  get isPlayed(): boolean {
    return this.played;
  }
}
