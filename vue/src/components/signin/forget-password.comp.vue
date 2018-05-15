<template>
  <div class="forget-pwd-container">
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
        <p class="helper error" v-if="errors.first('smsCode:required')">{{$t('m.signIn.verificationCodeRequired')}}</p>
        <p class="helper error" v-else-if="errors.first('smsCode:regex')">{{$t('m.signIn.verificationCodeMin')}}</p>
        <p class="helper error" v-else-if="errors.first('smsCode:wrongcode')">{{$t('m.signIn.verificationCodeError')}}</p>
      </div>

      <div class="form-group password-group"
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
          >
          <label class="required">{{$t('m.signIn.password')}}</label>
        </div>
        <p class="helper error" v-if="errors.first('password:required')">{{$t('m.signIn.passwordRequired')}}</p>
        <p class="helper error" v-else-if="errors.first('password:min')">{{$t('m.signIn.passwordRequired')}}</p>
        <p class="helper error" v-else-if="errors.first('password:max')">{{$t('m.signIn.passwordMax')}}</p>
      </div>

      <div class="form-group">
        <button class="button button-primary" :disabled="isSubmitting">{{!isSubmitting ? $t('m.signIn.resetPassword') : $t('m.signIn.resetPasswordLoading')}}</button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .forget-pwd-container {
    position: relative;

    form {
      padding: 30px 15px;

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

      .sms-code-group {
        position: relative;

        .sms-sender {
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
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {regexpMobile, getRelativePath} from '../../shared/utils/utils';
  import {form} from '../../shared/form';
  import {showTips} from "../../store/tip";
  import {SigninErrorMessage, ApiCode} from '../../shared/api/code-map.enum';
  import {SmsScene, SmsType, sendSmsByGuest} from '../../shared/api/sms.api';
  import {resetPassword} from '../../shared/api/user.api';

  @Component({
    directives: form,
  })
  export default class ForgetPasswordComponent extends Vue {
    phoneNumber = '';
    smsCode = '';
    password = '';
    smsBtnText = '';
    smsBtnAvailable = true;
    isSubmitting = false;
    redirectTo: string;
    regexpMobile = regexpMobile;

    created() {
      this.smsBtnText = this.$t('m.signIn.sendVerificationCode') as string;
      this.redirectTo = getRelativePath(this.$route.query['redirectTo'], '/lives');
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
      showTips(this.$t('m.signIn.resetPasswordLoading') as string);

      try {
        await resetPassword(this.phoneNumber, this.smsCode, this.password, SigninErrorMessage);
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

      showTips(this.$t('m.signIn.resetPasswordSuccess') as string);
      this.$router.push({path: '/signin', query: {redirectTo: this.redirectTo}});
    }

    async sendSMS() {
      const isMobileValid = !this.$validator.errors.has('phoneNumber');

      if (!isMobileValid) showTips(this.$t('m.signIn.tellPhoneVerificationCode') as string);

      if (!this.smsBtnAvailable || !isMobileValid) return;

      this.smsBtnAvailable = false;

      try {
        await sendSmsByGuest(this.phoneNumber, SmsScene.ResetPassword, SmsType.Text, SigninErrorMessage);
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
  }
</script>
