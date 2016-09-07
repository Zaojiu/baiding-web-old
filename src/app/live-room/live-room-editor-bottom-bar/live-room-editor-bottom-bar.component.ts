import { Component, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

import { BottomPopupSelectorService } from '../../shared/bottom-popup-selector/bottom-popup-selector.service';
import { BottomPopupSelectorModel } from '../../shared/bottom-popup-selector/bottom-popup-selector.model';
import { LiveRoomTimelineService } from '../live-room-timeline/live-room-timeline.service';
import { LiveService } from '../../shared/live/live.service';
import { WechatService } from '../../shared/wechat/wechat.service';
import { PostCommentService } from '../../shared/comment/post-comment.service';

@Component({
  selector: 'live-room-editor-bottom-bar',
  templateUrl: './live-room-editor-bottom-bar.component.html',
  styleUrls: ['./live-room-editor-bottom-bar.component.scss'],
  providers: [ PostCommentService ]
})

export class LiveRoomEditorBottomBarComponent implements OnDestroy {
  @Input() liveId: string;
  popupSelectorSubscription: Subscription;
  closeSelectorSubscription: Subscription;
  recordSubscription: Subscription;
  @Input() isOnTop: boolean;
  @Input() isOnBottom: boolean;

  constructor(private route: ActivatedRoute, private router: Router,
    private bottomPopupService: BottomPopupSelectorService, private liveRoomTimelineService: LiveRoomTimelineService,
    private liveService: LiveService, private wechatService: WechatService,
    private titleService: Title, private postCommentService: PostCommentService) {}

  ngOnDestroy() {
    if (this.popupSelectorSubscription) this.popupSelectorSubscription.unsubscribe();
    if (this.closeSelectorSubscription) this.closeSelectorSubscription.unsubscribe();
    if (this.recordSubscription) this.recordSubscription.unsubscribe();
  }

  gotoPushDanmu() {
    this.router.navigate([`/lives/${this.liveId}/push-danmu`]);
  }

  gotoPostComment() {
    this.router.navigate([`/lives/${this.liveId}/post-comment`]);
  }

  gotoInvitation() {
    this.router.navigate([`/lives/${this.liveId}/invitation`]);
  }

  popupBottomSelector() {
    if (this.bottomPopupService.isClosed) {
      const model = new BottomPopupSelectorModel();
      model.items = [];

      if (!this.isOnTop) model.items.push('回到开始');
      if (!this.isOnBottom) model.items.push('查看最新');
      model.items.push('邀请嘉宾');
      model.items.push('结束直播');
      model.hasBottomBar = false;

      this.bottomPopupService.popup(model);

      this.popupSelectorSubscription = this.bottomPopupService.itemSelected$.subscribe(
        item => {
          if (item === '回到开始') return this.liveRoomTimelineService.gotoFirstComment();
          if (item === '查看最新') return this.liveRoomTimelineService.gotoLastComment();
          if (item === '邀请嘉宾') return this.gotoInvitation()
          if (item === '结束直播') return this.liveService.closeLive(this.liveId);
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

  startRecord() {
    this.recordSubscription = this.wechatService.record$.subscribe(audioModel => {
      this.postCommentService.postAudioComment(this.liveId, audioModel.localId, audioModel.serverId, audioModel.translateResult)
      this.recordSubscription.unsubscribe()
    });
    this.wechatService.startRecord()
  }

  stopRecord() {
    this.wechatService.stopRecord()
  }
}
