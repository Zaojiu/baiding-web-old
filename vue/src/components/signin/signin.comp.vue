<template>
  <div class="signin-container">
    <div class="wechat-signin-container" v-bind:class="{'show': mode === 'wechat'}">
      <div class="qrcode-container">
        <div class="loading-container" v-bind:class="{show: isWechatQrcodeLoading}">
          <bd-loading class="loading"></bd-loading>
          二维码加载中...
        </div>
        <div class="retry" v-if="isWechatQrcodeError">二维码加载失败，请<a href="" @click.prevent="getWechatQrCode()">重试</a>
        </div>
        <iframe v-if="wechatQrcodeSrc"
                v-bind:class="{show: !isWechatQrcodeLoading && !isWechatQrcodeError}"
                v-bind:src="wechatQrcodeSrc"
                @load="isWechatQrcodeLoading=false"
                frameborder="0"></iframe>
      </div>
      <a class="button button-primary" href="" @click.prevent="switchMode('sms')">返回</a>
    </div>

    <div class="mobile-signin-container"
         ref="mobileSigninContainer"
         v-bind:class="{'show': mode === 'sms' || mode === 'password', 'hide': mode !== 'sms' && mode !== 'password'}">
      <nav>
        <a href="" v-bind:class="{active: mode === 'sms'}"
           @click.prevent="switchMode('sms'); $refs.mobileInput.focus();">验证码登录</a>
        <a href="" v-bind:class="{active: mode === 'password'}"
           @click.prevent="switchMode('password'); $refs.mobileInput.focus();">密码登录</a>
      </nav>

      <form class="main-form" name="form" @submit.prevent="validateAndSubmit()" v-focus-first-invalid>
        <div class="form-group mobile-group" v-bind:class="{'has-error': errors.has('phoneNumber')}">
          <div class="input-group">
            <input
              ref="mobileInput"
              class="phoneNumber"
              id="phoneNumber"
              name="phoneNumber"
              v-model="phoneNumber"
              v-validate="{rules: {required: true, regex: regexpMobile}}"
              v-focus
              v-has-value
            >
            <label class="required">手机号码</label>
          </div>
          <i class="bi bi-close-2" v-if="phoneNumber!==''" @click="phoneNumber=''; $refs.mobileInput.focus();"></i>
          <p class="helper error" v-if="errors.first('phoneNumber:required')">请填写手机号码</p>
          <p class="helper error" v-else-if="errors.first('phoneNumber:regex')">手机号码格式错误，请重新填写</p>
        </div>

        <div class="form-group sms-code-group"
             v-if="mode === 'sms'"
             v-bind:class="{'has-error': errors.has('smsCode')}">
          <div class="input-group">
            <input
              ref="smsCodeInput"
              class="smsCode"
              name="smsCode"
              v-model="smsCode"
              v-validate="{rules: {required: true, regex: /^[0-9]{6}$/}}"
              v-has-value
              @input="clearError('smsCode', 'wrongcode')"
            >
            <label class="required">验证码</label>
            <a class="sms-sender"
               href=""
               v-bind:class="{'disabled': !smsBtnAvailable}"
               @click.prevent="sendSMS(); errors.has('phoneNumber') ? $refs.mobileInput.focus() : $refs.smsCodeInput.focus();">{{smsBtnText}}</a>
          </div>
          <p class="helper error" v-if="errors.first('smsCode:required')">请填写验证码</p>
          <p class="helper error" v-else-if="errors.first('smsCode:regexp')">手机验证码必须为6位数字</p>
          <p class="helper error" v-else-if="errors.first('smsCode:wrongcode')">验证码错误</p>
        </div>

        <div class="form-group password-group"
             v-if="mode === 'password'"
             v-bind:class="{'has-error': errors.has('password')}">
          <div class="input-group">
            <input
              class="password"
              name="password"
              type="password"
              v-model="password"
              v-validate="{rules: {min: 8, max: 32, required: true}}"
              v-has-value
              @input="clearError('password', 'wrongpassword')"
            >
            <label class="required">密码</label>
          </div>
          <a href="" class="forget-pwd" @click.prevent="gotoResetPwd()">忘记密码</a>
          <p class="helper error" v-if="errors.first('password:required')">请填写密码</p>
          <p class="helper error" v-else-if="errors.first('password:minlength')">密码不能少于8位</p>
          <p class="helper error" v-else-if="errors.first('password:maxlength')">密码不能多于32位</p>
          <p class="helper error" v-else-if="errors.first('password:wrongpassword')">密码错误</p>
        </div>

        <div class="form-group">
          <button class="button button-primary" v-bind:disabled="isSubmitting">{{!isSubmitting ? '登录' : '登录中...'}}
          </button>
        </div>
      </form>

      <section class="vendor-signin">
        <h2>第三方登录</h2>
        <div class="vendor-container">
          <a href="" @click.prevent="switchMode('wechat')"><i class="bi bi-wechat"></i>微信登录</a>
        </div>
      </section>
    </div>
  </div>

