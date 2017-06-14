import {Component, OnInit} from '@angular/core';
import {UserInfoModel} from "../shared/api/user-info/user-info.model";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegexpConst} from "../shared/utils/regexp";
import {SenderApiService, SmsScene} from "../shared/api/sender/sender.api";
import {OperationTipsService} from "../shared/operation-tips/operation-tips.service";
import {UserInfoService} from "../shared/api/user-info/user-info.service";

@Component({
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})

export class SigninComponent implements OnInit {
  id: string;
  userInfo: UserInfoModel;
  form: FormGroup;
  phoneNumber: string;
  smsCode: string;
  password: string;
  smsBtnText = '发送验证码';
  smsBtnAvailable = true;
  isSubmitting = false;
  redirectTo: string;
  mode = 'sms';

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
    });
  }

  switchMode(mode: string) {
    this.mode = mode;

    if (mode === 'sms') {
      this.form.controls['smsCode'].setErrors(null);
      this.form.controls['smsCode'].markAsPristine();
      this.form.controls['smsCode'].markAsUntouched();
      this.password = '';
    } else if (mode === 'password') {
      this.form.controls['password'].setErrors(null);
      this.form.controls['password'].markAsPristine();
      this.form.controls['password'].markAsUntouched();
      this.smsCode = '';
    }
  }

  clearError(controlKey: string, errorKey: string) {
    const control = this.form.controls[controlKey];
    const error = control.errors;
    if (error) delete error[errorKey];
  }

  validateAndSubmit() {
    Object.keys(this.form.controls).forEach((key) => {
      if ((this.mode === 'sms' && key === 'password') || (this.mode === 'password' && key === 'smsCode')) {
        this.form.controls[key].setErrors(null);
        return;
      }

      this.form.controls[key].markAsDirty();
      this.form.controls[key].markAsTouched();
      this.form.controls[key].updateValueAndValidity();
    });

    if (this.form.invalid) return;

    this.submit();
  }

  submit() {
    this.isSubmitting = true;
    this.tipsService.popup('登录中...');

    this.userInfoService.signin(this.phoneNumber, this.smsCode, this.password).then(() => {
      return this.userInfoService.getUserInfo(true);
    }).then(() => {
      this.tipsService.popup('登录成功');
      this.router.navigateByUrl(this.redirectTo);
    }).catch((err) => {
      throw err;
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

    this.senderApiService.sendSmsByGuest(this.phoneNumber, SmsScene.Login).then(() => {
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
      this.tipsService.popup('手机验证码发送失败');
      throw e;
    });
  }
}
