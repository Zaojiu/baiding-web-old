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

  constructor(private messageService: MessageService, private router: Router, private liveService: LiveService) {}

  confirmPraise() {
    if (!this.message.hadPraised) {
      if (this.isLoading) return;

      this.isLoading = true;
      this.messageService.confirmPraise(this.liveInfo.id, this.message.id).then(() => this.isLoading = false);

      this.message.hadPraised = true;
      this.message.praisedAmount += 1;
    }

    this.message.praisedAnimations.push(this.userInfo);
    // 为了保留自己的头像在点赞用户的最后一个，所以模板里面特殊处理，检测有无hasPraised。
    // 因此不需要将自己的info推入praisedAvatars数组。
  }

  isEditor() { return this.liveService.isEditor(this.liveId); }

  isAudience() { return this.liveService.isAudience(this.liveId); }

  // 暂时不加取消点赞
  // cancelPraise() {
  //   if (this.isLoading) return;

  //   this.isLoading = true;
  //   this.messageService.cancelPraise(this.liveInfo.id, this.message.id).then(() => this.isLoading = false);

  //   this.message.hadPraised = false;
  //   this.message.praisedAmount -= 1;
  // }

  setPraise() {
    this.confirmPraise();
  }

  gotoReply() {
    this.router.navigate([`/lives/${this.liveInfo.id}/post`, {'message_id': this.message.id}]);
  }

  canReply(): boolean {
    return this.message.user.uid != this.userInfo.uid && !this.isAudience()
  }

  goToShare() {
    this.router.navigate([`/lives/${this.liveInfo.id}/share/${this.message.id}`]);
  }
}
