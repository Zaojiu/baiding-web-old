<template>
  <div class="container" v-if="status">
    <div class="signin-container">
      <div class="back">
        <i class="bi bi-close" @click="close()"></i>
      </div>
      <div class="mobile-signin-container show">
        <nav>
          <a href="" class="active" :class="{'font-s':ev!=='zh'}"
             @click.prevent="switchMode('sms'); $refs.mobileInput.focus();">{{$t('m.signIn.byVerificationCode')}}</a>
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

          <div class="form-group">
            <button class="button button-primary" :disabled="isSubmitting">{{!isSubmitting ? $t('m.signIn.signIn') :
              $t('m.signIn.singInLoading')}}
            </button>
          </div>
        </form>

      </div>
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
      padding: 30px 30px 40px 30px;
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

  .container {
    position: absolute;
    background-color: #fff;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    .back {
      width: 100%;
      text-align: left;
      box-shadow: 0px 1px 6px 0px #d8d6d6;
      padding: 10px 20px;
      font-size: 20px;
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {loginPopUpStore, hideLoginPopUp} from '../store/loginPopUp';
  import {regexpMobile, getRelativePath} from "./utils/utils";
  import {host} from "../env/environment";
  import {form} from './form';
  import {FETCH_SIGNIN_QRCODE} from '../store/user';
  import {showTips} from "../store/tip";
  import {SigninErrorMessage, ApiCode} from "./api/code-map.enum";
  import {SmsScene, SmsType, sendSmsByGuest} from "./api/sms.api";
  import {signin, signup} from "./api/user.api";

  @Component({
    directives: form,
  })
  export default class LoginPopUpComponent extends Vue {
    phoneNumber = '';
    smsCode = '';
    smsBtnText = '';
    smsBtnAvailable = true;
    isSubmitting = false;
    regexpMobile = regexpMobile;
    ev = '';
    timer: number;

    get status(): boolean {
      return loginPopUpStore.state.status;
    }

    close() {
      hideLoginPopUp();
    }

    created() {
      this.ev = this.$i18n.locale;
      this.smsBtnText = this.$t('m.signIn.sendVerificationCode') as string;
    }

    destroyed() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }


    switchMode(mode: string) {
      this.$validator.errors.remove('smsCode');
    }

    clearError(controlKey: string, errorKey: string) {
      if (this.$validator.errors.firstByRule(controlKey, errorKey)) {
        this.$validator.errors.remove(controlKey);
      }
    }

    validateAndSubmit() {
      this.$validator.validateScopes();

      if (this.$validator.errors.any()) return;

      this.submit();
    }

    async submit() {
      this.isSubmitting = true;
      showTips(this.$t('m.signIn.singInLoading') as string);

      const errorMessage = _.assign({}, {
        [ApiCode.ErrSigninInvalidPassword]: (this.$t('m.signIn.verificationCodeError') as string)
      }, SigninErrorMessage);

      try {
        await signup(this.phoneNumber, this.smsCode, errorMessage);
      } catch (e) {
        const code = e.code;
        switch (code) {
          case ApiCode.ErrSigninInvalidSmsCode:
            this.$validator.errors.add('smsCode', 'wrong sms code', 'wrongcode');
            break;
        }
        throw e;
      } finally {
        this.isSubmitting = false;
      }

      hideLoginPopUp();
      showTips(this.$t('m.signIn.singInSuccess') as string);
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

      let countDown = 60;

      this.smsBtnText = `${countDown}s`;
      showTips(this.$t('m.signIn.sendVerificationCodeSuccess') as string);
      this.timer = setInterval(() => {
        countDown--;
        if (countDown === 0) {
          this.smsBtnAvailable = true;
          this.smsBtnText = this.$t('m.signIn.sendVerificationCode') as string;
          clearInterval(this.timer);
        } else {
          this.smsBtnText = `${countDown}s`;
        }
      }, 1000);
    }

  }
</script>
