import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';

import {CommentApiService} from '../../shared/api/comment/comment.service'
import {PushCommentService} from './push-comment.service'
import {LiveService} from '../../shared/api/live/live.service';
import {UserInfoService} from '../../shared/api/user-info/user-info.service';
import {CommentModel} from '../../shared/api/comment/comment.model'
import {UserInfoModel} from '../../shared/api/user-info/user-info.model';
import {LiveInfoModel} from '../../shared/api/live/live.model';
import {LiveStatus} from '../../shared/api/live/live.enums';
import {MqEvent, EventType} from "../../shared/mq/mq.service";
import {TimelineService} from '../../live-room/timeline/timeline.service';
import {BottomPopupSelectorService} from '../../shared/bottom-popup-selector/bottom-popup-selector.service';
import {
  BottomPopupSelectorModel,
  BottomPopupSelectorItemModel, BottomPopupSelectorMode
} from "../../shared/bottom-popup-selector/bottom-popup-selector.model";
import * as _ from 'lodash';
import {SafeHtml, DomSanitizer} from "@angular/platform-browser";
import {UtilsService} from "../../shared/utils/utils";

@Component({
  templateUrl: './push-comment.component.html',
  styleUrls: ['./push-comment.component.scss'],
})

export class PushCommentComponent implements OnInit, OnDestroy {
  liveId: string;
  comments: CommentModel[] = [];
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  scrollSubscription: Subscription;
  isOnLatest: boolean;
  isOnNewest: boolean;
  isLoading: boolean;
  unreadCount = 0;
  popupSelectorSubscription: Subscription;
  closeSelectorSubscription: Subscription;
  marker = '';
  uids: number[] = [];
  routerSubscription: Subscription;
  hasInit: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private commentApiService: CommentApiService,
              private pushCommentService: PushCommentService, private userInfoService: UserInfoService,
              private liveService: LiveService, private timelineService: TimelineService,
              private bottomPopupService: BottomPopupSelectorService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];

    // 监控router变化，如果route换了，那么重新获取以下值
    this.routerSubscription = this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          this.resetRouteParams();

          if (!this.hasInit) {
            // 首次拉取后清除marker;
            this.marker = '';
            this.hasInit = true;
          }
        }
      }
    );

    let userInfoPromise = this.userInfoService.getUserInfo();
    let liveInfoPromise = this.liveService.getLiveInfo(this.liveId);

    Promise.all([userInfoPromise, liveInfoPromise]).then((result: any[]) => {
      this.userInfo = result[0];
      this.liveInfo = result[1];

      this.startObserveTimelineScroll();
    });

    this.timelineService.startReceive(this.liveId);
    this.timelineService.onReceivedEvents(evt => this.onReceivedEventsReturn(evt));
  }

  ngOnDestroy() {
    this.stopObserveTimelineScroll();
    this.bottomPopupService.close();
    if (this.popupSelectorSubscription) this.popupSelectorSubscription.unsubscribe();
    if (this.closeSelectorSubscription) this.closeSelectorSubscription.unsubscribe();
  }

  onReceivedEventsReturn(evt: MqEvent) {
    if (evt.event === EventType.LiveMsgUpdate) {
      this.unreadCount++;
    }
  }

  resetRouteParams() {
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

    this.gotoFirstComments();
  }

  isClosed(): boolean {
    return this.liveInfo.status === LiveStatus.Ended;
  }

  gotoFirstComments() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.liveId, this.uids, this.marker, 20, ['createdAt']).then(comments => {
      this.comments = comments;
      this.isOnNewest = true;
      this.isOnLatest = false;
      this.isLoading = false;
    });
  }

  getNextComments(toUids: number[], marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.liveId, toUids, marker, limit, sorts).then(comments => {
      for (let comment of comments) {
        this.comments.push(comment);
      }

      if (comments.length === 0) {
        this.isOnLatest = true;
      }

      this.isLoading = false;
    });
  }

  getPrevComments(toUids: number[], marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.liveId, toUids, marker, limit, sorts).then(comments => {
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
    this.scrollSubscription = this.pushCommentService.scroller$.subscribe(
      topOrBottom => {
        if (topOrBottom) {
          if (this.comments.length === 0) return;
          let firstComment = this.comments[0];
          this.getPrevComments(this.uids, `$lt${firstComment.createdAt}`, 20, ['-createdAt']);
        } else {
          if (this.comments.length === 0) return;
          let lastComment = this.comments[this.comments.length - 1];
          this.getNextComments(this.uids, `$gt${lastComment.createdAt}`, 20, ['createdAt']);
        }
      }
    );
  }

  stopObserveTimelineScroll() {
    this.scrollSubscription.unsubscribe();
  }

  pushComment(comment: CommentModel) {
    this.router.navigate([`/lives/${this.liveId}/post`, {'comment_id': comment.id}]);
  }

  parseContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(UtilsService.parseAt(content));
  }

  backToMainScreen() {
    this.router.navigate(['/lives/' + this.liveId]);
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
