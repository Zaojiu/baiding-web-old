import {Component, OnInit}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {InviteApiService} from '../../shared/api/invite/invite.api';
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {FormGroup, Validators, FormControl, FormBuilder} from "@angular/forms";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {LiveService} from "../../shared/api/live/live.service";
import {AudienceInvitationModel, InvitationModel} from "../../shared/api/invite/invite.model";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";

@Component({
  templateUrl: './vip-info.component.html',
  styleUrls: ['./vip-info.component.scss'],
  providers: [InviteApiService]
})

export class VipInfoComponent implements OnInit {
  liveId: string;
  token: string;
  nick = '';
  intro = '';
  maxIntroLength = 100;
  form: FormGroup;
  isSubmitting = false;
  userInfo: UserInfoModel;
  liveInfo: LiveInfoModel;
  invitations: InvitationModel[];
  audienceListInvitations: AudienceInvitationModel[];

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private inviteApiService: InviteApiService, private userInfoService: UserInfoService,
              private liveService: LiveService, private operationTipsService: OperationTipsService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];

    this.userInfoService.getUserInfo().then((userInfo) => {
      this.userInfo = userInfo;

      this.liveService.getLiveInfo(this.liveId).then((liveInfo) => {
        this.liveInfo = liveInfo;

        if (this.isAdmin) {
          this.inviteApiService.listInvitations(this.liveId).then((res) => {
            this.invitations = res;
          });
        } else {
          this.inviteApiService.audienceListInvitations(this.liveId).then((res) => {
            this.audienceListInvitations = res;
          });
        }
      });
    });

    this.form = this.fb.group({
      'nick': new FormControl(this.nick, [
        Validators.required,
      ]),
      'intro': new FormControl(this.intro, [
        Validators.maxLength(this.maxIntroLength),
      ]),
    });
  }

  get isAdmin() {
    return this.liveInfo.isAdmin(this.userInfo.uid);
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

      if (invitationCount >= 5) {
        this.operationTipsService.popup('最多邀请五个嘉宾');
        return;
      }

      return this.inviteApiService.getInvited(this.liveId, this.nick, this.intro);
    }).then((model) => {
      if(model) this.router.navigate(([`/lives/${this.liveId}/invitation`, {token: model.token}]));
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}
