import {Component, OnInit, DoCheck} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LiveInfoModel} from "../../../shared/api/live/live.model";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {sizeValidator, typeValidator} from "../../../shared/file-selector/file-selector.validator";
import * as moment from "moment";
import {ModalService} from "../../../shared/modal/modal.service";
import {LiveService} from "../../../shared/api/live/live.service";

@Component({
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.scss'],
})

export class EditInfoComponent implements OnInit, DoCheck {
  liveId: string;
  liveInfo: LiveInfoModel;
  form: FormGroup;
  coverFiles: File[];
  coverSrc: SafeUrl;
  originCoverSrc: SafeUrl;
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 8;
  maxTitleLength = 50;
  maxDescLength = 600;
  time = '';
  title = '';
  desc = '';

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer,
              private modalService: ModalService, private fb: FormBuilder,
              private liveService: LiveService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.parent.snapshot.params['id'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];

    if (!this.liveService.isAdmin(this.liveId)) this.router.navigate([`/lives/${this.liveId}/settings/view-info`]);

    let expectStartAt = moment(this.liveInfo.expectStartAt);
    if (expectStartAt.isValid() && expectStartAt.unix() > 0) this.time = expectStartAt.format('YYYY-MM-DDThh:mm');

    if (this.liveInfo.coverUrl) this.originCoverSrc = this.sanitizer.bypassSecurityTrustUrl(this.liveInfo.coverUrl);

    this.title = this.liveInfo.subject;
    this.desc = this.liveInfo.desc;

    let coverValidator = [
      sizeValidator(this.maxSizeMB),
      typeValidator(this.fileTypeRegexp),
    ];

    if (!this.originCoverSrc) coverValidator.unshift(Validators.required);

    this.form = this.fb.group({
      'time': new FormControl(this.time, [
        Validators.required,
        Validators.pattern('\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}'),
      ]),
      'cover': new FormControl(this.coverFiles, coverValidator),
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
    if (this.form.controls['cover'].valid && this.coverFiles) {
      if (this.coverFiles.length) {
        let file = this.coverFiles[0];
        let reader = new FileReader();

        reader.onload = (e) => {
          this.coverSrc = this.sanitizer.bypassSecurityTrustUrl(e.target['result']);
        };

        reader.readAsDataURL(file);
      } else {
        this.coverSrc = this.originCoverSrc || null;
      }
    } else {
      this.coverSrc = this.originCoverSrc || null;
    }
  }

  cancelComfirm() {
    this.modalService.popup('您的内容未保存,确定退出吗?').then((result) => {
      if (result) this.router.navigate([`/lives/${this.liveId}/settings/view-info`]);
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
    let expectStartAt = `${this.time}:00`;

    this.liveService.updateLiveInfo(this.liveId, this.title, this.desc, '', expectStartAt).then(() => {
      return this.liveService.getLiveInfo(this.liveId, true);
    }).then(() => {
      this.router.navigate([`/lives/${this.liveId}/settings/view-info`]);
    });
  }
}
