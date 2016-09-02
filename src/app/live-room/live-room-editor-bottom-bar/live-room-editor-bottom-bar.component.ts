import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BottomPopupSelectorService } from '../../shared/bottom-popup-selector/bottom-popup-selector.service';
import { BottomPopupSelectorModel } from '../../shared/bottom-popup-selector/bottom-popup-selector.model';
import { LiveRoomTimelineService } from '../live-room-timeline/live-room-timeline.service';
import { LiveService } from '../../shared/live/live.service';

@Component({
  selector: 'live-room-editor-bottom-bar',
  templateUrl: './live-room-editor-bottom-bar.component.html',
  styleUrls: ['./live-room-editor-bottom-bar.component.scss']
})

export class LiveRoomEditorBottomBarComponent implements OnInit, OnDestroy {
  id: string;
  popupSelectorSubscription: Subscription;
  closeSelectorSubscription: Subscription;
  routerSubscription: Subscription;
  @Input() isOnBottom: boolean;
  @Input() isOnTop: boolean;

  constructor(private route: ActivatedRoute, private router: Router,
    private bottomPopupService: BottomPopupSelectorService, private liveRoomTimelineService: LiveRoomTimelineService,
    private liveService: LiveService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    // 监控router变化，如果route换了，那么关闭全局弹出层
    this.routerSubscription = this.router.events.subscribe(
      event => {
        if ( event instanceof NavigationStart ) {
          if (!this.bottomPopupService.isClosed) this.bottomPopupService.close();
        }
      }
    );
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    if (this.popupSelectorSubscription) this.popupSelectorSubscription.unsubscribe();
    if (this.closeSelectorSubscription) this.closeSelectorSubscription.unsubscribe();
  }

  gotoPushComment() {
    this.router.navigate(['/lives/' + this.id + '/push-comment']);
  }

  gotoPostComment() {
    this.router.navigate(['/lives/' + this.id + '/post-comment']);
  }

  popupBottomSelector() {
    if (this.bottomPopupService.isClosed) {
      const model = new BottomPopupSelectorModel();
      model.items = [];

      if (!this.isOnTop) model.items.push('回到开始');
      if (!this.isOnBottom) model.items.push('查看最新');
      model.items.push('邀请嘉宾');
      model.items.push('结束直播');
      model.hasBottomBar = true;

      this.bottomPopupService.popup(model);

      this.popupSelectorSubscription = this.bottomPopupService.itemSelected$.subscribe(
        item => {
          if (item === '回到开始') return this.liveRoomTimelineService.gotoFirstComment();
          if (item === '查看最新') return this.liveRoomTimelineService.gotoLastComment();
          if (item === '邀请嘉宾') return
          if (item === '结束直播') return this.liveService.closeLive(this.id);
        }
      );

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
}
