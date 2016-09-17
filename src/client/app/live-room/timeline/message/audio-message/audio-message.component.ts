import { Component, Input } from '@angular/core';

import { WechatService } from '../../../../shared/wechat/wechat.service';
import { MessageModel } from '../message.model';
import { UserInfoModel } from '../../../../shared/user-info/user-info.model';

@Component({
  moduleId: module.id,
  selector: 'audio-message',
  templateUrl: './audio-message.component.html',
  styleUrls: ['./audio-message.component.css'],
})

export class AudioMessageComponent {
  @Input() message: MessageModel;
  @Input() userInfo: UserInfoModel;

  constructor(private wechatService: WechatService) {}

  playVoice() {
    if (!this.message.audio.localId) {
      this.wechatService.downloadVoice(this.message.audio.serverId).then(localId => {
        this.message.audio.localId = localId
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
