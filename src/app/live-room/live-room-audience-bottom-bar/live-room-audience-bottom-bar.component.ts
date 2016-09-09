import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { BottomPopupSelectorService } from '../../shared/bottom-popup-selector/bottom-popup-selector.service';
import { BottomPopupSelectorModel } from '../../shared/bottom-popup-selector/bottom-popup-selector.model';
import { LiveRoomTimelineService } from '../live-room-timeline/live-room-timeline.service';
import { SharePopupService } from '../../shared/share-popup/share-popup.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { LiveService } from '../../shared/live/live.service';
import { UserInfoModel } from '../../shared/user-info/user-info.model';

@Component({
  selector: 'live-room-audience-bottom-bar',
  templateUrl: './live-room-audience-bottom-bar.component.html',
  styleUrls: ['./live-room-audience-bottom-bar.component.scss']
})

export class LiveRoomAudienceBottomBarComponent {
  id: string;
  popupSelectorSubscription: Subscription;
  closeSelectorSubscription: Subscription;
  @Input() isOnLatest: boolean;
  @Input() isOnNewest: boolean;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  isLoading: boolean;

  constructor(private route: ActivatedRoute, private router: Router,
    private bottomPopupService: BottomPopupSelectorService, private liveRoomTimelineService: LiveRoomTimelineService,
    private sharePopupService: SharePopupService, private liveService: LiveService) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnDestroy() {
    if (this.popupSelectorSubscription) this.popupSelectorSubscription.unsubscribe();
    if (this.closeSelectorSubscription) this.closeSelectorSubscription.unsubscribe();
  }

  gotoPushDanmu() {
    this.router.navigate(['/lives/' + this.id + '/push-danmu']);
  }

  gotoPostComment() {
    this.router.navigate(['/lives/' + this.id + '/post-comment']);
  }

  popupShare() {
    this.sharePopupService.popup()
  }

  popupBottomSelector() {
    if (this.bottomPopupService.isClosed) {
      const model = new BottomPopupSelectorModel();
      model.items = [];

      if (!this.isOnNewest) model.items.push('回到开始');
      if (!this.isOnLatest) model.items.push('查看最新');
      model.hasBottomBar = false;

      this.bottomPopupService.popup(model);

      this.popupSelectorSubscription = this.bottomPopupService.itemSelected$.subscribe(
        item => {
          if (item === '回到开始') return this.liveRoomTimelineService.gotoFirstComment();
          if (item === '查看最新') return this.liveRoomTimelineService.gotoLastComment();
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

  confirmPraise() {
    console.log(this.liveInfo)
    if (!this.liveInfo.hadPraised) {
      if (this.isLoading) return;

      this.isLoading = true;
      this.liveService.praiseLive(this.liveInfo.id).then(() => this.isLoading = false);

      this.liveInfo.hadPraised = true;
      this.liveInfo.praised += 1;
    }

    this.liveInfo.praisedAnimations.push(this.userInfo);
    // 为了保留自己的头像在点赞用户的最后一个，所以模板里面特殊处理，检测有无hasPraised。
    // 因此不需要将自己的info推入praisedAvatars数组。
  }
}
