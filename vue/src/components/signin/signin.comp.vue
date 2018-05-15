<template>
  <div class="signin-container">
    <div class="wechat-signin-container" :class="{'show': mode === 'wechat'}">
      <div class="qrcode-container">
        <div class="loading-container" :class="{show: $store.state.user.qrcodeUrl === undefined}">
          <bd-loading class="loading"></bd-loading>
          {{$t('m.signIn.qrcodeLoading')}}...
        </div>
        <div class="retry" v-if="isWechatQrcodeError">{{$t('m.signIn.qrcodeError')}}<a href=""
                                                                                       @click.prevent="getQrcodeUrl()">{{$t('m.signIn.tryAgain')}}</a>
        </div>
        <iframe
          :class="{show: $store.state.user.qrcodeUrl}"
          :src="$store.state.user.qrcodeUrl"
          @error="isWechatQrcodeError = true"
          frameborder="0"
        ></iframe>
      </div>
      <a class="button button-primary" href="" @click.prevent="switchMode('sms')">{{$t('m.signIn.back')}}</a>
    </div>

    <div class="mobile-signin-container"
         ref="mobileSigninContainer"
         :class="{'show': mode === 'sms' || mode === 'password', 'hide': mode !== 'sms' && mode !== 'password'}">
      <nav>
        <a href="" :class="{active: mode === 'sms','font-s':ev!=='zh'}"
           @click.prevent="switchMode('sms'); $refs.mobileInput.focus();">{{$t('m.signIn.byVerificationCode')}}</a>
        <a href="" :class="{active: mode === 'password','font-s':ev!=='zh'}"
           @click.prevent="switchMode('password'); $refs.mobileInput.focus();">{{$t('m.signIn.byPassword')}}</a>
      </nav>

      <form class="main-form" name="form" @submit.prevent="validateAndSubmit()" v-focus-first-invalid>
        <div class="form-group mobile-group" :class="{'has-error': errors.has('phoneNumber')}">
          <div class="input-group">
            <input
              ref="mobileInput"
              name="phoneNumber"
              v-model="phoneNumber"
              v-validate="{rules: {required: true, regex: regexpMobile}}"
              v-focus
              v-has-value
            >
            <label class="required">{{$t('m.signIn.tellPhoneNumber')}}</label>
          </div>
          <i class="bi bi-close-2" v-if="phoneNumber!==''" @click="phoneNumber=''; $refs.mobileInput.focus();"></i>
          <p class="helper error" v-if="errors.first('phoneNumber:required')">{{$t('m.signIn.tellPhoneRequired')}}</p>
          <p class="helper error" v-else-if="errors.first('phoneNumber:regex')">{{$t('m.signIn.tellPhoneError')}}</p>
        </div>

        <div class="form-group sms-code-group"
             v-if="mode === 'sms'"
             :class="{'has-error': errors.has('smsCode')}">
          <div class="input-group">
            <input
              ref="smsCodeInput"
              name="smsCode"
              minlength="6"
              maxlength="6"
              v-model="smsCode"
              v-validate="{rules: {required: true, regex: /^[0-9]{6}$/}}"
              v-has-value
              @input="clearError('smsCode', 'wrongcode')"
            >
            <label class="required">{{$t('m.signIn.verificationCode')}}</label>
            <a class="sms-sender"
               href=""
               :class="{'disabled': !smsBtnAvailable}"
               @click.prevent="sendSMS(); errors.has('phoneNumber') ? $refs.mobileInput.focus() : $refs.smsCodeInput.focus();">{{smsBtnText}}</a>
          </div>
          <p class="helper error" v-if="errors.first('smsCode:required')">
            {{$t('m.signIn.verificationCodeRequired')}}</p>
          <p class="helper error" v-else-if="errors.first('smsCode:regex')">{{$t('m.signIn.verificationCodeMin')}}</p>
          <p class="helper error" v-else-if="errors.first('smsCode:wrongcode')">
            {{$t('m.signIn.verificationCodeError')}}</p>
        </div>

        <div class="form-group password-group"
             v-if="mode === 'password'"
             :class="{'has-error': errors.has('password')}">
          <div class="input-group">
            <input
              name="password"
              type="password"
              v-model="password"
              minlength="8"
              maxlength="32"
              v-validate="{rules: {min: 8, max: 32, required: true}}"
              v-has-value
              @input="clearError('password', 'wrongpassword')"
            >
            <label class="required">{{$t('m.signIn.password')}}</label>
          </div>
          <a href="" class="forget-pwd" @click.prevent="gotoResetPwd()">{{$t('m.signIn.forgotPassword')}}</a>
          <p class="helper error" v-if="errors.first('password:required')">{{$t('m.signIn.passwordRequired')}}</p>
          <p class="helper error" v-else-if="errors.first('password:min')">{{$t('m.signIn.passwordMin')}}</p>
          <p class="helper error" v-else-if="errors.first('password:max')">{{$t('m.signIn.passwordMax')}}</p>
          <p class="helper error" v-else-if="errors.first('password:wrongpassword')">
            {{$t('m.signIn.passwordError')}}</p>
        </div>

        <div class="form-group">
          <button class="button button-primary" :disabled="isSubmitting">{{!isSubmitting ? $t('m.signIn.signIn') :
            $t('m.signIn.singInLoading')}}
          </button>
        </div>
      </form>

      <section class="vendor-signin">
        <h2>{{$t('m.signIn.otherSingIn')}}</h2>
        <div class="vendor-container">
          <a href="" @click.prevent="switchMode('wechat')"><i
            class="bi bi-wechat"></i>{{$t('m.signIn.weChatSingIn')}}</a>
        </div>
      </section>
    </div>
  </div>

