import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { TimelineCommentModel } from './timeline-comment/timeline-comment.model';
import { LiveRoomTimelineService } from './live-room-timeline.service';
import { UserInfoService } from '../../shared/user-info/user-info.service';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { GetCommentService } from '../../shared/comment/get-comment.service'

@Component({
  selector: 'live-room-timeline',
  templateUrl: './live-room-timeline.component.html',
  styleUrls: ['./live-room-timeline.component.scss'],
  providers: [ GetCommentService ]
})

export class LiveRoomTimelineComponent implements OnInit, OnDestroy {
  id: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  comments: TimelineCommentModel[] = [];
  receviedCommentSubscription: Subscription;
  receviedPraisedUserSubscription: Subscription;
  scrollSubscription: Subscription;
  timelineSubscription: Subscription;
  isOnBottom: boolean;
  isOnTop: boolean;
  isLoading: boolean;

  constructor(private route: ActivatedRoute, private timelineService: LiveRoomTimelineService,
    private userInfoService: UserInfoService, private liveService: LiveService,
    private getCommentService: GetCommentService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    let userInfoPromise = this.userInfoService.getUserInfo();
    let liveInfoPromise = this.liveService.getLiveInfo(this.id);

    Promise.all([userInfoPromise, liveInfoPromise]).then(result => {
      let userInfo = result[0];
      let liveInfo = result[1];

      this.userInfo = userInfo;
      this.liveInfo = liveInfo;
      this.timelineService.onReceive();
      this.gotoLatestComments();
      setTimeout(() => this.timelineService.scrollToBottom(), 200);
      this.startObserveTimelineScroll();
      this.startObserveTimelineAction();
      this.startReceivePraisedUser();
      this.startReceiveComment();
    });
  }

  ngOnDestroy() {
    this.receviedCommentSubscription.unsubscribe();
    this.receviedPraisedUserSubscription.unsubscribe();
    this.stopObserveTimelineScroll();
    this.timelineSubscription.unsubscribe();
  }

  gotoLatestComments() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.getCommentService.listComments(this.id).then(comments => {
      comments = comments.reverse();
      this.comments = comments;
      this.isOnTop = false;
      this.isOnBottom = true;
      this.isLoading = false;
    });
  }

  gotoFirstComments() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.getCommentService.listComments(this.id, '', 20, ['createdAt']).then(comments => {
      this.comments = comments;
      this.isOnTop = true;
      this.isOnBottom = false;
      this.isLoading = false;
    });
  }

  getNextComments(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.getCommentService.listComments(this.id, marker, limit, sorts).then(comments => {
      for (let comment of comments) {
        this.comments.push(comment);
      }

      if (comments.length === 0) {
        this.isOnBottom = true;
      }

      this.isLoading = false;
    });
  }

  getPrevComments(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.getCommentService.listComments(this.id, marker, limit, sorts).then(comments => {
      for (let comment of comments) {
        this.comments.unshift(comment);
      }

      if (comments.length === 0) {
        this.isOnTop = true;
      }

      this.isLoading = false;
    });
  }

  startObserveTimelineScroll() {
    this.scrollSubscription = this.timelineService.scroller$.subscribe(
      topOrBottom => {
        if (topOrBottom) {
          if (this.comments.length === 0) return;
          let firstComment = this.comments[0];
          this.getPrevComments(`$lt${firstComment.createdAt}`, 20, ['-createdAt']);
        } else {
          if (this.comments.length === 0) return;
          let lastComment = this.comments[this.comments.length-1];
          this.getNextComments(`$gt${lastComment.createdAt}`, 20, ['createdAt']);
        }
      }
    );
  }

  stopObserveTimelineScroll() {
    this.scrollSubscription.unsubscribe();
  }

  startObserveTimelineAction() {
    this.timelineSubscription = this.timelineService.timeline$.subscribe(
      topOrBottom => {
        this.stopObserveTimelineScroll();

        if (topOrBottom) {
          this.gotoFirstComments();
          setTimeout(() => {
            this.timelineService.scrollToTop();
            this.startObserveTimelineScroll();
          }, 200);
        } else {
          this.gotoLatestComments();
          setTimeout(() => {
            this.timelineService.scrollToBottom();
            this.startObserveTimelineScroll();
          }, 200);
        }
      }
    );
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
        if (!this.comments) return;
        let comment = this.comments[this.comments.length - 1];
        // // for (var comment of this.comments) {
        // //   if (praisedUser.commentId == comment.id) {
        //     // 数组只保留5个，如果自己点过赞，则保留4个
        //     const limit = comment.hadPraised ? 4 : 5;
        //     if (comment.praisedAvatars.length >= limit) {
        //       comment.praisedAvatars.shift();
        //     }
            comment.praisedAmount += 1;
            comment.praisedAnimations.push(praisedUser);
        //     // 推入数组后会产生动画，动画完成后，由directive移除掉元素
            // comment.praisedAvatars.push(praisedUser);
        //   // }
        // // }
      }
    );
  }
}
