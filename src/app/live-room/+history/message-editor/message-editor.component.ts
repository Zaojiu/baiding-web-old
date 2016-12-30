import {Component, DoCheck, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {MessageModel} from "../../../shared/api/message/message.model";
import {FormGroup, FormBuilder, FormControl} from "@angular/forms";
import {sizeValidator, typeValidator} from "../../../shared/file-selector/file-selector.validator";
import {UtilsService} from "../../../shared/utils/utils";
import {ImageBridge} from "../../../shared/bridge/image.interface";
import {ModalService} from "../../../shared/modal/modal.service";
import {SafeUrl, DomSanitizer} from "@angular/platform-browser";
import {MessageApiService} from "../../../shared/api/message/message.api";
import {HistoryService} from "../history.service";
import {UploadApiService} from "../../../shared/api/upload/upload.api";

@Component({
  selector: 'message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.scss'],
})

export class MessageEditorComponent implements OnInit, DoCheck {
  liveId: string;
  message: MessageModel;
  images: File[];
  imageSrc: SafeUrl | string;
  wxLocalId: string;
  form: FormGroup;
  oldFileName = '';
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 8;
  submitted = false;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private imageService: ImageBridge, private modalService: ModalService,
              private sanitizer: DomSanitizer, private messageApiService: MessageApiService,
              private historyService: HistoryService, private uploadService: UploadApiService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];
    let messageId = this.route.snapshot.params['messageId'];
    this.message = this.route.snapshot.data['messages'].filter(msg => msg.id === messageId)[0];

    this.form = this.fb.group({
      'images': new FormControl(this.images, [
        sizeValidator(this.maxSizeMB),
        typeValidator(this.fileTypeRegexp),
      ]),
      'content': new FormControl(this.message.content, []),
    });

    if (this.message.isImage()) this.imageSrc = this.message.image.smallLink;
    console.log(this.message);
  }

  ngDoCheck() {
    if (!this.isInWechat && this.message.isImage()) {
      if (this.form.controls['images'].errors && this.form.controls['images'].errors['size']) {
        this.images = [];
        this.modalService.popup('图片不能大于8M', '', '确定', false);
      }

      if (this.form.controls['images'].errors && this.form.controls['images'].errors['accept']) {
        this.images = [];
        this.modalService.popup('图片类型必须符合jpg、png、gif、bmp', '', '确定', false);
      }

      if (this.form.controls['images'].valid && this.images) {
        if (this.images.length) {
          let file = this.images[0];

          if (this.oldFileName === file.name) return;

          let reader = new FileReader();

          reader.onload = (e) => {
            this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(e.target['result']);
            this.oldFileName = file.name;
          };

          reader.readAsDataURL(file);
        } else {
          this.imageSrc = this.message.image.smallLink;
        }
      } else {
        this.imageSrc = this.message.image.smallLink;
      }
    }
  }

  selectImages() {
    this.imageService.chooseImages(1).then((localIds) => {
      this.wxLocalId = localIds[0] as string;
      this.imageSrc = this.sanitizer.bypassSecurityTrustUrl(localIds[0] as string);
    });
  }

  delete() {
    this.modalService.popup('确定删除发言吗?').then(result => {
      if (result) {
        this.messageApiService.deleteHistoryMessage(this.liveId, this.message.id).then(() => {
          this.historyService.refresh();
          this.router.navigate([`/lives/${this.liveId}/history`]);
        });
      }
    });
  }

  save() {
    let promise = null;

    if (!this.isInWechat && this.images && this.images.length) {
      promise = this.messageApiService.getHistoryMessageUpToken(this.liveId, this.message.id).then((token) => {
        return this.uploadService.uploadToQiniu(this.images[0], token.key, token.token);
      }).then((imageKey) => {
        return this.messageApiService.editHistoryMessage(this.liveId, this.message.id, this.message.content, '', imageKey);
      });
    } else if (this.isInWechat && this.wxLocalId) {
      promise = this.imageService.uploadImage(this.wxLocalId).then((serverId) => {
        return this.messageApiService.editHistoryMessage(this.liveId, this.message.id, this.message.content, serverId);
      });
    } else {
      promise = this.messageApiService.editHistoryMessage(this.liveId, this.message.id, this.message.content);
    }

    promise.then(() => {
      this.submitted = true;
      this.historyService.refresh();
      this.router.navigate([`/lives/${this.liveId}/history`]);
    });
  }

  get isInWechat(): boolean {
    return UtilsService.isInWechat;
  }

  back() {
    this.router.navigate([`/lives/${this.route.parent.snapshot.params['id']}/history`]);
  }

  canDeactivate() {
    return !this.form.dirty || this.submitted;
  }
}