</template>

<style lang="scss" scoped>
  .signin-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }

  .mobile-signin-container {
    position: relative;

    &.hide {
      opacity: 0;
      visibility: hidden;
      transition: visibility 0s .3s, opacity .3s ease-out;
    }

    &.show {
      opacity: 1;
      visibility: visible;
      transition: opacity .3s ease-in;
    }

    nav {
      padding: 40px 30px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      .font-s {
        font-size: 14px;
      }

      a {
        font-size: $font-size-24;
        color: $color-gray3;
        line-height: 1em;
        text-decoration: none;
        cursor: pointer;
        transform: scale(.75);
        transform-origin: left bottom;
        transition: all .3s;

        &:last-child {
          transform-origin: right bottom;
        }

        &.active {
          transform: scale(1);
          color: $color-dark-gray;
        }

        &:active {
          outline: 0;
        }
      }
    }

    form {
      padding: 0 15px;

      .form-group:first-child {
        margin-top: 0;
      }

      .form-group:last-child {
        margin-top: 50px;
      }

      .mobile-group {
        position: relative;

        .bi-close-2 {
          position: absolute;
          right: 0;
          top: 22px;
        }
      }

      .sms-code-group, .password-group {
        position: relative;

        input {
          box-sizing: border-box;
          height: 33px;
          padding-right: 75px;
        }

        .sms-sender, .forget-pwd {
          position: absolute;
          right: 0;
          top: 0;
          color: $color-brand;
          text-decoration: none;
          font-size: $font-size-14;
          padding: 24px 0 8px;

          &.disabled {
            opacity: .5;
            color: $color-dark-gray;
          }
        }
      }
    }

    .vendor-signin {
      display: none;
      margin: 80px 30px 30px;

      @media (min-width: 415px) {
        display: block;
      }

      h2 {
        position: relative;
        color: $color-dark-gray;
        font-size: $font-size-18;
        text-align: center;
        font-weight: normal;

        &:before, &:after {
          position: absolute;
          content: '';
          width: calc((100% - 130px) / 2);
          top: 13px;
          border-bottom: solid 1px rgb(225, 225, 225);
        }

        &:before {
          left: 0;
        }

        &:after {
          right: 0;
        }
      }

      .vendor-container {
        display: flex;
        align-items: center;
        justify-content: center;

        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 30px;
          color: $color-gray3;
          font-size: $font-size-14;

          .bi-wechat {
            font-size: 50px;
            color: #55C13D;
            margin-bottom: 15px;
          }
        }
      }
    }
  }

  .wechat-signin-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    transition: opacity .3s;

    &.show {
      opacity: 1;
    }

    .qrcode-container {
      position: relative;
      display: flex;
      justify-content: center;
      height: 420px;
      margin: 30px;

      .loading-container, .retry {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        opacity: 0;
        transition: opacity .3s;
        font-size: $font-size-14;
        color: $color-gray;

        &.show {
          opacity: 1;
        }

        .loading {
          margin-bottom: 10px;
        }
      }

      .retry {
        white-space: nowrap;
        font-size: $font-size-14;
        color: $color-dark-gray;

        a {
          margin-left: 5px;
          color: $color-brand;
        }
      }

      iframe {
        height: 420px;
        opacity: 0;
        transition: opacity .3s;

        &.show {
          opacity: 1;
        }
      }
    }

    .button {
      width: calc(100% - 30px * 2);
      margin: 30px;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {regexpMobile, getRelativePath} from '../../shared/utils/utils';
  import {host} from "../../env/environment";
  import {form} from '../../shared/form';
  import {FETCH_SIGNIN_QRCODE} from '../../store/user';
  import {showTips} from "../../store/tip";
  import {SigninErrorMessage, ApiCode} from '../../shared/api/code-map.enum';
  import {SmsScene, SmsType, sendSmsByGuest} from '../../shared/api/sms.api';
  import {signin, signup} from '../../shared/api/user.api';

  @Component({
    directives: form,
  })
  export default class SigninComponent extends Vue {
    phoneNumber = '';
    smsCode = '';
    password = '';
    smsBtnText = '';
    smsBtnAvailable = true;
    isSubmitting = false;
    redirectTo: string;
    mode = 'sms';
    isWechatQrcodeError = false;
    regexpMobile = regexpMobile;
    ev = '';

    created() {
      this.ev = this.$i18n.locale;
      this.smsBtnText = this.$t('m.signIn.sendVerificationCode') as string;
      this.redirectTo = getRelativePath(this.$route.query['redirectTo'], '/lives');
      this.getQrcodeUrl();
    }

    async getQrcodeUrl() {
      this.isWechatQrcodeError = false;
      const success = await this.$store.dispatch(FETCH_SIGNIN_QRCODE, `${host.self}${this.redirectTo}`);
      this.isWechatQrcodeError = !success;
    }

    switchMode(mode: string) {
      this.mode = mode;

      if (mode === 'sms') {
        this.$validator.errors.remove('smsCode');
        this.password = '';
      } else if (mode === 'password') {
        this.$validator.errors.remove('password');
        this.smsCode = '';
      }
    }

    clearError(controlKey: string, errorKey: string) {
      if (this.$validator.errors.firstByRule(controlKey, errorKey)) {
        this.$validator.errors.remove(controlKey);
      }
    }

    validateAndSubmit() {
      this.$validator.validateScopes();

      if (this.mode === 'sms') {
        this.$validator.errors.remove('password');
      } else {
        this.$validator.errors.remove('smsCode');
      }

      if (this.$validator.errors.any()) return;

      this.submit();
    }

    async submit() {
      this.isSubmitting = true;
      showTips(this.$t('m.signIn.singInLoading') as string);

      const errorMessage = _.assign({}, {
        [ApiCode.ErrSigninInvalidPassword]: this.smsCode ? (this.$t('m.signIn.verificationCodeError') as string) : (this.$t('m.signIn.passwordError') as string)
      }, SigninErrorMessage);

      try {
        if (this.mode === 'password') {
          await signin(this.phoneNumber, this.password, errorMessage);
        } else {
          await signup(this.phoneNumber, this.smsCode, errorMessage);
        }
      } catch (e) {
        const code = e.code;
        switch (code) {
          case ApiCode.ErrSigninInvalidSmsCode:
            this.$validator.errors.add('smsCode', 'wrong sms code', 'wrongcode');
            break;
          case ApiCode.ErrSigninInvalidPassword:
            this.$validator.errors.add('password', 'wrong password', 'wrongpassword');
            break;
        }
        throw e;
      } finally {
        this.isSubmitting = false;
      }

      showTips(this.$t('m.signIn.singInSuccess') as string);
      this.$router.push({path: this.redirectTo});
    }

    async sendSMS() {
      const isMobileValid = !this.$validator.errors.has('phoneNumber');

      if (!isMobileValid) showTips(this.$t('m.signIn.tellPhoneVerificationCode') as string);

      if (!this.smsBtnAvailable || !isMobileValid) return;

      this.smsBtnAvailable = false;

      try {
        await sendSmsByGuest(this.phoneNumber, SmsScene.Signup, SmsType.Text, SigninErrorMessage);
      } catch (e) {
        this.smsBtnAvailable = true;
        throw e;
      }

      let timer: number;
      let countDown = 60;

      this.smsBtnText = `${countDown}s`;
      showTips(this.$t('m.signIn.sendVerificationCodeSuccess') as string);
      timer = setInterval(() => {
        countDown--;
        if (countDown === 0) {
          this.smsBtnAvailable = true;
          this.smsBtnText = this.$t('m.signIn.sendVerificationCode') as string;
          clearInterval(timer);
        } else {
          this.smsBtnText = `${countDown}s`;
        }
      }, 1000);
    }

    gotoResetPwd() {
      this.$router.push({path: '/forget-password', query: {redirectTo: this.redirectTo}});
    }
  }
</script>
