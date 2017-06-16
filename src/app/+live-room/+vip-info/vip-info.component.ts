import {Component, OnInit}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {InviteApiService} from '../../shared/api/invite/invite.api';
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {FormGroup, Validators, FormControl, FormBuilder} from "@angular/forms";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {InvitationModel} from "../../shared/api/invite/invite.model";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {UtilsService} from "../../shared/utils/utils";
import {SafeUrl, DomSanitizer} from "@angular/platform-browser";
import {ImageBridge} from "../../shared/bridge/image.interface";
import {sizeValidator, typeValidator} from "../../shared/file-selector/file-selector.validator";
import {UploadApiService} from "../../shared/api/upload/upload.api";

@Component({
  templateUrl: './vip-info.component.html',
  styleUrls: ['./vip-info.component.scss'],
  providers: [InviteApiService]
})

export class VipInfoComponent implements OnInit {
  liveId: string;
  token: string;
  nick = '';
  title = '';
  intro = '';
  avatarFiles: File[];
  avatarSrc: SafeUrl | string;
  wxLocalId: string;
  oldFileName = '';
  fileTypeRegexp = /^image\/gif|jpg|jpeg|png|bmp|raw$/;
  maxSizeMB = 1;
  maxIntroLength = 100;
  form: FormGroup;
  isSubmitting = false;
  userInfo: UserInfoModel;
  liveInfo: LiveInfoModel;
  invitations: InvitationModel[];
  isInApp = UtilsService.isInApp;
  isInWechat = UtilsService.isInWechat;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private inviteApiService: InviteApiService, private operationTipsService: OperationTipsService,
              private sanitizer: DomSanitizer, private imageBridge: ImageBridge, private uploadService: UploadApiService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.parent.snapshot.params['id'];
    this.userInfo = this.route.snapshot.data['userInfo'];
    this.liveInfo = this.route.snapshot.data['liveInfo'];

    this.inviteApiService.listInvitations(this.liveId).then((res) => {
      this.invitations = res;
    });

    this.form = this.fb.group({
      'avatar': new FormControl(this.avatarFiles, [
        sizeValidator(this.maxSizeMB),
        typeValidator(this.fileTypeRegexp),
      ]),
      'nick': new FormControl(this.nick, [
        Validators.required,
      ]),
      'title': new FormControl(this.title, []),
      'intro': new FormControl(this.intro, [
        Validators.maxLength(this.maxIntroLength),
      ]),
    });
  }

  ngDoCheck() {
    if (!this.isInWechat) {
      if (this.form.controls['avatar'].valid && this.avatarFiles) {

        if (this.avatarFiles.length) {
          let file = this.avatarFiles[0];

          if (this.oldFileName === file.name) return;

          let reader = new FileReader();

          reader.onload = (e) => {
            this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(e.target['result']);
            this.oldFileName = file.name;
          };

          reader.readAsDataURL(file);
        } else {
          this.avatarSrc = '';
          this.oldFileName = '';
        }
      } else {
        this.avatarSrc = '';
        this.oldFileName = '';
      }
    }
  }

  selectImages() {
    this.imageBridge.chooseImages(1).then((localIds) => {
      this.wxLocalId = localIds[0] as string;
      this.avatarSrc = this.sanitizer.bypassSecurityTrustUrl(localIds[0] as string);
    });
  }

  gotoInvitation(token: string) {
    this.router.navigate([`/lives/${this.liveId}/invitation`, {token: token}]);
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });

    if (this.form.invalid) return;

    this.generateInvitation();
  }

  generateInvitation() {
    this.isSubmitting = true;

    this.inviteApiService.listInvitations(this.liveId).then((invitations) => {
      let invitationCount = invitations.length;

      if (invitationCount >= 30) {
        this.operationTipsService.popup('最多邀请三十个嘉宾');
        return;
      }

      let promise = null;

      if (this.wxLocalId) {
        promise = this.imageBridge.uploadImage(this.wxLocalId).then(serverId => {
          return this.inviteApiService.createInvititation(this.liveId, this.nick, null, serverId, this.intro, this.title);
        });
      } else if (this.avatarFiles && this.avatarFiles.length) {
        promise = this.inviteApiService.getInviteUploadToken(this.liveId).then(token => {
          return this.uploadService.uploadToQiniu(this.avatarFiles[0], '', token);
        }).then(imageKey => {
          return this.inviteApiService.createInvititation(this.liveId, this.nick, imageKey, '', this.intro, this.title);
        });
      } else {
        promise = this.inviteApiService.createInvititation(this.liveId, this.nick, '', '', this.intro, this.title);
      }

      return promise;
    }).then((model) => {
      this.router.navigate(([`/lives/${this.liveId}/invitation`, {token: model.token}]));
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}
