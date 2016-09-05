import { Component, Input } from '@angular/core';

import { WechatService } from '../../../../shared/wechat/wechat.service';
import { TimelineCommentAudioModel } from '../timeline-comment.model';

@Component({
  selector: 'audio-comment',
  templateUrl: './audio-comment.component.html',
  styleUrls: ['./audio-comment.component.scss'],
})

export class AudioCommentComponent {
  @Input() audio: TimelineCommentAudioModel;

  constructor(private wechatService: WechatService) {}

  playVoice() {
    if (!this.audio.localId) {
      this.wechatService.downloadVoice(this.audio.serverId).then(localId => {
        this.audio.localId = localId
        this.wechatService.playVoice(this.audio.localId)
      })
    } else {
      this.wechatService.playVoice(this.audio.localId)
    }

  }

  stopVoice() {
    this.wechatService.stopVoice(this.audio.localId)
  }

  playingId(): string {
    console.log(this.wechatService.playingVoiceId, this.audio)
    return this.wechatService.playingVoiceId
  }
}
