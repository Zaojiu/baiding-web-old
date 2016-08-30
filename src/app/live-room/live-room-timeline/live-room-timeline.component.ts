import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { TimelineCommentModel } from './timeline-comment/timeline-comment.model';
import { LiveRoomTimelineService } from './live-room-timeline.service';
import { UserInfoService } from '../../shared/user-info/user-info.service';
import { UserInfoModel } from '../../shared/user-info/user-info.model';

@Component({
  selector: 'live-room-timeline',
  templateUrl: './live-room-timeline.component.html',
  styleUrls: ['./live-room-timeline.component.scss'],
  providers: [ LiveRoomTimelineService, UserInfoService ]
})

export class LiveRoomTimelineComponent implements OnInit, OnDestroy {
  comments: TimelineCommentModel[] = [];
  userInfo: UserInfoModel;
  receviedCommentSubscription: Subscription;
  receviedPraisedUserSubscription: Subscription;

  constructor(private timelineService: LiveRoomTimelineService, private userInfoService: UserInfoService) {}

  ngOnInit() {
    this.userInfoService.getUserInfo().then(userInfo => {
      this.userInfo = userInfo;
      this.timelineService.onReceive();
      this.startReceiveComment();
      this.startReceivePraisedUser();
    });
  }

  ngOnDestroy() {
    this.receviedCommentSubscription.unsubscribe();
    this.receviedPraisedUserSubscription.unsubscribe();
  }

  startReceiveComment() {
    this.receviedCommentSubscription = this.timelineService.receivedComment$.subscribe(
      comment => {
        this.comments.push(comment);
      }
    );
  }

  startReceivePraisedUser() {
    this.receviedPraisedUserSubscription = this.timelineService.receivedPraisedUser$.subscribe(
      praisedUser => {
        for (var comment of this.comments) {
          if (praisedUser.commentId == comment.id) {
            // 数组只保留5个，如果自己点过赞，则保留4个
            const limit = comment.hadPraised ? 4 : 5;
            if (comment.praisedAvatars.length >= limit) {
              comment.praisedAvatars.shift();
            }
            comment.praisedAmout += 1;
            comment.praisedAnimations.push(praisedUser);
            // 推入数组后会产生动画，动画完成后，由directive移除掉元素
            comment.praisedAvatars.push(praisedUser);
          }
        }
      }
    );
  }
}
