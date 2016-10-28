import {Component, OnInit, OnDestroy, Input, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {CommentModel, CommentType} from '../../shared/api/comment/comment.model';
import {CommentService} from './comment.service';
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {ScrollerDirective} from "../../shared/scroller/scroller.directive";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";
import {ScrollerPosition} from "../../shared/scroller/scroller.enums";
import {Subscription} from "rxjs";
import {SafeHtml, DomSanitizer} from "@angular/platform-browser";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {MqEvent, EventType} from "../../shared/mq/mq.service";
import {TimelineService} from "../timeline/timeline.service";

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
  commentAtMe: CommentModel = null;
  commentPushed: CommentModel = null;
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
    let content = '';

    switch (comment.type) {
      case CommentType.Text:
        var atRegexp = /(@.+?)\((.+?)\)/g;
        var _content = '';

        content = comment.content;

        while (true) {
          var atTextArr = atRegexp.exec(content);
          if (!atTextArr || atTextArr.length != 3 || !atRegexp.lastIndex) break;

          _content = content.replace(atTextArr[0], `<span class="highlight">${atTextArr[1]}</span>`);
        }

        if (_content === '') _content = content;

        return this.sanitizer.bypassSecurityTrustHtml(_content);

      case CommentType.AudienceJoined:
        content = `${comment.eventData.user.nick}加入话题讨论`;
        return this.sanitizer.bypassSecurityTrustHtml(content);

      case CommentType.CommentPushed:
        if (comment.eventData.comment_user.uid === this.userInfo.uid) {
          content = '<span class="highlight">我的评论被推送了</span>';
        } else {
          content = `${comment.eventData.comment_user.nick}的评论被推送了`;
        }

        return this.sanitizer.bypassSecurityTrustHtml(content);
      default:
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
  }

  startPushComment() {
    this.commentPushQueueTimer = setInterval(() => {
      if (this.commentPushQueue.length === 0) return;

      this.comments.push(this.commentPushQueue[0]);

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
      if (_comment.id == comment.id) return;
    }

    for (let _comment of this.commentPushQueue) {
      if (_comment.id == comment.id) return;
    }

    comment.type = CommentType.Text;

    if (this.comments.length < 5) {
      this.comments.push(comment);
    } else {
      this.commentPushQueue.push(comment);
    }

    if (!this.isOnBottom) {
      this.unreadCount++;
    }

    if (comment.toUids && comment.toUids.length != 0) {
      for (let uid of comment.toUids) {
        if (uid === this.userInfo.uid) this.commentAtMe = comment;
      }
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
        comment.type = CommentType.CommentPushed;
        comment.eventData = evt.info;
        this.commentPushQueue.push(comment);
        if (comment.eventData.comment_user.uid === this.userInfo.uid) this.commentPushed = comment;
        break;
    }
  }

  getNextComments(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.streamId, [], marker, limit, sorts).then(comments => {
      // this.removeRepeat(comments);

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

    this.commentApiService.listComments(this.streamId, [], marker, limit, sorts).then(comments => {
      // this.removeRepeat(comments);

      for (let comment of comments) {
        this.comments.unshift(comment);
      }

      if (comments.length === 0) {
        this.isOnOldest = true;
      }

      this.isLoading = false;
    });
  }

  gotoLatestComments(): Promise<boolean> {
    if (this.isLoading) return Promise.resolve(false);

    this.isLoading = true;

    return this.commentApiService.listComments(this.streamId).then(comments => {
      comments = comments.reverse();
      this.comments = comments;
      this.isOnOldest = false;
      this.isOnLatest = true;
      this.isOnBottom = true;
      this.isLoading = false;
      return true;
    });
  }

  gotoOldestComments(): Promise<boolean> {
    if (this.isLoading) return Promise.resolve(false);

    this.isLoading = true;

    return this.commentApiService.listComments(this.streamId, [], '', 20, ['createdAt']).then(comments => {
      this.comments = comments;
      this.isOnOldest = true;
      this.isOnLatest = false;
      this.isOnBottom = false;
      this.isLoading = false;
      return true;
    });
  }

  removeRepeat(comments: CommentModel[]) {
    if (!comments || !comments.length) return;

    let idsX = {};
    for (let idx in this.comments) {
      idsX[this.comments[idx].id] = idx
    }
    let idY = {};
    let idxs = [];
    for (let comment of comments) {
      idY[comment.id] = true;
      if (!idsX[comment.id]) {
        idxs.push(idsX[comment.id])
      }
    }
    idxs = idxs.sort().reverse();
    for (let idx of idxs) {
      this.comments.splice(idx, 1);
    }
  }

  onScroll(e: ScrollerEventModel) {
    if (e.position == ScrollerPosition.OnTop) {
      if (this.comments.length === 0) return;
      let firstComment = this.comments[0];
      this.getPrevComments(`$lt${firstComment.createdAt}`, 20, ['-createdAt']);
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
      query.marker = comment.id;

      if (comment.toUsers && comment.toUsers.length !== 0) {
        query.uids = [];

        for (let user of comment.toUsers) {
          query.uids.push(user.uid)
        }
      }

      if (comment.toUids && comment.toUids.length) query.uids = comment.toUids.join(','); // 兼容推送过来的评论, 里面只有toUids, 无用户信息。
    }

    this.router.navigate([`/lives/${this.streamId}/push-comment`, query]);
  }

  triggerGotoLatest() {
    this.scroller.scrollToBottom();
    this.unreadCount = 0;
  }
}
