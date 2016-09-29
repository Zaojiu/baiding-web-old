import { Component, Input } from '@angular/core';

import { WechatService } from '../wechat/wechat.service';
import { MessageModel } from '../api/message.model';

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})

export class AudioPlayerComponent {
  @Input() message: MessageModel;
  @Input() isWhiteTheme: MessageModel;

  constructor(private wechatService: WechatService) {}

  playVoice() {
    if (!this.message.audio.localId) {
      this.wechatService.downloadVoice(this.message.audio.serverId).then(localId => {
        this.message.audio.localId = localId;
        this.wechatService.playVoice(this.message.audio.localId)
      })
    } else {
      this.wechatService.playVoice(this.message.audio.localId)
    }

  }

  stopVoice() {
    this.wechatService.stopVoice(this.message.audio.localId)
  }

  playingId(): string {
    return this.wechatService.playingVoiceId
  }
}
