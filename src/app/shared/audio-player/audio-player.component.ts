import {Component, Input} from '@angular/core';

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

  constructor(private audioPlayerService: AudioPlayerService) {
  }

  playOrStopVoice() {
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
}
