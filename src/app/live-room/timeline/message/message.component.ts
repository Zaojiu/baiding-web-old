import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MessageModel } from './message.model';
import { UserInfoModel } from '../../../shared/user-info/user-info.model';
import { LiveService } from '../../../shared/live/live.service';
import { LiveInfoModel } from '../../../shared/live/live.model';
import { MessageService } from './message.service';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  providers: [MessageService]
})

export class MessageComponent {
  @Input() liveId: string;
  @Input() message: MessageModel;
  @Input() userInfo: UserInfoModel;
  @Input() liveInfo: LiveInfoModel;
  isLoading: boolean;
  praisesNum: number
  timer: any = -1

  constructor(private messageService: MessageService, private router: Router, private liveService: LiveService) { }

  confirmPraise() {
    this.praisesNum += 1
    this.message.praisedAnimations.push(this.userInfo);

    let priased = this.message.hadPraised

    if (!this.message.hadPraised) {
      this.message.praisedAmount += 1;
    }
    this.message.hadPraised = true;

    if (this.isLoading) return

    if (this.timer > -1) {
      clearTimeout(this.timer)
    }

    this.timer = setTimeout(() => {
      this.isLoading = true;
      this.messageService.confirmPraise(this.liveInfo.id, this.message.id, priased, this.praisesNum).then(() => {
        this.praisesNum = 0

        clearTimeout(this.timer)
        this.timer = -1
        this.isLoading = false
      });
    }, 1000)
  }

  isEditor() { return this.liveService.isEditor(this.liveId); }

  isAudience() { return this.liveService.isAudience(this.liveId); }

  setPraise() {
    this.confirmPraise();
  }

  gotoReply() {
    this.router.navigate([`/lives/${this.liveInfo.id}/post`, { 'message_id': this.message.id }]);
  }

  canReply(): boolean {
    return this.message.user.uid != this.userInfo.uid && !this.isAudience()
  }

  goToShare() {
    this.router.navigate([`/lives/${this.liveInfo.id}/share/${this.message.id}`]);
  }
}
