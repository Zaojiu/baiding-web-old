import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegexpConst} from "../../shared/utils/regexp";
import {SenderApiService, SmsScene, SmsType} from "../../shared/api/sender/sender.api";
import {OperationTipsService} from "../../shared/operation-tips/operation-tips.service";
import {UserInfoService} from "../../shared/api/user-info/user-info.service";
import {ApiError, SigninErrorMessage} from "../../shared/api/code-map.enum";

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})

export class ResetPwdComponent implements OnInit {
  id: string;
  form: FormGroup;
  phoneNumber = '';
  smsCode: string;
  password: string;
  smsBtnText = '发送验证码';
  smsBtnAvailable = true;
  isSubmitting = false;
  redirectTo: string;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private senderApiService: SenderApiService, private tipsService: OperationTipsService,
              private userInfoService: UserInfoService) {
  }

  ngOnInit() {
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
    });
  }

  clearError(controlKey: string, errorKey: string) {
    const control = this.form.controls[controlKey];
    const error = control.errors;
    if (error) delete error[errorKey];
  }

  validateAndSubmit() {
    this.form.markAsDirty();
    this.form.markAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    this.submit();
  }

  submit() {
    this.isSubmitting = true;
    this.tipsService.popup('重置密码中...');

    this.userInfoService.resetPassword(this.phoneNumber, this.smsCode, this.password, SigninErrorMessage).then(() => {
      this.tipsService.popup('重置密码成功，请重新登录');
      this.router.navigate(['/signin'], {queryParams: {redirectTo: this.route.snapshot.queryParams['redirectTo']}});
    }, err => {
      const data = err.json();
      if (data && data.code) {
        switch (data.code) {
          case ApiError.ErrSigninInvalidSmsCode:
            this.form.controls['smsCode'].setErrors({wrongcode: true});
            break;
        }
      }

      return Promise.reject(err);
    }).finally(() => {
      this.isSubmitting = false;
    });
  }

  get isMobileValid(): boolean {
    this.form.controls['phoneNumber'].markAsDirty();
    this.form.controls['phoneNumber'].markAsTouched();
    this.form.controls['phoneNumber'].updateValueAndValidity();
    return this.form.controls['phoneNumber'].valid;
  }

  sendSMS() {
    const isMobileValid = this.isMobileValid;

    if (!isMobileValid) this.tipsService.popup('请填写正确的手机号码再发送验证码');

    if (!this.smsBtnAvailable || !isMobileValid) return;

    this.smsBtnAvailable = false;

    this.senderApiService.sendSmsByGuest(this.phoneNumber, SmsScene.ResetPassword, SmsType.Text, SigninErrorMessage).then(() => {
      let timer = null;
      let countDown = 60;

      this.smsBtnText = `${countDown}s`;
      this.tipsService.popup('验证码发送成功');
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
    }).catch((e) => {
      this.smsBtnAvailable = true;
    });
  }
}
