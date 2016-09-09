import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { TimelineCommentModel } from './timeline-comment/timeline-comment.model';
import { LiveRoomTimelineService } from './live-room-timeline.service';
import { UserInfoService } from '../../shared/user-info/user-info.service';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { GetCommentService } from '../../shared/comment/get-comment.service'
import { MqService, MqPraisedUser, MqEvent, EventType } from '../../shared/mq/mq.service';


@Component({
  selector: 'live-room-timeline',
  templateUrl: './live-room-timeline.component.html',
  styleUrls: ['./live-room-timeline.component.scss'],
  providers: [GetCommentService]
})

export class LiveRoomTimelineComponent implements OnInit, OnDestroy {
  id: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  comments: TimelineCommentModel[] = [];
  receviedReplySubscription: Subscription;
  scrollSubscription: Subscription;
  timelineSubscription: Subscription;
  isOnLatest: boolean;
  isOnNewest: boolean;
  isLoading: boolean;
  countdownTimer: any;

  constructor(private route: ActivatedRoute, private timelineService: LiveRoomTimelineService,
    private userInfoService: UserInfoService, private liveService: LiveService,
    private getCommentService: GetCommentService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    let userInfoPromise = this.userInfoService.getUserInfo();
    let liveInfoPromise = this.liveService.getLiveInfo(this.id);

    // TODO reject ??
    Promise.all([userInfoPromise, liveInfoPromise]).then(result => {
      let userInfo = result[0];
      let liveInfo = result[1];
      this.userInfo = userInfo;
      this.liveInfo = liveInfo;
      this.countdownTimer = setInterval(()=>{
        this.liveInfo.expectStartAt = this.liveInfo.expectStartAt.indexOf('.00') === -1 ? this.liveInfo.expectStartAt + '.00' : this.liveInfo.expectStartAt.replace('.00', '')
      }, 60000);

      this.timelineService.startReceive(this.id);
      this.timelineService.onReceivedEvents(evt => {
        this.onReceivedEvents(evt)
      })
      this.timelineService.onReceivedPraises(prised => {
        this.onReceivedPraises(prised)
      })

      // this.gotoLastestComments();
      setTimeout(() => this.timelineService.scrollToBottom(), 200);
      this.startObserveTimelineScroll();
      this.startObserveTimelineAction();
      this.startReceiveReply();

      this.gotoLatestComments()
    });
  }

  ngOnDestroy() {
    this.timelineService.stopReceive(this.id)
    this.stopObserveTimelineScroll();
    this.timelineSubscription.unsubscribe();
    clearInterval(this.countdownTimer)
  }

  isStarted(): boolean {
    return moment().isAfter(moment(this.liveInfo.expectStartAt))
  }

  isClosed(): boolean{
    return moment().isBefore(this.liveInfo.closedAt)
}

  onReceivedEvents(evt: MqEvent) {
    switch (evt.event) {
      case EventType.LiveMsgUpdate:
        this.gotoLatestComments()
        break
      case EventType.LivePraise:
        // TODO
        break
      case EventType.LiveClosed:
        this.liveService.getLiveInfo(this.id, true).then((result) => {
          this.liveInfo = result
        })
        break
    }
  }

  onReceivedPraises(praisedUser: MqPraisedUser) {
    if (praisedUser.user.uid == this.userInfo.uid) {
      return
    }
    for (let idx in this.comments) {
      let comment = this.comments[idx]
      if (comment.id == praisedUser.msgId) {
        comment.pushPraisedUser(praisedUser.user)
      }
    }
  }

  gotoLatestComments() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.getCommentService.listComments(this.id).then(comments => {
      comments = comments.reverse();
      this.comments = comments;
      this.isOnNewest = false;
      this.isOnLatest = true;
      this.isLoading = false;
    });
  }

  gotoFirstComments() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.getCommentService.listComments(this.id, '', 20, ['createdAt']).then(comments => {
      this.comments = comments;
      this.isOnNewest = true;
      this.isOnLatest = false;
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
        this.isOnLatest = true;
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
        this.isOnNewest = true;
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
          let lastComment = this.comments[this.comments.length - 1];
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

  startReceiveReply() {
    this.receviedReplySubscription = this.timelineService.receivedReply$.subscribe(
      reply => {
        for (let comment of this.comments) {
          if (comment.id === reply.parentId) {
            comment.replies.push(reply)
          }
        }
      }
    );
  }
}
