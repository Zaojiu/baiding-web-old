import {
  Component, Input, ViewChild, ElementRef, AfterViewInit,
  DoCheck
} from "@angular/core";
import * as autosize from "autosize";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {WechatAudioModel} from "../../shared/wechat/wechat.model";
import {MessageApiService} from "../../shared/api/message/message.api";
import {EditMode} from "./editor-tool-bar.enums";
import {RecorderComponent} from "./recorder/recorder.component";
import {LiveStatus} from "../../shared/api/live/live.enums";
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {ModalService} from "../../shared/modal/modal.service";
import {Router} from "@angular/router";
import {RecordStatus} from "./recorder/recorder.enums";

declare var $: any;

@Component({
  selector: 'editor-tool-bar',
  templateUrl: './editor-tool-bar.component.html',
  styleUrls: ['./editor-tool-bar.component.scss'],
})

export class EditorToolBarComponent implements AfterViewInit, DoCheck {
  @Input() liveId: string;
  @Input() liveInfo: LiveInfoModel;
  @ViewChild('recorder') recorder: RecorderComponent;
  @ViewChild('messageInput') messageInput: ElementRef;
  @ViewChild('messageContainer') messageContainer: ElementRef;
  modeEnums = EditMode;
  recordEnums = RecordStatus;
  mode = EditMode.None;
  messageContent = '';
  isMessageSubmitting = false;
  images: File[];

  constructor(private messageApiService: MessageApiService, private commentApiService: CommentApiService,
              private modalService: ModalService, private router: Router) {
  }

  ngAfterViewInit() {
    autosize(this.messageInput.nativeElement);
  }

  ngDoCheck() {
    if (this.images && this.images.length) this.postImage();
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

  switchMode(mode: EditMode) {
    if (mode !== EditMode.Text) this.blurMessageInput();

    this.mode = this.mode !== mode ? mode : EditMode.None;

    if (this.mode === EditMode.Text) this.focusMessageInput();
  }

  recordEnd(audioModel: WechatAudioModel) {
    this.messageApiService.postAudioMessage(this.liveId, audioModel.localId, audioModel.serverId, audioModel.translateResult, '', audioModel.duration);
  }

  postMessage() {
    if (this.messageContent === '' || this.isMessageSubmitting) return;

    this.isMessageSubmitting = true;

    if (!this.isClose) {
      return this.messageApiService.postTextMessage(this.liveId, this.messageContent).then(() => {
        this.isMessageSubmitting = false;
        this.messageContent = '';
        setTimeout(() => {
          this.resizeMessageInput()
        }, 0);
      });
    } else {
      return this.commentApiService.postComment(this.liveId, this.messageContent).then(() => {
        this.isMessageSubmitting = false;
        this.messageContent = '';
        setTimeout(() => {
          this.resizeMessageInput()
        }, 0);
      });
    }
  }

  resizeMessageInput() {
    const evt = new Event('autosize:update');
    this.messageInput.nativeElement.dispatchEvent(evt);
  }

  focusMessageInput() {
    this.messageInput.nativeElement.focus();
  }

  blurMessageInput() {
    $(this.messageInput.nativeElement).trigger('blur');
  }

  postImage() {
    if (!this.images || !this.images.length || this.isMessageSubmitting) return;

    this.isMessageSubmitting = true;

    this.messageApiService.postImgMessage(this.liveId, this.images[0]).then(() => {
      this.isMessageSubmitting = false;
      this.images = [];
    });
  }

  postTips() {
    this.modalService.popup('即将推出,敬请期待。', '', '知道了', false);
  }

  goSettings() {
    this.router.navigate([`/lives/${this.liveId}/settings`]);
  }
}
