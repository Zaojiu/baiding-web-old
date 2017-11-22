import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegexpConst} from "../shared/utils/regexp";
import {SenderApiService, SmsScene, SmsType} from "../shared/api/sender/sender.api";
import {OperationTipsService} from "../shared/operation-tips/operation-tips.service";
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {host} from "../../environments/environment";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ApiError, SigninErrorMessage} from "../shared/api/code-map.enum";

@Component({
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})

export class SigninComponent implements OnInit {
  id: string;
  form: FormGroup;
  phoneNumber = '';
  smsCode: string;
  password: string;
  smsBtnText = '发送验证码';
  smsBtnAvailable = true;
  isSubmitting = false;
  redirectTo: string;
  mode = 'sms';
  wechatQrcodeSrc: SafeResourceUrl;
  isWechatQrcodeLoading = false;
  isWechatQrcodeError = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private senderApiService: SenderApiService, private tipsService: OperationTipsService,
              private userInfoService: UserInfoService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.redirectTo = this.route.snapshot.queryParams['redirectTo'] || '/lives';
    this.redirectTo = this.redirectTo.replace(host.self, '');
    if (this.redirectTo === '/' || !this.redirectTo.startsWith('/')) this.redirectTo = '/lives';
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
    this.getWechatQrCode();
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

    const codeMap = this.smsCode ? SigninErrorMessage : null;

    let promise;
    if (this.mode === 'password') {
      promise = this.userInfoService.signin(this.phoneNumber, this.password, codeMap);
    } else {
      promise = this.userInfoService.signup(this.phoneNumber, this.smsCode, codeMap)
    }

    promise.then(() => {
      this.tipsService.popup('登录成功');
      this.router.navigateByUrl(this.redirectTo);
    }, err => {
      const data = err.json();
      if (data && data.code) {
        switch (data.code) {
          case ApiError.ErrSigninInvalidSmsCode:
            this.form.controls['smsCode'].setErrors({wrongcode: true});
            break;
          case ApiError.ErrSigninInvalidPassword:
            this.form.controls['password'].setErrors({wrongpassword: true});
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

    this.senderApiService.sendSmsByGuest(this.phoneNumber, SmsScene.Signup, SmsType.Text, SigninErrorMessage).then(() => {
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

  getWechatQrCode() {
    if (this.isWechatQrcodeLoading || (this.wechatQrcodeSrc && !this.isWechatQrcodeError)) return;

    this.isWechatQrcodeLoading = true;
    this.isWechatQrcodeError = false;

    this.userInfoService.getWechatSigninQrcode(`${host.self}${this.router.url}`).then(qrCode => {
      const wechatUri = qrCode.wechat_uri;
      delete qrCode.wechat_uri;
      this.wechatQrcodeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`${wechatUri}?${$.param(qrCode)}`);
      setTimeout(() => {
        if (this.isWechatQrcodeLoading) {
          this.isWechatQrcodeError = true;
          this.isWechatQrcodeLoading = false;
        }
      }, 30 * 1000);
    }).catch(e => {
      this.isWechatQrcodeError = true;
      this.isWechatQrcodeLoading = false;
      throw e;
    });
  }

  gotoResetPwd() {
    this.router.navigate(['/signin/reset-password'], {queryParams: {redirectTo: this.route.snapshot.queryParams['redirectTo']}});
  }
}
