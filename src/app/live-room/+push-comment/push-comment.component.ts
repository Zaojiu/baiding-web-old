import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';

import {CommentApiService} from '../../shared/api/comment/comment.service'
import {LiveService} from '../../shared/api/live/live.service';
import {CommentModel} from '../../shared/api/comment/comment.model'
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveStatus} from '../../shared/api/live/live.enums';
import {BottomPopupSelectorService} from '../../shared/bottom-popup-selector/bottom-popup-selector.service';
import {
  BottomPopupSelectorModel,
  BottomPopupSelectorItemModel, BottomPopupSelectorMode
} from "../../shared/bottom-popup-selector/bottom-popup-selector.model";
import {SafeHtml, DomSanitizer} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";
import {ScrollerDirective} from "../../shared/scroller/scroller.directive";
import {ScrollerEventModel} from "../../shared/scroller/scroller.model";
import {ScrollerPosition} from "../../shared/scroller/scroller.enums";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";

@Component({
  templateUrl: './push-comment.component.html',
  styleUrls: ['./push-comment.component.scss'],
})

export class PushCommentComponent implements OnInit, OnDestroy {
  liveId: string;
  commentId: string;
  comments: CommentModel[] = [];
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  isOnLatest: boolean;
  isOnNewest: boolean;
  isLoading: boolean;
  popupSelectorSubscription: Subscription;
  closeSelectorSubscription: Subscription;
  marker = '';
  uids: number[] = [];
  routerSubscription: Subscription;
  hasInit: boolean;
  @ViewChild(ScrollerDirective) scroller: ScrollerDirective;
  isInApp = UtilsService.isInApp;

