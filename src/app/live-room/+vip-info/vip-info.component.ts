import {Component, OnInit}      from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {InviteApiService} from '../../shared/api/invite/invite.api';
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {FormGroup, Validators, FormControl, FormBuilder} from "@angular/forms";

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

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
              private inviteApiService: InviteApiService, private operationTipsService: OperationTipsService) {
  }

  ngOnInit() {
    this.liveId = this.route.parent.snapshot.params['id'];

    this.form = this.fb.group({
      'nick': new FormControl(this.nick, [
        Validators.required,
      ]),
      'intro': new FormControl(this.intro, [
        Validators.maxLength(this.maxIntroLength),
      ]),
    });
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

      if (invitationCount > 5) {
        this.operationTipsService.popup('最多邀请五个嘉宾');
        return;
      }

      return this.inviteApiService.getInvited(this.liveId, this.nick, this.intro);
    }).then((model) => {
      this.router.navigate(([`/lives/${this.liveId}/invitation`, {token: model.token}]));
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}
