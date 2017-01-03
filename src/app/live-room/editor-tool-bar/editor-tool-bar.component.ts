import {
  Component, Input, ViewChild, ElementRef,
  DoCheck, OnDestroy, OnInit
} from "@angular/core";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {MessageApiService} from "../../shared/api/message/message.api";
import {EditMode} from "./editor-tool-bar.enums";
import {RecorderComponent} from "./recorder/recorder.component";
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {ModalService} from "../../shared/modal/modal.service";
import {Router} from "@angular/router";
import {RecordStatus} from "./recorder/recorder.enums";
import {UtilsService} from "../../shared/utils/utils";
import {FormGroup, FormBuilder, FormControl} from "@angular/forms";
import {sizeValidator, typeValidator} from "../../shared/file-selector/file-selector.validator";
import {Subscription} from "rxjs";
import {MessageService} from "../timeline/message/message.service";
import {InputtingService} from "../timeline/message/inputting.service";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {RecorderData} from "./recorder/recorder.models";
import {ImageBridge} from "../../shared/bridge/image.interface";
import {LiveRoomService} from "../live-room.service";
import {LiveService} from "../../shared/api/live/live.service";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {InviteApiService} from "../../shared/api/invite/invite.api";

declare var $: any;

@Component({
  selector: 'editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss'],
})

export class EditorToolBarComponent implements DoCheck, OnDestroy, OnInit {
  @Input() liveId: string;
  @Input() liveInfo: LiveInfoModel;
  @Input() userInfo: UserInfoModel;
  @ViewChild('recorder') recorder: RecorderComponent;
  @ViewChild('messageInput') messageInput: ElementRef;
  modeEnums = EditMode;
  recordEnums = RecordStatus;
  mode = EditMode.Audio;
  messageContent = '';
  isMessageSubmitting = false;
  images: File[];
  form: FormGroup;
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 8;
  receviedAvatarTouchedSub: Subscription;
  touchStartY: number;
  timer: any;

  constructor(private messageApiService: MessageApiService, private commentApiService: CommentApiService,
              private modalService: ModalService, private router: Router, private fb: FormBuilder,
              private messageService: MessageService, private imageService: ImageBridge,
              private liveRoomService: LiveRoomService, private liveService: LiveService,
              private operationTips: OperationTipsService, private inputtingService: InputtingService) {
  }

  ngOnInit() {
    this.messageContent = this.liveRoomService.getTextWordsStashed(this.liveId);

    this.form = this.fb.group({
      'images': new FormControl(this.images, [
        sizeValidator(this.maxSizeMB),
        typeValidator(this.fileTypeRegexp),
      ]),
    });

    // 监听点击用户头像事件
    this.receviedAvatarTouchedSub = this.messageService.avatarTouched$.subscribe((userTouched) => {
      this.messageContent = `@${userTouched.nick}(${userTouched.uid}) `;
      if (this.mode !== EditMode.Text && this.mode !== EditMode.At) this.switchMode(EditMode.Text);
    });
  }

  switchMode(mode: EditMode) {
    if (mode !== EditMode.Text) {
      this.blurMessageInput();
    }

    this.mode = mode;

    if (this.mode === EditMode.Text) {
      this.focusMessageInput();
      this.detectContentChange();
    }
  }

