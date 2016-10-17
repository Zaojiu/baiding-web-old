import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {BottomPopupSelectorService} from '../../shared/bottom-popup-selector/bottom-popup-selector.service';
import {BottomPopupSelectorModel} from '../../shared/bottom-popup-selector/bottom-popup-selector.model';
import {TimelineService} from '../timeline/timeline.service';
import { LiveService } from '../../shared/live/live.service';
import { LiveInfoModel } from '../../shared/live/live.model';
import { UserInfoModel } from '../../shared/user-info/user-info.model';
import {ModalService} from '../../shared/modal/modal.service';
import {WechatService} from '../../shared/wechat/wechat.service';
import {MessageApiService} from '../../shared/api/message.api';
import { SharePopupService } from '../../shared/share-popup/share-popup.service';
import { UserAnimEmoji } from '../../shared/praised-animation/praised-animation.model';
import { MqEvent, EventType } from '../../shared/mq/mq.service';


@Component({
  selector: 'editor-bottom-bar',
  templateUrl: './editor-bottom-bar.component.html',
  styleUrls: ['./editor-bottom-bar.component.scss'],
})

export class EditorBottomBarComponent implements OnInit, OnDestroy {
  @Input() liveId: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  popupSelectorSubscription: Subscription;
  closeSelectorSubscription: Subscription;
  recordSubscription: Subscription;
  isRecording: boolean;
  isCanceled: boolean;
  isTooShort: boolean;
  timer: any;
  recordDuration: number;
  minRecordDuration = 20;
  praisedSub: Subscription;

  constructor(private router: Router,
              private bottomPopupService: BottomPopupSelectorService, private timelineService: TimelineService,
              private messageApiService: MessageApiService,
              private liveService: LiveService, private wechatService: WechatService,
              private modalService: ModalService, private sharePopupService: SharePopupService,) {
  }

  ngOnInit() {
    this.recordSubscription = this.wechatService.record$.subscribe(audioModel => {
      this.messageApiService.postAudioMessage(this.liveId, audioModel.localId, audioModel.serverId, audioModel.translateResult);
    });

    this.praisedSub = this.timelineService.event$.subscribe((evt: MqEvent) => {
      if (evt.event != EventType.LivePraise) {
        return
      }
      if (evt.info.user.uid == this.userInfo.uid) {
        return
      }
      let userAnim = new UserAnimEmoji;
      userAnim.emoji = evt.info.emoji;
      userAnim.user = new UserInfoModel;
      this.liveInfo.praisedAnimations.push(userAnim);
    })
  }

  ngOnDestroy() {
    if (this.popupSelectorSubscription) this.popupSelectorSubscription.unsubscribe();
    if (this.closeSelectorSubscription) this.closeSelectorSubscription.unsubscribe();
    if (this.recordSubscription) this.recordSubscription.unsubscribe();

    this.praisedSub.unsubscribe();
  }

  gotoPushComment() {
    this.router.navigate([`/lives/${this.liveId}/push-comment`]);
  }

  gotoPostMessage() {
    this.router.navigate([`/lives/${this.liveId}/post`]);
  }

  gotoInvitation() {
    this.router.navigate([`/lives/${this.liveId}/invitation`]);
  }

  popupShare() {
    this.sharePopupService.popup()
  }

  isAdmin(): boolean {
    return this.liveService.isAdmin(this.liveId);
  }

  popupBottomSelector() {
    if (this.bottomPopupService.isClosed) {
      const model = new BottomPopupSelectorModel();
      model.items = [];

      model.items.push('邀请嘉宾');
      model.items.push('结束直播');

      model.hasBottomBar = false;

      this.bottomPopupService.popup(model);

      this.popupSelectorSubscription = this.bottomPopupService.itemSelected$.subscribe(
        item => {
          if (item === '邀请嘉宾') return this.gotoInvitation();
          if (item === '结束直播') return this.modalService.popup('结束此次直播?').then(result => {
            if (result) this.liveService.closeLive(this.liveId);
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

  startRecord() {
    if (this.isRecording) return;

    this.isRecording = true;
    this.isCanceled = false;
    this.isTooShort = false;

    this.recordDuration = 0;
    this.timer = setInterval(() => {
      this.recordDuration++
    }, 100);

    this.wechatService.startRecord();
  }

  stopRecord() {
    console.log('record stop called');
    if (!this.isRecording || this.isCanceled || this.isTooShort) return;

    if (this.recordDuration < this.minRecordDuration) {
      this.isTooShort = true;
      this.wechatService.cancelRecord();

      console.log('record cancel because too short');

      clearInterval(this.timer);

      this.timer = setTimeout(() => {
        this.isRecording = false;
        clearTimeout(this.timer);
      }, 1000)
    } else {
      this.isRecording = false;
      this.wechatService.stopRecord();
      console.log('record stoped');
    }
  }

  cancelRecord() {
    if (!this.isRecording || this.isCanceled || this.isTooShort) return;

    this.isCanceled = true;

    clearInterval(this.timer);

    this.timer = setTimeout(() => {
      this.isRecording = false;
      clearTimeout(this.timer)
    }, 1000);

    this.wechatService.cancelRecord();
  }
}
