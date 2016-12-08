import {
  Component, Input, ViewChild, ElementRef,
  DoCheck, OnDestroy, OnInit
} from "@angular/core";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {MessageApiService} from "../../shared/api/message/message.api";
import {EditMode} from "./editor-tool-bar.enums";
import {RecorderComponent} from "./recorder/recorder.component";
import {LiveStatus} from "../../shared/api/live/live.enums";
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {ModalService} from "../../shared/modal/modal.service";
import {Router} from "@angular/router";
import {RecordStatus} from "./recorder/recorder.enums";
import {UtilsService} from "../../shared/utils/utils";
import {FormGroup, FormBuilder, FormControl} from "@angular/forms";
import {sizeValidator, typeValidator} from "../../shared/file-selector/file-selector.validator";
import {Subscription} from "rxjs";
import {MessageService} from "../timeline/message/message.service";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {RecorderData} from "./recorder/recorder.models";
import {LiveService} from "../../shared/api/live/live.service";
import {ImageBridge} from "../../shared/bridge/image.interface";

declare var $: any;

@Component({
  selector: 'editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss'],
})

export class EditorToolBarComponent implements DoCheck, OnDestroy, OnInit {
  @Input() liveId: string;
  @Input() liveInfo: LiveInfoModel;
  @ViewChild('recorder') recorder: RecorderComponent;
  @ViewChild('messageInput') messageInput: ElementRef;
  modeEnums = EditMode;
  recordEnums = RecordStatus;
  mode = EditMode.None;
  messageContent = '';
  isMessageSubmitting = false;
  images: File[];
  form: FormGroup;
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 8;
  receviedAvatarTouchedSub: Subscription;

  constructor(private messageApiService: MessageApiService, private commentApiService: CommentApiService,
              private modalService: ModalService, private router: Router, private fb: FormBuilder,
              private messageService: MessageService, private liveService: LiveService, private imageService: ImageBridge) {
  }

  ngOnInit() {
    this.messageContent = this.liveService.getTextWordsStashed(this.liveId);

    this.form = this.fb.group({
      'images': new FormControl(this.images, [
        sizeValidator(this.maxSizeMB),
        typeValidator(this.fileTypeRegexp),
      ]),
    });

    //监听点击用户头像事件
    this.receviedAvatarTouchedSub = this.messageService.avatarTouched$.subscribe((userTouched) => {
      this.messageContent = `@${userTouched.nick}(${userTouched.uid}) `;
      if (this.mode !== EditMode.Text && this.mode !== EditMode.At) this.switchMode(EditMode.Text);
    });
  }

  switchMode(mode: EditMode) {
    if (mode !== EditMode.Text) {
      this.blurMessageInput();
      this.liveService.setTextWordsStashed(this.messageContent, this.liveId);
    }

    this.mode = mode;

    if (this.mode === EditMode.Text) {
      this.focusMessageInput();
      this.detectContentChange();
    }
  }

  detectContentChange() {
    $(this.messageInput.nativeElement).on('input', () => {
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

  get isClose() {
    let isClosed = this.liveInfo.status === LiveStatus.Ended;
    if (isClosed && this.mode === EditMode.Audio) setTimeout(()=> {
      this.mode = EditMode.None;
    }, 0);
    return isClosed;
  }

  get recordDuration() {
    if (!this.recorder || !this.recorder.recordDuration) return '';

    let duration = 60 - this.recorder.recordDuration / 10;
    if (duration < 0) duration = 0;
    return `${duration.toFixed(0)}s`;
  }

  recordEnd(recorderData: RecorderData) {
    this.messageApiService.postAudioMessage(this.liveId, recorderData.localId, recorderData.audioData, recorderData.duration);
  }

  postMessage() {
    if (this.messageContent === '' || this.isMessageSubmitting) return;

    if (!this.isClose) {
      this.messageApiService.postTextMessage(this.liveId, this.messageContent);
      this.isMessageSubmitting = false;
      this.messageContent = '';
    } else {
      this.commentApiService.postComment(this.liveId, this.messageContent).then(() => {
        this.isMessageSubmitting = false;
        this.messageContent = '';
      });
    }
  }

  focusMessageInput() {
    this.messageInput.nativeElement.focus();
  }

  blurMessageInput() {
    this.messageInput.nativeElement.blur();
  }

  messageInputFocused() {
    if (this.mode === EditMode.At) this.switchMode(EditMode.Text);
  }

  postImage() {
    if (!this.images || !this.images.length) return;

    this.messageApiService.postImageMessage(this.liveId, '', this.images[0]);
    this.images = [];
  }

  postTips() {
    this.modalService.popup('即将推出,敬请期待。', '', '知道了', false);
  }

  goSettings() {
    this.router.navigate([`/lives/${this.liveId}/settings`]);
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

  get isInWechat(): boolean {
    return UtilsService.isInWechat;
  }

  selectImages() {
    this.imageService.chooseImages().then((localIds) => {
      for (let localId of localIds) {
        this.messageApiService.postImageMessage(this.liveId, (localId as string), null);
      }
    });
  }
}