  detectContentChange() {
    $(this.messageInput.nativeElement).on('input', () => {
      this.liveRoomService.setTextWordsStashed(this.messageContent, this.liveId);

      if (this.messageContent === '') return;

      if ($.isNumeric(this.messageContent[this.messageContent.length - 1])) {
        this.messageContent = this.messageContent.replace(/(.*)@[\W\w]+?\(\d+?$/g, '$1');
      }

      if (this.messageContent[this.messageContent.length - 1] === '@') {
        this.switchMode(EditMode.Text);
      }
    });
  }

  ngDoCheck() {
    if (this.form.controls['images'].valid && this.images && this.images.length) {
      this.postImage();
    }

    if (this.form.controls['images'].errors && this.form.controls['images'].errors['size']) {
      this.images = [];
      this.modalService.popup('图片不能大于8M', '', '确定', false);
    }

    if (this.form.controls['images'].errors && this.form.controls['images'].errors['accept']) {
      this.images = [];
      this.modalService.popup('图片类型必须符合jpg、png、gif、bmp', '', '确定', false);
    }
  }

  ngOnDestroy() {
    this.receviedAvatarTouchedSub.unsubscribe();
  }

  startRecord(e: Event) {
    if ((e instanceof MouseEvent) && UtilsService.isTouchable) return;

    if (this.mode === EditMode.Audio && !this.liveInfo.isClosed()) {
      if (this.recorder.status === RecordStatus.Waitting) this.recorder.startRecord();
    } else {
      this.switchMode(EditMode.Audio);
    }

    if (e instanceof TouchEvent) this.touchStartY = e.targetTouches[0].clientY;
  }

  stopRecord(e: Event) {
    if ((e instanceof MouseEvent) && UtilsService.isTouchable) return;

    if (this.mode === EditMode.Audio) {
      this.recorder.stopRecord();
    }
  }

  panupCancel(e) {
    if (this.touchStartY - e.targetTouches[0].clientY > 50) {
      if (this.recorder.status === RecordStatus.Recording) this.recorder.status = RecordStatus.ReadyToCancel;
    } else {
      if (this.recorder.status === RecordStatus.ReadyToCancel) this.recorder.status = RecordStatus.Recording;
    }
  }

  onrecording() {
    this.inputtingService.collect({liveId: this.liveId, type: 'audio'});
  }

  recordEnd(recorderData: RecorderData) {

    let promise = this.messageApiService.postAudioMessage(this.liveId, recorderData.localId, recorderData.audioData, recorderData.duration);
    if (promise) {
      this.timer = setInterval(() => {
        this.inputtingService.collect({liveId: this.liveId, type: 'audio'});
      }, 1000);

      promise.finally(() => {
        if (this.timer) clearInterval(this.timer);
      });
    }
  }

  postMessage() {
    if (this.messageContent === '' || this.isMessageSubmitting) return;

    if (!this.liveInfo.isClosed()) {
      this.messageApiService.postTextMessage(this.liveId, this.messageContent);
      this.isMessageSubmitting = false;
      this.messageContent = '';
      this.liveRoomService.setTextWordsStashed('', this.liveId);
    } else {
      this.commentApiService.postComment(this.liveId, this.messageContent).then(() => {
        this.isMessageSubmitting = false;
        this.messageContent = '';
        this.liveRoomService.setTextWordsStashed('', this.liveId);
      });
    }
  }

  focusMessageInput() {
    this.messageInput.nativeElement.focus();
  }

  blurMessageInput() {
    this.messageInput.nativeElement.blur();
  }

  resetKeyboard() {
    if (this.mode === EditMode.At) this.switchMode(EditMode.Text);
  }

  messageInputChanged() {
    this.inputtingService.collect({liveId: this.liveId, type: 'text'});
  }

  postImage() {
    if (!this.images || !this.images.length) return;

    let promises = [];

    for (let image of this.images) {
      promises.push(this.messageApiService.postImageMessage(this.liveId, '', image));
    }

    if (promises.length) {
      this.timer = setInterval(() => {
        this.inputtingService.collect({liveId: this.liveId, type: 'image'});
      }, 1000);

      Promise.all(promises).finally(() => {
        if (this.timer) clearInterval(this.timer);
      });
    }

    this.images = [];
  }

  changeCommentContent(editor: UserInfoModel) {
    if (this.messageContent.indexOf(editor.uid.toString()) !== -1) {
      this.messageContent = this.messageContent.replace(`@${editor.nick}(${editor.uid}) `, '');
    } else {
      if (this.messageContent === '') {
        this.messageContent += `@${editor.nick}(${editor.uid}) `;
      } else if (this.messageContent[this.messageContent.length - 1] === '@') {
        this.messageContent += `${editor.nick}(${editor.uid}) `;
      } else {
        this.messageContent += `@${editor.nick}(${editor.uid}) `;
      }
    }
  }

  selected(uid: number): boolean {
    return this.messageContent.indexOf(uid.toString()) !== -1;
  }

  selectImages() {
    this.imageService.chooseImages().then((localIds) => {
      for (let localId of localIds) {
        this.messageApiService.postImageMessage(this.liveId, (localId as string), null);
      }
    });
  }

  gotoInvitationInfo() {
    this.router.navigate([`/lives/${this.liveId}/vip-info`]);
  }

  closeLive() {
    this.modalService.popup('确定结束话题吗?', '取消', '确定').then((result) => {
      if (!result) return;
      this.liveService.closeLive(this.liveId).then(liveInfo => {
        this.liveInfo = liveInfo;
        this.operationTips.popup('话题已结束');
      });
    });
  }

  gotoRoomInfo() {
    this.router.navigate([`/lives/${this.liveId}/info`]);
  }

  gotoEditInfo() {
    this.router.navigate([`/lives/${this.liveId}/settings/edit-info`]);
  }

  get isAudioAutoPlay() {
    return this.liveRoomService.isAudioAutoPlay(this.liveId);
  }

  set isAudioAutoPlay(result: boolean) {
    this.liveRoomService.toggleAudioAutoPlay(this.liveId);
  }

  get isTranslationCollapse(): boolean {
    return this.liveRoomService.isTranslationCollapse(this.liveId);
  }

  set isTranslationCollapse(result: boolean) {
    this.liveRoomService.toggleTranslationCollapse(this.liveId);
  }

  get isInWechat(): boolean {
    return UtilsService.isInWechat;
  }
}
