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
  coverKey: string;
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 8;
  maxTitleLength = 20;
  maxDescLength = 600;
  time = '';
  title = '';
  desc = '';
  oldFileName = '';
  submitted = false;

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer,
              private fb: FormBuilder, private liveService: LiveService, private uploadService: UploadApiService) {
  }

  ngOnInit() {

    this.liveId = this.route.parent.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];
    this.userInfo = this.route.snapshot.data['userInfo'];

    if (this.liveInfo.isStarted()) this.router.navigate([`/info-center`]);

    if (!this.liveInfo.isAdmin(this.userInfo.uid)) this.backToLive();

    let expectStartAt = moment(this.liveInfo.expectStartAt);
    if (expectStartAt.isValid() && expectStartAt.unix() > 0) this.time = expectStartAt.format('YYYY-MM-DDTHH:mm');

    if (this.liveInfo.coverSmallUrl) this.originCoverSrc = this.sanitizer.bypassSecurityTrustUrl(this.liveInfo.coverSmallUrl);

    this.title = this.liveInfo.subject;
    this.desc = this.liveInfo.desc;
    this.coverKey = this.urlPath(this.liveInfo.coverUrl);

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

    this.defaultCoverSrc = this.sanitizer.bypassSecurityTrustUrl('/assets/img/default-cover.jpg');
  }

  ngDoCheck() {
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

  backToLive() {
    this.router.navigate([`/lives/${this.liveId}`]);
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
    if (this.coverFiles && this.coverFiles.length) {
      this.liveService.getCoverUploadToken(this.liveId).then((data) => {
        return this.uploadService.uploadToQiniu(this.coverFiles[0], data.coverKey, data.token);
      }).then((imageKey) => {
        this.coverKey = imageKey;
        this.updateLiveInfo();
      });
    } else {
      this.updateLiveInfo();
    }
  }

  private urlPath(url: string): string {

    if (!url) {
      return '';
    }
    let i = url.indexOf('//');
    if (i <= 0) {
      return '';
    }

    i = url.indexOf('/', i + 2);
    if (i <= 0) {
      return '';
    }
    return url.substr(i + 1);
  }

  updateLiveInfo() {
    let expectStartAt = moment(`${this.time}:00`).local();

    this.liveService.updateLiveInfo(this.liveId, this.title, this.desc, expectStartAt.toISOString(), this.coverKey).then(() => {
      return this.liveService.getLiveInfo(this.liveId, true);
    }).then(() => {
      this.submitted = true;
      this.router.navigate([`/lives/${this.liveId}/settings/view-info`]);
    });
  }

  canDeactivate() {
    return !this.form.dirty || this.submitted;
  }
}