</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {regexpMobile, getRelativePath} from '../../shared/utils/utils';
  import {host} from "../../env/environment";
  import form from '../../shared/form';
  import bdLoading from '../../shared/bd-loading.comp.vue'

  @Component({
    components: {
      bdLoading,
    },
    directives: form,
  })
  export default class SigninComponent extends Vue {
    id: string;
    phoneNumber = '';
    smsCode = '';
    password = '';
    smsBtnText = '发送验证码';
    smsBtnAvailable = true;
    isSubmitting = false;
    redirectTo: string;
    mode = 'sms';
    wechatQrcodeSrc = '';
    isWechatQrcodeLoading = false;
    isWechatQrcodeError = false;
    regexpMobile = regexpMobile;

    created() {
      this.redirectTo = getRelativePath(this.$route.query['redirectTo'], '/lives');
//      this.getWechatQrCode();
    }


    switchMode(mode: string) {
      this.mode = mode;

//      if (mode === 'sms') {
//        this.form.controls['smsCode'].setErrors(null);
//        this.form.controls['smsCode'].markAsPristine();
//        this.form.controls['smsCode'].markAsUntouched();
//        this.password = '';
//      } else if (mode === 'password') {
//        this.form.controls['password'].setErrors(null);
//        this.form.controls['password'].markAsPristine();
//        this.form.controls['password'].markAsUntouched();
//        this.smsCode = '';
//      }
    }

    clearError(controlKey: string, errorKey: string) {
//      const control = this.form.controls[controlKey];
//      const error = control.errors;
//      if (error) delete error[errorKey];
    }

    validateAndSubmit() {
//      Object.keys(this.form.controls).forEach((key) => {
//        if ((this.mode === 'sms' && key === 'password') || (this.mode === 'password' && key === 'smsCode')) {
//          this.form.controls[key].setErrors(null);
//          return;
//        }
//
//        this.form.controls[key].markAsDirty();
//        this.form.controls[key].markAsTouched();
//        this.form.controls[key].updateValueAndValidity();
//      });
//
//      if (this.form.invalid) return;

//      this.submit();
    }
//
//    submit() {
//      this.isSubmitting = true;
//      this.tipsService.popup('登录中...');
//
//      const codeMap = this.smsCode ? SigninErrorMessage : null;
//
//      this.userInfoService.signin(this.phoneNumber, this.smsCode, this.password, codeMap).then(() => {
//        this.tipsService.popup('登录成功');
//        this.router.navigateByUrl(this.redirectTo);
//      }, err => {
//        const data = err.json();
//        if (data && data.code) {
//          switch (data.code) {
//            case ApiError.ErrSigninInvalidSmsCode:
//              this.form.controls['smsCode'].setErrors({wrongcode: true});
//              break;
//            case ApiError.ErrSigninInvalidPassword:
//              this.form.controls['password'].setErrors({wrongpassword: true});
//              break;
//          }
//        }
//
//        return Promise.reject(err);
//      }).finally(() => {
//        this.isSubmitting = false;
//      });
//    }
//
//    get isMobileValid(): boolean {
//      this.form.controls['phoneNumber'].markAsDirty();
//      this.form.controls['phoneNumber'].markAsTouched();
//      this.form.controls['phoneNumber'].updateValueAndValidity();
//      return this.form.controls['phoneNumber'].valid;
//    }
//
//    sendSMS() {
//      const isMobileValid = this.isMobileValid;
//
//      if (!isMobileValid) this.tipsService.popup('请填写正确的手机号码再发送验证码');
//
//      if (!this.smsBtnAvailable || !isMobileValid) return;
//
//      this.smsBtnAvailable = false;
//
//      this.senderApiService.sendSmsByGuest(this.phoneNumber, SmsScene.Login, SmsType.Text, SigninErrorMessage).then(() => {
//        let timer = null;
//        let countDown = 60;
//
//        this.smsBtnText = `${countDown}s`;
//        this.tipsService.popup('验证码发送成功');
//        timer = setInterval(() => {
//          countDown--;
//          if (countDown === 0) {
//            this.smsBtnAvailable = true;
//            this.smsBtnText = `发送验证码`;
//            clearInterval(timer);
//          } else {
//            this.smsBtnText = `${countDown}s`;
//          }
//        }, 1000);
//      }).catch((e) => {
//        this.smsBtnAvailable = true;
//      });
//    }
//
//    getWechatQrCode() {
//      if (this.isWechatQrcodeLoading || (this.wechatQrcodeSrc && !this.isWechatQrcodeError)) return;
//
//      this.isWechatQrcodeLoading = true;
//      this.isWechatQrcodeError = false;
//
//      this.userInfoService.getWechatSigninQrcode(`${host.self}${this.router.url}`).then(qrCode => {
//        const wechatUri = qrCode.wechat_uri;
//        delete qrCode.wechat_uri;
//        this.wechatQrcodeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(`${wechatUri}?${$.param(qrCode)}`);
//        setTimeout(() => {
//          if (this.isWechatQrcodeLoading) {
//            this.isWechatQrcodeError = true;
//            this.isWechatQrcodeLoading = false;
//          }
//        }, 30 * 1000);
//      }).catch(e => {
//        this.isWechatQrcodeError = true;
//        this.isWechatQrcodeLoading = false;
//        throw e;
//      });
//    }
//
//    gotoResetPwd() {
//      this.router.navigate(['/signin/reset-password'], {queryParams: {redirectTo: this.route.snapshot.queryParams['redirectTo']}});
//    }
  }
</script>
