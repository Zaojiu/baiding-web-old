import {Component, OnInit} from '@angular/core';
import {UserInfoModel} from "../../shared/api/user-info/user-info.model";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";

@Component({
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
})

export class ActivateComponent implements OnInit {
  userInfo: UserInfoModel;
  form: FormGroup;
  memberCode: string;
  wechatNumber: string;
  name: string;
  company: string;
  title: string;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router,
              private tipsService: OperationTipsService, private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.userInfo = this.userInfoService.getUserInfoCache();

    this.userInfoService.getUserDetailInfo().then(userDetailInfo => {
      this.company = userDetailInfo.company;
      this.name = userDetailInfo.realname;
      this.title = userDetailInfo.position;
    });

    this.form = this.fb.group({
      'memberCode': new FormControl(this.memberCode, [
        Validators.required,
      ]),
      'wechatNumber': new FormControl(this.wechatNumber, [
        Validators.required,
      ]),
      'name': new FormControl(this.name, [
        Validators.required,
      ]),
      'company': new FormControl(this.company, [
        Validators.required,
      ]),
      'title': new FormControl(this.title, [
        Validators.required,
      ]),
    });
  }

  validateAndSubmit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });

    if (this.form.invalid) return;

    this.submit();
  }

  submit() {
    this.isSubmitting = true;
    this.tipsService.popup('激活会员中...');

    this.userInfoService.activateMember(this.memberCode, this.wechatNumber ,this.name, this.company, this.title).then(() => {
      return this.userInfoService.getUserInfo();
    }).then(() => {
      this.tipsService.popup('激活会员成功');
      this.router.navigate(['/member/info'], {queryParams: {success: true}});
    }).catch((err) => {
      throw err;
    }).finally(() => {
      this.isSubmitting = false;
    });
  }
}
