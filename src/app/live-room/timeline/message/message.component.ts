import {Component, Input, Output, EventEmitter, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import {MessageModel, ReplyMessageModel} from '../../../shared/api/message/message.model';
import {MessageType, PostMessageStatus} from '../../../shared/api/message/message.enum';
import {UserInfoModel} from '../../../shared/api/user-info/user-info.model';
import {LiveService} from '../../../shared/api/live/live.service';
import {LiveInfoModel} from '../../../shared/api/live/live.model';
import {MessageService} from './message.service';
import {UserAnimEmoji} from '../../../shared/praised-animation/praised-animation.model';
import {AudioPlayerComponent} from '../../../shared/audio-player/audio-player.component'
import {ToolTipsModel} from "../../../shared/tooltips/tooltips.model";
import {LiveStatus} from "../../../shared/api/live/live.enums";
import {SafeHtml, DomSanitizer} from "@angular/platform-browser";
import {UtilsService} from "../../../shared/utils/utils";
import {Subscription} from "rxjs";
import {UserInfoCardService} from "../../user-info-card/user-info-card.service";
import {UserInfoService} from "../../../shared/api/user-info/user-info.service";
import {TextPopupService} from "../../../shared/text-popup/text-popup.service";
import {ModalService} from "../../../shared/modal/modal.service";
import {MessageApiService} from "../../../shared/api/message/message.api";
import {LiveRoomService} from "../../live-room.service";

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})

export class MessageComponent implements OnInit, OnDestroy {
  @Input() liveId: string;
  @Input() message: MessageModel;
  @Input() userInfo: UserInfoModel;
  @Input() liveInfo: LiveInfoModel;

  @Output() audioPlayEnded = new EventEmitter();
  @ViewChild('audioPlayer') audioPlayer: AudioPlayerComponent;

  isLoading: boolean;
  praisesNum: number = 0;
  timer: any = -1;
  praised: boolean;
  isToolTipOpened: boolean;
  messageType = MessageType;
  countdownTimer: any;
  isTranslationExpanded: boolean;
  tranlationExpandedSub: Subscription;
  tranlationMaxLength = 32;
  postStatus = PostMessageStatus;
  toolTips: ToolTipsModel[];

  constructor(private messageService: MessageService, private messageApiService: MessageApiService,
              private router: Router, private liveService: LiveService,
              private sanitizer: DomSanitizer, private editorCardService: UserInfoCardService,
              private userInfoService: UserInfoService, private textPopupService: TextPopupService,
              private modalService: ModalService, private liveRoomService: LiveRoomService) {
  }

  ngOnInit() {
    if (this.message.type === MessageType.LiveRoomInfo) {
      if (!this.liveInfo.isStarted()) {
        this.countdownTimer = setInterval(() => {
          this.liveInfo.expectStartAt = this.liveInfo.expectStartAt.indexOf('.00') === -1 ? `${this.liveInfo.expectStartAt}.00` : this.liveInfo.expectStartAt.replace('.00', '');
        }, 60000);
      }
    }

    let tranlationExpand = !this.liveRoomService.isTranslationExpanded(this.liveId);
    this.judgeTranlastionLength(tranlationExpand, this.tranlationMaxLength);

    this.tranlationExpandedSub = this.liveRoomService.$tranlationExpanded.subscribe((result) => {
      this.judgeTranlastionLength(result, this.tranlationMaxLength);
    });
  }

  ngOnDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    this.tranlationExpandedSub.unsubscribe();
  }

  judgeTranlastionLength(tranlationExpand: boolean, tranlationLength: number) {
    if (this.message && this.message.audio && this.message.audio.translateResult && this.message.audio.translateResult.length <= tranlationLength) {
      this.isTranslationExpanded = false;
    } else {
      this.isTranslationExpanded = tranlationExpand;
    }
  }

  audioPlayEndedHandler(msg: MessageModel) {
    this.audioPlayEnded.emit(msg);
  }

  confirmPraise() {

    let userAnim = new UserAnimEmoji;
    userAnim.user = this.userInfo;
    this.message.praisedAnimations.push(userAnim);

    this.praisesNum += 1;
    if (this.praisesNum > 3) {
      return;
    }

    if (!this.message.hadPraised) {
      this.message.praisedAmount += 1;
    }
    this.message.hadPraised = true;

    if (this.isLoading) {
      return;
    }

    if (this.timer > -1) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.isLoading = true;
      let praisesNum = this.praisesNum;
      if (praisesNum > 10) {
        praisesNum = 10;
      }
      this.praisesNum = 0;
      this.messageService.confirmPraise(this.liveInfo.id, this.message.id, this.praised, praisesNum).then(() => {
        this.praised = true;
        this.timer = -1;
        this.isLoading = false;
      });
    }, 1000);
  }

  setPraise() {
    this.confirmPraise();
  }

  gotoReply() {
    this.router.navigate([`/lives/${this.liveInfo.id}/post`, {'message_id': this.message.id}]);
  }

  canReply(): boolean {
    // 发送成功才能回复(特殊情况,例如推送,信息uid不是推送人), 不然id是前端随机id, 会有问题。
    return this.message.user.uid !== this.userInfo.uid && !this.liveInfo.isAudience(this.userInfo.uid) &&
      this.message.postStatus === PostMessageStatus.PostSuccessful;
  }

  goToShare() {
    this.router.navigate([`/lives/${this.liveInfo.id}/share/${this.message.id}`]);
  }

  playAudio() {
    this.audioPlayer.play();
  }

  isClosed(): boolean {
    return this.liveInfo.status == LiveStatus.Ended;
  }

  resetToolTipsItems(): ToolTipsModel[] {

    let items = [];
    let t = this.message.type;

    if (this.canReply()) {
      let enable = !this.isClosed();
      let reply = new ToolTipsModel('reply', '<i class="bi bi-chat3"></i><span>回复</span>', enable);
      items.push(reply);
    }

    if (t === MessageType.Audio || t === MessageType.Text || t === MessageType.Nice) {
      let autoPlay = new ToolTipsModel('text-popup', `<span>复制</span>`, true);
      items.push(autoPlay);
    }

    return items;
  }

  openToolTips() {
    this.toolTips = this.resetToolTipsItems();
    if (this.toolTips.length === 0) return;

    this.isToolTipOpened = true;
  }

  closeToolTips() {
    this.isToolTipOpened = false;
  }

  tooptipsSelected(item: ToolTipsModel) {
    if (item.id === 'reply') {
      this.closeToolTips();
      return this.gotoReply();
    } else if (item.id === 'audio-auto-play') {
      this._toggleAudioAutoPlay();
    } else if (item.id === 'translation-expand') {
      this._toggleTranslationExpand();
    } else if (item.id === 'text-popup') {
      let text: string;
      if (this.message.type === MessageType.Text) {
        text = this.message.content;
      } else if (this.message.type === MessageType.Audio) {
        text = this.message.audio.translateResult;
      } else if (this.message.type === MessageType.Nice) {
        text = this.message.content;
      }
      if (text) {
        this.textPopupService.popup(text);
      }
    }

    this.toolTips = this.resetToolTipsItems();
  }

  private _toggleAudioAutoPlay() {
    this.liveRoomService.toggleAudioAutoPlay(this.liveId);
  }

  private _toggleTranslationExpand() {
    this.liveRoomService.toggleTranslationExpanded(this.liveId);
  }

  emitAvatarClick(userInfo: UserInfoModel) {
    if (this.liveInfo.isEditor(userInfo.uid)) {
      this.messageService.emitAvatarUser(userInfo);
    }
  }

  gotoInfoCenter(userInfo: UserInfoModel) {
    this.router.navigate([`/info-center/${userInfo.uid}`]);
  }

  parseContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(UtilsService.parseAt(content));
  }

  gotoHistory() {
    this.router.navigate([`/lives/${this.liveId}/history`]);
  }

  toggleTranslatioExpanded(msg) {
    if (msg.length <= this.tranlationMaxLength) return;
    this.isTranslationExpanded = !this.isTranslationExpanded;
  }

  getUserPublicInfoAndPopUpCard(uid: number) {
    this.userInfoService.getUserPublicInfo(uid).then((publicInfo)=> {
      this.editorCardService.popup(publicInfo);
    });
  }

  resendMessage(message: MessageModel|ReplyMessageModel) {
    this.modalService.popup('确定重发消息吗?').then((result) => {
      if (result) this.messageApiService.resendMessage(this.liveId, this.message);
    });
  }

  get isInWechat() {
    return UtilsService.isInWechat;
  }
}
