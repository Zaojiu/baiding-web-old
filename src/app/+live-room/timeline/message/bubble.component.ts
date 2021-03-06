import {Component, Input, OnDestroy, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';

import {MessageModel} from '../../../shared/api/message/message.model';
import {UserInfoModel} from '../../../shared/api/user-info/user-info.model';
import {LiveInfoModel} from '../../../shared/api/live/live.model';
import {UserAnimEmoji} from '../../../shared/praised-animation/praised-animation.model';
import {UtilsService} from "../../../shared/utils/utils";
import {Subscription} from "rxjs";
import {UserInfoCardService} from "../../../shared/user-info-card/user-info-card.service";
import {ModalService} from "../../../shared/modal/modal.service";
import {MessageApiService} from "../../../shared/api/message/message.api";
import {LiveRoomService} from "../../live-room.service";
import {TimelineService} from "../timeline.service";
import {showTips} from "../../../../../vue/src/store/tip";
import {OperationTipsService} from "../../../shared/operation-tips/operation-tips.service";

@Component({
  selector: 'message-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
})

export class BubbleComponent implements AfterViewInit, OnDestroy {
  @Input() liveId: string;
  @Input() message: MessageModel;
  @Input() userInfo: UserInfoModel;
  @Input() liveInfo: LiveInfoModel;
  @ViewChild('translate') translate: ElementRef;

  isLoading: boolean;
  praisesNum: number = 0;
  timer: any = -1;
  praised: boolean;
  isTranslationCollapse: boolean;
  tranlationCollapseSub: Subscription;
  isReplyCollapse = true;
  maxTranslateHeight = 34;
  private translateOriginHeight = 0;

  constructor(private messageApiService: MessageApiService, private timelineService: TimelineService,
              private router: Router, private userInfoCardService: UserInfoCardService,
              private modalService: ModalService, private liveRoomService: LiveRoomService, private operationTipsService: OperationTipsService) {
  }

  ngAfterViewInit() {
    if (this.translate) {
      this.translateOriginHeight = this.translate.nativeElement.clientHeight;

      let isGlobalTranlationCollapse = this.liveRoomService.isTranslationCollapse(this.liveId);
      setTimeout(() => this.initTranslateCollapse(isGlobalTranlationCollapse));

      this.tranlationCollapseSub = this.liveRoomService.$tranlationCollapse.subscribe((result) => {
        this.initTranslateCollapse(result);
      });

      $(window).on(`resize.bubble${this.message.id}`, () => this.resetTranslateHeight());
    }
  }

  ngOnDestroy() {
    this.tranlationCollapseSub && this.tranlationCollapseSub.unsubscribe();
    $(window).off(`resize.bubble${this.message.id}`);
  }

  resetTranslateHeight() {
    let isCollapseCache = this.isTranslationCollapse;
    this.isTranslationCollapse = false;
    setTimeout(() => {
      this.translateOriginHeight = this.translate.nativeElement.clientHeight;
      this.isTranslationCollapse = isCollapseCache;
      this.initTranslateCollapse(this.isTranslationCollapse);
    });
  }

  initTranslateCollapse(isTranlationCollapse: boolean) {
    this.isTranslationCollapse = isTranlationCollapse && this.translateOriginHeight > this.maxTranslateHeight;
  }

  toggleTranslationCollapse() {
    if (this.translateOriginHeight <= this.maxTranslateHeight) return;

    this.isTranslationCollapse = !this.isTranslationCollapse;
  }

  confirmPraise() {
    if (!this.userInfo) {
      this.operationTipsService.popup(`请登录`);
      return;
    }
    let userAnim = new UserAnimEmoji;
    userAnim.user = this.userInfo;
    this.message.praisedAnimations.push(userAnim);

    this.praisesNum += 1;
    if (this.praisesNum > 3) return;
    if (this.isLoading) return;

    if (!this.message.hadPraised) this.message.praisedAmount += 1;
    this.message.hadPraised = true;

    if (this.timer > -1) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.isLoading = true;

      let praisesNum = this.praisesNum;
      if (praisesNum > 10) praisesNum = 10;

      this.praisesNum = 0;

      this.messageApiService.praise(this.liveInfo.id, this.message.id, this.praised, praisesNum).then(() => {
        this.praised = true;
        this.timer = -1;
        this.isLoading = false;
      });
    }, 1000);
  }

  reply() {
    this.timelineService.replyMessage(this.message);
  }

  goToShare() {
    this.router.navigate([`/lives/${this.liveInfo.id}/share/${this.message.id}`]);
  }

  avatarTouched(userInfo: UserInfoModel) {
    this.timelineService.avatarTouched(userInfo);
  }

  showUserInfoCard(uid: number) {
    this.userInfoCardService.popup(uid);
  }

  resendMessage() {
    this.modalService.popup('确定重发消息吗?').then((result) => {
      if (result) this.messageApiService.resendMessage(this.liveId, this.message);
    });
  }

  get isInWechat() {
    return UtilsService.isInWechat;
  }

  get canReply(): boolean {
    if (!this.userInfo) {
      return;
    }
    return this.liveInfo.isEditor(this.userInfo.uid) && this.message.isPostSuccessful() && !this.liveInfo.isClosed();
  }
}
