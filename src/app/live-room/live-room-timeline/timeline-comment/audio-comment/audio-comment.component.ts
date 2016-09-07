import { Component, Input } from '@angular/core';

import { WechatService } from '../../../../shared/wechat/wechat.service';
import { TimelineCommentModel } from '../timeline-comment.model';
import { UserInfoModel } from '../../../../shared/user-info/user-info.model';

@Component({
  selector: 'audio-comment',
  templateUrl: './audio-comment.component.html',
  styleUrls: ['./audio-comment.component.scss'],
})

export class AudioCommentComponent {
  @Input() comment: TimelineCommentModel;
  @Input() userInfo: UserInfoModel;

  constructor(private wechatService: WechatService) {}

  playVoice() {
    if (!this.comment.audio.localId) {
      this.wechatService.downloadVoice(this.comment.audio.serverId).then(localId => {
        this.comment.audio.localId = localId
        this.wechatService.playVoice(this.comment.audio.localId)
      })
    } else {
      this.wechatService.playVoice(this.comment.audio.localId)
    }

  }

  stopVoice() {
    this.wechatService.stopVoice(this.comment.audio.localId)
  }

  playingId(): string {
    return this.wechatService.playingVoiceId
  }
}
