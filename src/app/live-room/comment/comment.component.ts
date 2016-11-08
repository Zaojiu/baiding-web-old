import {Component, OnInit, OnDestroy, Input, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {CommentModel, CommentType} from '../../shared/api/comment/comment.model';
import {CommentService} from './comment.service';
import {CommentApiService} from '../../shared/api/comment/comment.service';
import {ScrollerDirective} from '../../shared/scroller/scroller.directive';
import {ScrollerEventModel} from '../../shared/scroller/scroller.model';
import {ScrollerPosition} from '../../shared/scroller/scroller.enums';
import {Subscription} from 'rxjs';
import {SafeHtml, DomSanitizer} from '@angular/platform-browser';
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {MqEvent, EventType} from '../../shared/mq/mq.service';
import {TimelineService} from '../timeline/timeline.service';
import * as _ from 'lodash';
import {UtilsService} from "../../shared/utils/utils";

@Component({
  selector: 'comments',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})

export class CommentComponent implements OnInit, OnDestroy {
  @Input() streamId: string;
  @Input() userInfo: UserInfoModel;
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  comments: CommentModel[] = [];
  isLoading = false;
  isOnOldest: boolean;
  isOnLatest: boolean;
  actionSubscription: Subscription;
  commentPushQueue: CommentModel[] = [];
  commentPushQueueTimer: any;
  isOnBottom: boolean;
  unreadCount = 0;
  commentType = CommentType;

  constructor(private commentService: CommentService, private router: Router,
              private commentApiService: CommentApiService, private sanitizer: DomSanitizer,
              private timelineService: TimelineService) {
  }

  ngOnInit() {
    this.gotoLatestComments().then(() => {
      setTimeout(() => {
        this.scroller.scrollToBottom();
      }, 0);

      this.commentService.startReceive(this.streamId);
      this.commentService.onReceiveComments(comment => {
        this.onReceiveComments(comment);
      });

      this.startObserveAction();
      this.startPushComment();
      this.timelineService.onReceivedEvents(evt => this.onReceivedEvents(evt));
    });
  }

  ngOnDestroy() {
    this.commentService.stopReceive(this.streamId);
    this.actionSubscription.unsubscribe();
    clearInterval(this.commentPushQueueTimer);
  }

  parseContent(comment: CommentModel): SafeHtml {
    if (comment.parsedContent) return comment.parsedContent;

    let content = '';

    switch (comment.type) {
      case CommentType.Text:
        if (_.includes(comment.toUids, this.userInfo.uid)) {
          content = `<span class="highlight">${UtilsService.parseAt(comment.content)}</span>`;
        } else {
          content = UtilsService.parseAt(comment.content, true);
        }

        comment.parsedContent = this.sanitizer.bypassSecurityTrustHtml(content);
        break;

      case CommentType.AudienceJoined:
        content = `${comment.eventData.user.nick}加入话题讨论`;
        comment.parsedContent = this.sanitizer.bypassSecurityTrustHtml(content);
        break;

      case CommentType.CommentPushed:
        if (comment.eventData.comment_user.uid === this.userInfo.uid) {
          content = '<span class="highlight">我的评论被推送了</span>';
        } else {
          content = `${comment.eventData.comment_user.nick}的评论被推送了`;
        }

        comment.parsedContent = this.sanitizer.bypassSecurityTrustHtml(content);
        break;

      default:
        comment.parsedContent = this.sanitizer.bypassSecurityTrustHtml(content);
        break;
    }

    return comment.parsedContent;
  }

  startPushComment() {
    this.commentPushQueueTimer = setInterval(() => {
      if (this.commentPushQueue.length === 0) return;

      this.scroller.appendData([this.commentPushQueue[0]]);

      if (this.isOnBottom) {
        // 等待渲染完毕
        setTimeout(() => {
          this.scroller.scrollToBottom();
        }, 0);
      }

      this.commentPushQueue.shift();
    }, 1000);
  }

  onReceiveComments(comment: CommentModel) {
    for (let _comment of this.comments) {
      if (_comment.id === comment.id) return;
    }

    for (let _comment of this.commentPushQueue) {
      if (_comment.id === comment.id) return;
    }

    comment.type = CommentType.Text;

    if (this.comments.length < 5) {
      this.scroller.appendData([comment]);
    } else {
      this.commentPushQueue.push(comment);
    }

    if (!this.isOnBottom) {
      this.unreadCount++;
    }
  }

  onReceivedEvents(evt: MqEvent) {
    let comment = new CommentModel();

    switch (evt.event) {
      case EventType.LiveAudienceJoined:
        comment.type = CommentType.AudienceJoined;
        comment.eventData = evt.info;
        this.commentPushQueue.push(comment);
        break;
      case EventType.LiveCommentPushed:
        comment.id = evt.info.comment.id;
        comment.createdAt = evt.info.comment.createdAt;
        comment.type = CommentType.CommentPushed;
        comment.eventData = evt.info;
        this.commentPushQueue.push(comment);
        break;
    }
  }

  getPrevComments(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.streamId, [], marker, limit, sorts).then(comments => {
      comments.reverse();
      this.scroller.prependData(comments);

      if (comments.length === 0) {
        this.isOnOldest = true;
      }

      this.isLoading = false;
    });
  }

  gotoLatestComments(): Promise<boolean> {
    if (this.isLoading) return Promise.resolve(false);

    this.isLoading = true;

    return this.commentApiService.listComments(this.streamId, [], '', 10).then(comments => {
      comments.reverse();
      this.scroller.resetData(comments);
      this.isOnOldest = false;
      this.isOnLatest = true;
      this.isOnBottom = true;
      this.isLoading = false;
      this.unreadCount = 0;
      return true;
    });
  }

  gotoOldestComments(): Promise<boolean> {
    if (this.isLoading) return Promise.resolve(false);

    this.isLoading = true;

    return this.commentApiService.listComments(this.streamId, [], '', 10, ['createdAt']).then(comments => {
      this.scroller.resetData(comments);
      this.isOnOldest = true;
      this.isOnLatest = false;
      this.isOnBottom = false;
      this.isLoading = false;
      return true;
    });
  }

  onScroll(e: ScrollerEventModel) {
    if (this.comments.length !== 0) {
      if (e.position === ScrollerPosition.OnTop) {
        let firstComment = this.comments[0];
        this.getPrevComments(`$lt${firstComment.createdAt}`, 10, ['-createdAt']);
      }
    }

    // 不要做滚动拉取最新, 弹幕有自动推送, 重复拉会有问题

    this.isOnBottom = e.position == ScrollerPosition.OnBottom;
  }

  startObserveAction() {
    this.actionSubscription = this.commentService.action$.subscribe(
      oldestOrLatest => {
        this.scroller.stopEmitScrollEvent();

        if (oldestOrLatest) {
          this.gotoOldestComments().then(result => {
            if (result) {
              setTimeout(() => {
                this.scroller.scrollToTop();

                // 等待滚动完毕
                setTimeout(() => {
                  this.scroller.startEmitScrollEvent();
                }, 0);
              }, 0);
            }
          });
        } else {
          this.gotoLatestComments().then(result => {
            if (result) {
              setTimeout(() => {
                this.scroller.scrollToBottom();

                // 等待滚动完毕
                setTimeout(() => {
                  this.scroller.startEmitScrollEvent();
                }, 0);
              }, 0);
            }
          });
        }
      }
    );
  }

  gotoCommentList(comment?: CommentModel) {
    let query: any = {};

    if (comment) {
      query.marker = `$gte${comment.createdAt}`;

      if (comment.toUsers && comment.toUsers.length !== 0) {
        query.uids = [];

        for (let user of comment.toUsers) {
          query.uids.push(user.uid);
        }
      }

      if (comment.toUids && comment.toUids.length) query.uids = comment.toUids.join(','); // 兼容推送过来的评论, 里面只有toUids, 无用户信息。
    }

    this.router.navigate([`/lives/${this.streamId}/push-comment`, query]);
  }

  triggerGotoLatest() {
    this.scroller.scrollToBottom();
    this.unreadCount = 0;
    this.isOnBottom = true;
  }
}
