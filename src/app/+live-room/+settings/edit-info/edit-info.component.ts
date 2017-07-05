import {Component, OnInit, DoCheck} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

import {LiveInfoModel} from "../../../shared/api/live/live.model";
import {sizeValidator, typeValidator} from "../../../shared/file-selector/file-selector.validator";
import {LiveService} from "../../../shared/api/live/live.service";
import {futureValidator} from "../../../shared/form/future.validator";
import {UploadApiService} from "../../../shared/api/upload/upload.api";
import {UserInfoModel} from "../../../shared/api/user-info/user-info.model";
import {UtilsService} from "../../../shared/utils/utils";
import {UserInfoService} from "../../../shared/api/user-info/user-info.service";
import {ImageBridge} from "../../../shared/bridge/image.interface";
import {OperationTipsService} from "../../../shared/operation-tips/operation-tips.service";

@Component({
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.scss'],
})

export class EditInfoComponent implements OnInit, DoCheck {
  liveId: string;
  liveInfo: LiveInfoModel;
  userInfo: UserInfoModel;
  form: FormGroup;
  coverFiles: File[];
  coverSrc: SafeUrl;
  originCoverSrc: SafeUrl;
  defaultCoverSrc: SafeUrl;
  wxLocalId: string;
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 8;
  maxTitleLength = 20;
  maxDescLength = 600;
  time = '';
  title = '';
  desc = '';
  oldFileName = '';
  isSubmitting = false;
  submitted = false;
  isInApp = UtilsService.isInApp;
  from: string;
  isInWechat = UtilsService.isInWechat;

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer,
              private fb: FormBuilder, private liveService: LiveService, private uploadService: UploadApiService,
              private userInfoService: UserInfoService, private imageBridge: ImageBridge,
              private tipsService: OperationTipsService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.userInfoService.getUserInfoCache();

    if (this.liveInfo.isStarted()) this.router.navigate([`/info-center/${this.userInfo.uid}`]);

    if (!this.liveInfo.isAdmin(this.userInfo.uid)) this.back();

    this.from = this.route.snapshot.params['from'] ? this.route.snapshot.params['from'] : '';

    let expectStartAt = moment(this.liveInfo.expectStartAt);
    if (expectStartAt.isValid() && expectStartAt.unix() > 0) this.time = expectStartAt.format('YYYY-MM-DDTHH:mm');

    if (this.liveInfo.coverSmallUrl) this.originCoverSrc = this.sanitizer.bypassSecurityTrustUrl(this.liveInfo.coverSmallUrl);
    this.defaultCoverSrc = this.sanitizer.bypassSecurityTrustUrl('/assets/img/default-cover.jpg');
    this.coverSrc = this.originCoverSrc || this.defaultCoverSrc;
    this.title = this.liveInfo.subject;
    this.desc = this.liveInfo.desc;

    this.form = this.fb.group({
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

    if (this.liveInfo.isCreated()) {
      this.form.addControl('time', new FormControl(this.time, [
        Validators.required,
        Validators.pattern('\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}'),
        futureValidator(),
      ]));
    }

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
          this.coverSrc = this.originCoverSrc || this.defaultCoverSrc;
        }
      } else {
        this.coverSrc = this.originCoverSrc || this.defaultCoverSrc;
      }
    }
  }

  back() {
    if (this.from) {
      this.router.navigateByUrl(this.from);
    } else if (this.liveId) {
      this.router.navigate([`/lives/${this.liveId}`]);
    } else {
      const userInfo = this.userInfoService.getUserInfoCache();
      if (userInfo) this.router.navigate([`/info-center/${userInfo.uid}`]);
    }
  }

  submit() {
    const isTimeUpdate = this.form.controls['time'].dirty;

    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });

    if (this.form.invalid) return;

    this.postLiveInfo().then(() => {
      if (isTimeUpdate) this.tipsService.popup('推流地址已变更，请重新获取');
    });
  }

  selectImages() {
    this.imageBridge.chooseImages(1).then((localIds) => {
      this.wxLocalId = localIds[0] as string;
      this.coverSrc = this.sanitizer.bypassSecurityTrustUrl(localIds[0] as string);
    });
  }

  postLiveInfo(): Promise<void> {
    this.isSubmitting = true;

    if (this.coverFiles && this.coverFiles.length) {
      return this.liveService.getCoverUploadToken(this.liveId).then((data) => {
        return this.uploadService.uploadToQiniu(this.coverFiles[0], data.coverKey, data.token);
      }).then((imageKey) => {
        return this.updateLiveInfo(imageKey);
      });
    } else if (this.wxLocalId) {
      return this.imageBridge.uploadImage(this.wxLocalId).then(serverId => {
        return this.updateLiveInfo('', serverId);
      });
    } else {
      let pathname = UtilsService.parseUrl(this.liveInfo.coverUrl).pathname;
      let coverKey = pathname.substr(1, pathname.length - 1);

      return this.updateLiveInfo(coverKey);
    }
  }

  updateLiveInfo(coverKey: string, wxServerId = ''): Promise<void> {
    let expectStartAt = moment(`${this.time}:00`).local();

    return new Promise((resolve, reject) => {
      this.liveService.updateLiveInfo(this.liveId, this.title, this.desc, expectStartAt.toISOString(), coverKey, wxServerId).then(() => {
        setTimeout(() => { // prevent delay while cdn syncing source image
          this.submitted = true;
          this.router.navigate([`lives/${this.liveId}/info`]);
          resolve();
        }, coverKey || wxServerId ? 2000 : 0);
      }, (err) => {
        console.error(err);
        reject(err);
      }).finally(() => {
        setTimeout(() => this.isSubmitting = false, coverKey || wxServerId ? 2000 : 0);
      });
    });
  }

  canDeactivate() {
    return !this.form.dirty || this.submitted;
  }
}
