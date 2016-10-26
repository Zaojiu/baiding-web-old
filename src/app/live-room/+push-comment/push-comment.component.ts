import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
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
  BottomPopupSelectorItemModel
} from "../../shared/bottom-popup-selector/bottom-popup-selector.model";

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

  constructor(private route: ActivatedRoute, private router: Router, private commentApiService: CommentApiService,
              private pushCommentService: PushCommentService, private userInfoService: UserInfoService,
              private liveService: LiveService, private timelineService: TimelineService,
              private bottomPopupService: BottomPopupSelectorService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];

    let userInfoPromise = this.userInfoService.getUserInfo();
    let liveInfoPromise = this.liveService.getLiveInfo(this.liveId);

    Promise.all([userInfoPromise, liveInfoPromise]).then((result: any[]) => {
      this.userInfo = result[0];
      this.liveInfo = result[1];

      this.gotoFirstComments();
      this.startObserveTimelineScroll();
    });

    this.timelineService.startReceive(this.liveId);
    this.timelineService.onReceivedEvents(evt => this.onReceivedEventsReturn(evt));
  }

  ngOnDestroy() {
    this.stopObserveTimelineScroll();
    if (this.popupSelectorSubscription) this.popupSelectorSubscription.unsubscribe();
    if (this.closeSelectorSubscription) this.closeSelectorSubscription.unsubscribe();
  }

  onReceivedEventsReturn(evt: MqEvent) {
    if (evt.event == EventType.LiveMsgUpdate) {
      this.unreadCount++;
    }
  }

  isClosed(): boolean {
    return this.liveInfo.status == LiveStatus.Ended;
  }

  gotoFirstComments() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.liveId, '', 20, ['createdAt']).then(comments => {
      this.comments = comments;
      this.isOnNewest = true;
      this.isOnLatest = false;
      this.isLoading = false;
    });
  }

  getNextComments(marker: string, limit: number, sorts: string[]) {
    if (this.isLoading) return;

    this.isLoading = true;

    this.commentApiService.listComments(this.liveId, marker, limit, sorts).then(comments => {
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

    this.commentApiService.listComments(this.liveId, marker, limit, sorts).then(comments => {
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

  pushComment(comment: CommentModel) {
    this.router.navigate([`/lives/${this.liveId}/post`, {'comment_id': comment.id}]);
  }


  backToMainScreen() {
    this.router.navigate(['/lives/' + this.liveId]);
  }

  popupBottomSelector() {
    if (this.bottomPopupService.isClosed) {
      const model = new BottomPopupSelectorModel();
      model.items = [];

      model.items.push(new BottomPopupSelectorItemModel('admin', '@主持人', true));
      model.items.push(new BottomPopupSelectorItemModel('invite', '@嘉宾A', true));
      model.hasBottomBar = false;

      this.bottomPopupService.popup(model);

      this.popupSelectorSubscription = this.bottomPopupService.itemSelected$.subscribe(
        item => {
          if (item.id === 'admin') return this.filterPeople();
          //todo
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

  filterPeople() {
    //todo
  }
}
