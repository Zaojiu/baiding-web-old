import {Component, OnInit} from '@angular/core';
import {UserInfoModel} from "../shared/api/user-info/user-info.model";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegexpConst} from "../shared/utils/regexp";
import {SenderApiService, SmsScene} from "../shared/api/sender/sender.api";
import {OperationTipsService} from "../shared/operation-tips/operation-tips.service";
import {UserInfoService} from "../shared/api/user-info/user-info.service";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})

export class SignupComponent implements OnInit {
  id: string;
  userInfo: UserInfoModel;
  form: FormGroup;
  phoneNumber: string;
  smsCode: string;
  password: string;
  name: string;
  company: string;
  title: string;
  smsBtnText = '发送验证码';
  smsBtnAvailable = true;
  isSubmitting = false;
  redirectTo: string;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private senderApiService: SenderApiService, private tipsService: OperationTipsService,
              private userInfoService: UserInfoService) {
  }

  ngOnInit() {
    this.userInfo = this.route.snapshot.data['userInfo'];
    this.redirectTo = decodeURIComponent(this.route.snapshot.params['redirectTo'] || '/');
    this.form = this.fb.group({
      'phoneNumber': new FormControl(this.phoneNumber, [
        Validators.required,
        Validators.pattern(RegexpConst.mobile),
      ]),
      'smsCode': new FormControl(this.smsCode, [
        Validators.required,
        Validators.pattern(/^[0-9]{6}$/),
      ]),
      'password': new FormControl(this.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
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
    this.tipsService.popup('绑定中...');

    this.userInfoService.signup(this.phoneNumber, this.smsCode, this.password, this.name, this.company, this.title).then(() => {
      return this.userInfoService.getUserInfo(true);
    }).then(() => {
      this.tipsService.popup('绑定手机成功');
      this.router.navigateByUrl(this.redirectTo);
    }).catch((err) => {
      throw err;
    }).finally(() => {
      this.isSubmitting = false;
    });
  }

  get isMobileValid(): boolean {
    this.form.controls['phoneNumber'].markAsDirty();
    this.form.controls['phoneNumber'].updateValueAndValidity();
    return this.form.controls['phoneNumber'].valid;
  }

  sendSMS() {
    const isMobileValid = this.isMobileValid;

    if (!isMobileValid) this.tipsService.popup('请填写正确的手机号码再发送验证码');

    if (!this.smsBtnAvailable || !isMobileValid) return;

    this.smsBtnAvailable = false;

    this.senderApiService.sendSmsByLoginUser(this.phoneNumber, SmsScene.BindMobile).then(() => {
      let timer = null;
      let countDown = 60;

      timer = setInterval(() => {
        countDown--;
        if (countDown === 0) {
          this.smsBtnAvailable = true;
          this.smsBtnText = `发送验证码`;
          clearInterval(timer);
        } else {
          this.smsBtnText = `${countDown}s`;
        }
      }, 1000);

      this.tipsService.popup('验证码发送成功');
    }).catch((e) => {
      this.smsBtnAvailable = true;
      throw e;
    });
  }
}
