import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TimelineCommentModel } from './timeline-comment.model';
import { UserInfoModel } from '../../../shared/user-info/user-info.model';
import { LiveService } from '../../../shared/live/live.service';
import { LiveInfoModel } from '../../../shared/live/live.model';
import { TimelineCommmentService } from './timeline-comment.service';
import { MqService } from '../../../shared/mq/mq.service';

@Component({
  selector: 'timeline-comment',
  templateUrl: './timeline-comment.component.html',
  styleUrls: ['./timeline-comment.component.scss'],
  providers: [TimelineCommmentService]
})

export class TimelineCommentComponent {
  @Input() liveId: string;
  @Input() comment: TimelineCommentModel;
  @Input() userInfo: UserInfoModel;
  @Input() liveInfo: LiveInfoModel;
  isLoading: boolean;

  constructor(private timelineCommentService: TimelineCommmentService, private router: Router, private liveService: LiveService) {}

  confirmPraise() {
    if (!this.comment.hadPraised) {
      if (this.isLoading) return;

      this.isLoading = true;
      this.timelineCommentService.confirmPraise(this.liveInfo.id, this.comment.id).then(() => this.isLoading = false);

      this.comment.hadPraised = true;
      this.comment.praisedAmount += 1;
    }

    this.comment.praisedAnimations.push(this.userInfo);
    // 为了保留自己的头像在点赞用户的最后一个，所以模板里面特殊处理，检测有无hasPraised。
    // 因此不需要将自己的info推入praisedAvatars数组。
  }

  isEditor() { return this.liveService.isEditor(this.liveId); }

  isAudience() { return this.liveService.isAudience(this.liveId); }

  // 暂时不加取消点赞
  // cancelPraise() {
  //   if (this.isLoading) return;

  //   this.isLoading = true;
  //   this.timelineCommentService.cancelPraise(this.liveInfo.id, this.comment.id).then(() => this.isLoading = false);

  //   this.comment.hadPraised = false;
  //   this.comment.praisedAmount -= 1;
  // }

  setPraise() {
    this.confirmPraise();
  }

  gotoReply() {
    this.router.navigate([`/lives/${this.liveInfo.id}/post-comment`, {'message_id': this.comment.id}]);
  }

  canReply(): boolean {
    return this.comment.user.uid != this.userInfo.uid && !this.isAudience()
  }

  goToShare() {
    this.router.navigate([`/lives/${this.liveInfo.id}/share/${this.comment.id}`]);
  }
}
