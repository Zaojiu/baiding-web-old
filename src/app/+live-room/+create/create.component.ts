import {Component, OnInit, DoCheck} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {LiveService} from "../../shared/api/live/live.service";
import {UploadApiService} from "../../shared/api/upload/upload.api";
import {sizeValidator, typeValidator} from "../../shared/file-selector/file-selector.validator";
import {futureValidator} from "../../shared/form/future.validator";
import {UtilsService} from "../../shared/utils/utils";
import {ImageBridge} from "../../shared/bridge/image.interface";
import {host} from "../../../environments/environment";

@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})

export class CreateComponent implements OnInit, DoCheck {
  form: FormGroup;
  coverFiles: File[];
  coverSrc: SafeUrl | string;
  wxLocalId: string;
  defaultCoverSrc: SafeUrl;
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 8;
  maxTitleLength = 20;
  maxDescLength = 600;
  type = 'text';
  time = '';
  title = '';
  desc = '';
  oldFileName = '';
  submitted = false;
  isSubmitting = false;
  isInApp = UtilsService.isInApp;
  isInBaidingApp = UtilsService.isInBaidingApp;
  isInWechat = UtilsService.isInWechat;

  constructor(private router: Router, private sanitizer: DomSanitizer, private fb: FormBuilder,
              private liveService: LiveService, private uploadService: UploadApiService,
              private imageBridge: ImageBridge) {
  }

  ngOnInit() {
    this.defaultCoverSrc = this.sanitizer.bypassSecurityTrustUrl(`${host.assets}/assets/img/default-cover.jpg`);
    this.coverSrc = this.defaultCoverSrc;
    this.time = moment().add(moment.duration(1, 'h')).format('YYYY-MM-DDTHH:mm');

    this.form = this.fb.group({
      'type': new FormControl(this.type, [
        Validators.required,
      ]),
      'time': new FormControl(this.time, [
        Validators.required,
        Validators.pattern('\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}'),
        futureValidator(),
      ]),
      'cover': new FormControl(this.coverFiles, [
        sizeValidator(this.maxSizeMB),
        typeValidator(this.fileTypeRegexp),
      ]),
      'title': new FormControl(this.title, [
        Validators.required,
        Validators.maxLength(this.maxTitleLength)
      ]),
      'desc': new FormControl(this.desc, [
        Validators.required,
        Validators.maxLength(this.maxDescLength)
      ]),
    });
  }

  ngDoCheck() {
    if (!this.isInWechat) {
      if (this.form.controls['cover'].valid && this.coverFiles) {
        if (this.coverFiles.length) {
          let file = this.coverFiles[0];

          if (this.oldFileName === file.name) return;

          let reader = new FileReader();

          reader.onload = (e) => {
            this.coverSrc = this.sanitizer.bypassSecurityTrustUrl(e.target['result']);
            this.oldFileName = file.name;
          };

          reader.readAsDataURL(file);
        } else {
          this.coverSrc = this.defaultCoverSrc;
        }
      } else {
        this.coverSrc = this.defaultCoverSrc;
      }
    }
  }

  selectImages() {
    this.imageBridge.chooseImages(1).then((localIds) => {
      this.wxLocalId = localIds[0] as string;
      this.coverSrc = this.sanitizer.bypassSecurityTrustUrl(localIds[0] as string);
    });
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });

    if (this.form.invalid) return;

    this.postLiveInfo();
  }

  postLiveInfo() {
    let expectStartAt = moment(`${this.time}:00`).local();

    this.isSubmitting = true;

    this.liveService.createLive(this.title, '', this.desc, expectStartAt.toISOString(), this.type).then(liveId => {
      if (this.wxLocalId || (this.coverFiles && this.coverFiles.length)) {
        return this.updateCover(liveId);
      } else {
        return Promise.resolve(liveId);
      }
    }).then((liveId) => {
      this.submitted = true;
      this.gotoLiveInfo(liveId);
    }).finally(() => {
      this.isSubmitting = false;
    });
  }

  gotoLiveInfo(liveId) {
    this.router.navigate([`/lives/${liveId}/info`]);
  }

  updateCover(liveId: string): Promise<string> {
    let promise = null;
    let expectStartAt = moment(`${this.time}:00`).local();

    if (this.wxLocalId) {
      promise = this.imageBridge.uploadImage(this.wxLocalId).then(serverId => {
        return this.liveService.updateLiveInfo(liveId, this.title, this.desc, expectStartAt.toISOString(), '', serverId);
      });
    } else {
      promise = this.liveService.getCoverUploadToken(liveId).then(data => {
        return this.uploadService.uploadToQiniu(this.coverFiles[0], data.coverKey, data.token);
      }).then(imageKey => {
        return this.liveService.updateLiveInfo(liveId, this.title, this.desc, expectStartAt.toISOString(), imageKey);
      });
    }

    return promise.then(() => {
      return liveId;
    });
  }

  canDeactivate() {
    return !this.form.dirty || this.submitted;
  }
}
