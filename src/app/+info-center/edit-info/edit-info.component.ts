import {Component, OnInit, DoCheck} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

import {LiveInfoModel} from "../../shared/api/live/live.model";
import {sizeValidator, typeValidator} from "../../shared/file-selector/file-selector.validator";
import {LiveService} from "../../shared/api/live/live.service";
import {futureValidator} from "../../shared/form/future.validator";
import {UploadApiService} from "../../shared/api/upload/upload.api";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {Headers, Http} from "@angular/http";
import {environment} from "../../../environments/environment";
import {InvitationModel} from "../../shared/api/invite/invite.model";
import {Location} from '@angular/common';

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
  defaultCoverSrc: SafeUrl;
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 8;
  maxTitleLength = 20;
  maxDescLength = 600;
  time = '';
  title = '';
  desc = '';
  oldFileName = '';
  submitted = false;
  user: UserInfoModel;
  nameContent = '';
  introContent = '';
  uid: number;

  constructor(private http: Http, private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer,
              private fb: FormBuilder, private liveService: LiveService, private uploadService: UploadApiService, private userInfoService: UserInfoService, private _location: Location) {
  }

  ngOnInit() {
    this.user = this.userInfoService.getUserInfoCache();
    console.log(this.user, 'edit-currentUserInfo')
    // if(!this.currentUserInfo) this.router.navigate(['404']);
    this.nameContent = this.user.nick;
  }

  ngDoCheck() {
    //   if (this.form.controls['cover'].valid && this.coverFiles) {
    //     if (this.coverFiles.length) {
    //       let file = this.coverFiles[0];
    //
    //       if (this.oldFileName === file.name) return;
    //
    //       let reader = new FileReader();
    //
    //       reader.onload = (e) => {
    //         this.coverSrc = this.sanitizer.bypassSecurityTrustUrl(e.target['result']);
    //         this.oldFileName = file.name;
    //       };
    //
    //       reader.readAsDataURL(file);
    //     } else {
    //       this.coverSrc = this.originCoverSrc || this.defaultCoverSrc;
    //     }
    //   } else {
    //     this.coverSrc = this.originCoverSrc || this.defaultCoverSrc;
    //   }
  }

  //
  backToViewInfo() {
    this._location.back();
  }

  //
  // submit() {
  //   Object.keys(this.form.controls).forEach((key) => {
  //     this.form.controls[key].markAsDirty();
  //     this.form.controls[key].updateValueAndValidity();
  //   });
  //
  //   if (this.form.invalid) return;
  //
  //   this.postLiveInfo();
  // }
  //
  // postLiveInfo() {
  //   if (this.coverFiles && this.coverFiles.length) {
  //     this.liveService.getCoverUploadToken(this.liveId).then((data) => {
  //       let uploadOption = {
  //         key: data.coverKey,
  //         token: data.token,
  //       };
  //
  //       return this.uploadService.uploadToQiniu(this.coverFiles[0], uploadOption);
  //     }).then((imageKey) => {
  //       this.updateLiveInfo(imageKey);
  //     });
  //   } else {
  //     this.updateLiveInfo();
  //   }
  // }
  //
  // updateLiveInfo(coverKey?: string) {
  //   let expectStartAt = moment(`${this.time}:00`).local();
  //
  //   this.liveService.updateLiveInfo(this.liveId, this.title, this.desc, expectStartAt.toISOString(), coverKey).then(() => {
  //     return this.liveService.getLiveInfo(this.liveId, true);
  //   }).then(() => {
  //     this.submitted = true;
  //     this.router.navigate([`/livesList/${this.liveId}/settings/view-info`]);
  //   });
  // }
  //
  // canDeactivate() {
  //   return !this.form.dirty || this.submitted;
  // }

  submit() {
    this.postUserInfo();
  }

  postUserInfo() {
    if (this.nameContent && this.nameContent.length) {
      let headers = new Headers({'Content-Type': 'application/json'});
      const url = `${environment.config.host.io}/api/user/detail`;
      let user = new UserInfoModel();
      user.nick = this.nameContent;
      user.intro = this.introContent;
      return this.http.post(url, JSON.stringify(user), {headers: headers}).toPromise().then((res)=> {
        this._location.back();
      });
    }
  }
}
