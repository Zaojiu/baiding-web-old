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
  messageType = MessageType;
  isTranslationCollapse: boolean;
  tranlationCollapseSub: Subscription;
  tranlationMaxLength = 32;
  postStatus = PostMessageStatus;
  canReply: boolean;
  messageParsed: string;

  constructor(private messageService: MessageService, private messageApiService: MessageApiService,
              private router: Router, private sanitizer: DomSanitizer, private editorCardService: UserInfoCardService,
              private userInfoService: UserInfoService, private modalService: ModalService,
              private liveRoomService: LiveRoomService) {
  }

  ngOnInit() {
    // static msg content to prevent selection problem
    if (this.message.content) this.messageParsed = UtilsService.parseAt(this.message.content);

    this.canReply = this.message.user && this.message.user.uid !== this.userInfo.uid &&
      this.liveInfo.isEditor(this.userInfo.uid) &&
      this.message.postStatus === PostMessageStatus.PostSuccessful && !this.liveInfo.isClosed();

    let tranlationCollapse = this.liveRoomService.isTranslationCollapse(this.liveId);
    this.judgeTranlastionLength(tranlationCollapse, this.tranlationMaxLength);

    this.tranlationCollapseSub = this.liveRoomService.$tranlationCollapse.subscribe((result) => {
      this.judgeTranlastionLength(result, this.tranlationMaxLength);
    });
  }

  ngOnDestroy() {
    this.tranlationCollapseSub.unsubscribe();
  }

  judgeTranlastionLength(tranlationCollapse: boolean, tranlationLength: number) {
    if (this.message && this.message.audio && this.message.audio.translateResult && this.message.audio.translateResult.length >= tranlationLength) {
      this.isTranslationCollapse = tranlationCollapse;
    } else {
      this.isTranslationCollapse = false;
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

  goToShare() {
    this.router.navigate([`/lives/${this.liveInfo.id}/share/${this.message.id}`]);
  }

  playAudio() {
    this.audioPlayer.play();
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

  toggleTranslatioExpanded(msg) {
    if (msg.length <= this.tranlationMaxLength) return;

    this.isTranslationCollapse = !this.isTranslationCollapse;
  }

  getUserPublicInfoAndPopUpCard(uid: number) {
    this.userInfoService.getUserPublicInfo(uid).then((publicInfo) => {
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
