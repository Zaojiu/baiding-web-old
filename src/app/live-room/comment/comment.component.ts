import {Component, OnInit, OnDestroy, Input, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {CommentModel} from '../../shared/api/comment/comment.model';
import {CommentService} from './comment.service';
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {ScrollerDirective} from "../../shared/scroller/scroller.directive";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";
import {ScrollerPosition} from "../../shared/scroller/scroller.enums";
import {Subscription} from "rxjs";

@Component({
  selector: 'comments',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})

export class CommentComponent implements OnInit, OnDestroy {
  @Input() streamId: string;
  comments: CommentModel[] = [];
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  isLoading = false;
  isOnOldest: boolean;
  isOnLatest: boolean;
  actionSubscription: Subscription;
  commentPushQueue: CommentModel[] = [];
  commentPushQueueTimer: any;
  isOnBottom: boolean;
  unreadCount = 0;

  constructor(private commentService: CommentService, private router: Router, private commentApiService: CommentApiService) {
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
    });
  }

  ngOnDestroy() {
    this.commentService.stopReceive(this.streamId);
    this.actionSubscription.unsubscribe();
    clearInterval(this.commentPushQueueTimer);
  }

  startPushComment() {
    this.commentPushQueueTimer = setInterval(() => {
      if (this.commentPushQueue.length === 0) return;

      this.scroller.stopEmitScrollEvent();
      this.comments.push(this.commentPushQueue[0]);

      // 等待渲染完毕
      setTimeout(() => {
        this.scroller.scrollToBottom();

        // 等待滚动完毕
        setTimeout(() => {
          this.scroller.startEmitScrollEvent();
        }, 0);
      }, 0);

      this.commentPushQueue.shift();
    }, 1000);
  }

  onReceiveComments(comment: CommentModel) {
    for (let _comment of this.comments) {
      if (_comment.id == comment.id) {
        return
      }
    }

    for (let _comment of this.commentPushQueue) {
      if (_comment.id == comment.id) {
        return
      }
    }
    if (this.isOnBottom) {
      this.commentPushQueue.push(comment);
    } else {
      this.unreadCount++;
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

  gotoCommentList() {
    this.router.navigate([`/lives/${this.streamId}/push-comment`]);
  }

  triggerGotoLatest() {
    this.commentService.gotoLastComments();
    this.unreadCount = 0;
  }
}