  constructor(private route: ActivatedRoute, private router: Router, private commentApiService: CommentApiService,
              private operationTips: OperationTipsService, private liveService: LiveService,
              private bottomPopupService: BottomPopupSelectorService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    this.userInfo = this.route.snapshot.data['userInfo'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.commentId = this.route.snapshot.params['commentId'];

    // 监控router变化，如果route换了，那么重新获取以下值
    this.routerSubscription = this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          this.resetRouteParams().then(() => {
            if (!this.hasInit) {
              // 首次拉取后清除marker;
              this.marker = '';
              this.hasInit = true;

              // 如果scrollToBottom则滚动到底部
              if (this.route.snapshot.params['scrollToBottom']) {
                this.scroller.stopEmitScrollEvent();
                setTimeout(() => {
                  this.scroller.scrollToBottom();

                  // 等待滚动完毕
                  setTimeout(() => {
                    this.scroller.startEmitScrollEvent();
                  }, 0);
                }, 0);
              }
            }
          });
        }
      }
    );
  }

  ngOnDestroy() {
    this.bottomPopupService.close();
    if (this.popupSelectorSubscription) this.popupSelectorSubscription.unsubscribe();
    if (this.closeSelectorSubscription) this.closeSelectorSubscription.unsubscribe();
  }

  resetRouteParams(): Promise<void> {
    this.marker = this.route.parent.snapshot.params['marker'] || '';

    let uidsStr = this.route.parent.snapshot.params['uids'];
    let uidNums: number[] = [];
    if (uidsStr) {
      let uids = uidsStr.split(',');
      for (let uid of uids) {
        let uidNum = +uid;
        if (uidNum) uidNums.push(uidNum);
      }
    }


    this.uids = uidNums;

    return this.gotoFirstComments();
  }

  isClosed(): boolean {
    return this.liveInfo.status === LiveStatus.Ended;
  }

  gotoFirstComments(): Promise<void> {
    if (this.isLoading) return Promise.reject('');

    this.isLoading = true;

    return this.commentApiService.listComments(this.liveId, this.uids, this.marker, 20, ['createdAt']).then(comments => {
      this.scroller.resetData(comments);
      this.isOnNewest = true;
      this.isOnLatest = false;
      return;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  getNextComments(toUids: number[], marker: string, limit: number, sorts: string[]): Promise<void> {
    if (this.isLoading) return Promise.reject('');

    this.isLoading = true;

    return this.commentApiService.listComments(this.liveId, toUids, marker, limit, sorts).then(comments => {
      this.scroller.appendData(comments);

      if (comments.length === 0) {
        this.isOnLatest = true;
      }

      return;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  getPrevComments(toUids: number[], marker: string, limit: number, sorts: string[]): Promise<void> {
    if (this.isLoading) return Promise.reject('');

    this.isLoading = true;

    return this.commentApiService.listComments(this.liveId, toUids, marker, limit, sorts).then(comments => {
      comments.reverse();

      this.scroller.prependData(comments);

      if (comments.length === 0) {
        this.isOnNewest = true;
      }

      return;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  onScroll(e: ScrollerEventModel) {
    if (this.comments.length !== 0) {
      if (e.position === ScrollerPosition.OnTop) {
        let firstComment = this.comments[0];
        this.getPrevComments(this.uids, `$lt${firstComment.createdAt}`, 10, ['-createdAt']).finally(() => {
          this.scroller.hideHeadLoading();
        });
      } else if (e.position === ScrollerPosition.OnBottom) {
        let lastComment = this.comments[this.comments.length - 1];
        this.getNextComments(this.uids, `$gt${lastComment.createdAt}`, 10, ['createdAt']).finally(() => {
          this.scroller.hideFootLoading();
        });
      }
    }
  }

  pushComment(comment: CommentModel) {
    this.router.navigate([`lives/${this.liveId}/post`, {'comment_id': comment.id}]);
  }

  parseContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(UtilsService.parseAt(content));
  }

  popupBottomSelector() {
    if (this.bottomPopupService.isClosed) {
      const model = new BottomPopupSelectorModel();
      model.items = [];

      let adminChecked = _.includes(this.uids, this.liveInfo.admin.uid);
      let text = this.liveInfo.admin.uid === this.userInfo.uid ? '@我' : `@主持人 ${this.liveInfo.admin.nick}`;

      model.items.push(new BottomPopupSelectorItemModel(
        this.liveInfo.admin.uid.toString(), text, true, BottomPopupSelectorMode.Multi, adminChecked));

      for (let vip of this.liveInfo.editors) {
        let editorChecked = _.includes(this.uids, vip.uid);
        let text = vip.uid === this.userInfo.uid ? '@我' : `@嘉宾 ${vip.nick}`;
        model.items.push(new BottomPopupSelectorItemModel(vip.uid.toString(), text, true, BottomPopupSelectorMode.Multi, editorChecked));
      }
      model.completeText = '完成';
      model.needSubscribe = false;

      this.bottomPopupService.popup(model);

      this.popupSelectorSubscription = this.bottomPopupService.itemSelected$.subscribe(
        item => {
          return this.filterEditorComment(item);
        }
      );

      // 关闭的时候取消掉上面的监听
      this.closeSelectorSubscription = this.bottomPopupService.needClose$.subscribe(
        () => {
          this.popupSelectorSubscription.unsubscribe();
          this.closeSelectorSubscription.unsubscribe();
        }
      );
    } else {
      this.bottomPopupService.close();
    }
  }

  banComment(uid: number) {
    if (!this.liveInfo.isAdmin(this.userInfo.uid) || this.liveInfo.isEditor(uid)) return;

    if (this.bottomPopupService.isClosed) {
      const model = new BottomPopupSelectorModel();
      model.items = [];

      model.items.push(new BottomPopupSelectorItemModel(uid.toString(), '禁止此人发言'));

      model.needSubscribe = false;

      this.bottomPopupService.popup(model);

      this.popupSelectorSubscription = this.bottomPopupService.itemSelected$.subscribe(
        item => {
          let uid = +item.id;
          this.liveService.banComment(this.liveId, uid).then(() => {
            this.operationTips.popup('禁言成功');
          });
        }
      );

      // 关闭的时候取消掉上面的监听
      this.closeSelectorSubscription = this.bottomPopupService.needClose$.subscribe(
        () => {
          this.popupSelectorSubscription.unsubscribe();
          this.closeSelectorSubscription.unsubscribe();
        }
      );
    } else {
      this.bottomPopupService.close();
    }
  }

  filterEditorComment(item: BottomPopupSelectorItemModel) {
    let query: any = {};

    query.marker = this.marker;

    let uidObj = {};

    for (let uid of this.uids) {
      uidObj[uid] = true;
    }

    if (item.checked) {
      uidObj[item.id] = true;
    } else {
      delete uidObj[item.id];
    }

    let uids = Object.keys(uidObj);
    let uidNums: number[] = [];

    for (let uid of uids) {
      uidNums.push(+uid);
    }

    query.uids = uids.join(',');
    this.uids = uidNums;

    this.router.navigate([`lives/${this.liveId}/push-comment`, query]);
  }
}
