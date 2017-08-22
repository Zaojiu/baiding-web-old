<template>
  <div class="mobile-bind-container">
    <section class="user-section">
      <img class="avatar-lg avatar-round" v-bind:src="userInfo.avatar" alt="头像">
      <div class="nick">{{userInfo.nick}}</div>
    </section>

    <form class="main-form" name="form" @submit.prevent="validateAndSubmit()" v-focus-first-invalid>
      <section>
        <h2>手机号码绑定</h2>
        <div class="form-group mobile-group" v-bind:class="{'has-error': errors.has('phoneNumber')}">
          <div class="input-group">
            <input
              ref="mobileInput"
              name="phoneNumber"
              v-model="phoneNumber"
              v-validate="{rules: {required: true, regex: regexpMobile}}"
              v-focus
              v-has-value
            >
            <label class="required">手机号码</label>
          </div>
          <i class="bi bi-close-2" v-if="phoneNumber!==''" @click="phoneNumber=''; $refs.mobileInput.focus();"></i>
          <p class="helper" v-if="!errors.has('phoneNumber')">手机号码为11位数字</p>
          <p class="helper error" v-else-if="errors.first('phoneNumber:required')">请填写手机号码</p>
          <p class="helper error" v-else-if="errors.first('phoneNumber:regex')">手机号码格式错误，请重新填写</p>
        </div>

        <div class="form-group sms-code-group"
             v-bind:class="{'has-error': errors.has('smsCode')}">
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
            <label class="required">验证码</label>
            <a class="sms-sender"
               href=""
               v-bind:class="{'disabled': !smsBtnAvailable}"
               @click.prevent="sendSMS(); errors.has('phoneNumber') ? $refs.mobileInput.focus() : $refs.smsCodeInput.focus();">{{smsBtnText}}</a>
          </div>
          <p class="helper" v-if="!errors.has('smsCode')">六位数字验证码</p>
          <p class="helper error" v-else-if="errors.first('smsCode:required')">请填写验证码</p>
          <p class="helper error" v-else-if="errors.first('smsCode:regex')">手机验证码必须为6位数字</p>
          <p class="helper error" v-else-if="errors.first('smsCode:wrongcode')">验证码错误</p>
        </div>

        <div class="form-group"
             v-bind:class="{'has-error': errors.has('password')}">
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
            <label class="required">密码</label>
          </div>
          <p class="helper" v-if="!errors.has('password')">密码长度为8-32位，字符不限</p>
          <p class="helper error" v-else-if="errors.first('password:required')">请填写密码</p>
          <p class="helper error" v-else-if="errors.first('password:min')">密码不能少于8位</p>
          <p class="helper error" v-else-if="errors.first('password:max')">密码不能多于32位</p>
        </div>
      </section>

      <section>
        <h2>直播报名信息</h2>
        <div class="form-group"
             v-bind:class="{'has-error': errors.has('name')}">
          <div class="input-group">
            <input
              name="name"
              v-model="name"
              v-validate="{rules: {required: true}}"
              v-has-value
            >
            <label class="required">姓名</label>
          </div>
          <p class="helper" v-if="!errors.has('name')">请填写您的真实姓名</p>
          <p class="helper error" v-else-if="errors.first('name:required')">请填写姓名</p>
        </div>

        <div class="form-group"
             v-bind:class="{'has-error': errors.has('company')}">
          <div class="input-group">
            <input
              name="company"
              v-model="company"
              v-validate="{rules: {required: true}}"
              v-has-value
            >
            <label class="required">公司名称</label>
          </div>
          <p class="helper error" v-if="errors.first('company:required')">请填写公司名称</p>
        </div>

        <div class="form-group"
             v-bind:class="{'has-error': errors.has('title')}">
          <div class="input-group">
            <input
              name="title"
              v-model="title"
              v-validate="{rules: {required: true}}"
              v-has-value
            >
            <label class="required">职位</label>
          </div>
          <p class="helper error" v-if="errors.first('title:required')">请填写职位</p>
        </div>
      </section>

      <section class="footer-section">
        <div class="form-group">
          <button class="button button-primary" v-bind:disabled="isSubmitting">{{!isSubmitting ? '绑定手机号码' : '绑定中...'}}</button>
          <p class="tips">手机号码绑定之后即可观看直播</p>
        </div>
      </section>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .mobile-bind-container {
    section {
      padding: 30px 15px;
      border-bottom: solid 10px #f8f8f8;

      h2 {
        font-size: $font-size-lg;
        color: $color-dark-gray;
        text-align: center;
        line-height: 1em;
        font-weight: bold;
      }
    }

    .user-section {
      padding: 30px;
      text-align: center;
    }

    .footer-section {
      padding: 30px;
      height: 150px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f8f8f8;

      .form-group {
        margin: 0;
        width: 100%;
      }
    }

    .nick {
      margin-top: 10px;
      font-size: $font-size-xlg;
      color: $color-dark-gray;
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
        font-size: $font-size-sm;
        padding: 24px 0 8px;

        &.disabled {
          opacity: .5;
          color: $color-dark-gray;
        }
      }
    }

    .tips {
      text-align: center;
      margin-top: 10px;
      font-size: 14px;
      color: $color-gray;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {getUserInfo, getUserInfoCache} from '../../shared/api/user.api';
  import {UserInfoModel} from "../../shared/api/user.model";
  import {regexpMobile, getRelativePath} from '../../shared/utils/utils';
  import {SmsScene, SmsType, sendSmsByLoginUser} from '../../shared/api/sms.api';
  import {showTips} from "../../store/tip";
  import {signup} from '../../shared/api/user.api';
  import {signupGuard} from '../../shared/guard/signup-comp.guard';
  import {authGuard} from '../../shared/guard/user-auth.guard';
  import {beforeRouteEnter} from '../../shared/guard/before-route-enter';
  import bdLoading from '../../shared/bd-loading.comp.vue';
  import {form} from '../../shared/form';
  import {RawLocation, Route} from "vue-router";
  import {ApiCode} from '../../shared/api/code-map.enum';

  Component.registerHooks([
    'beforeRouteEnter',
  ]);

  @Component({
    components: {
      bdLoading,
    },
    directives: form,
  })
  export default class SignupComponent extends Vue {
    id: string;
    userInfo = getUserInfoCache();
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
    regexpMobile = regexpMobile;

    beforeRouteEnter(to: Route, from: Route, next: (to?: RawLocation | false | ((vm: Vue) => any) | void) => void) {
      const redirectTo = getRelativePath(to.query['redirectTo'], '/lives');
      const guards = [authGuard(redirectTo), signupGuard(redirectTo)];
      beforeRouteEnter(guards, to, from, next);
    }

    created() {
      this.userInfo = getUserInfoCache();
      this.redirectTo = getRelativePath(this.$route.query['redirectTo'], '/lives');
    }

    validateAndSubmit() {
      this.$validator.validateScopes();

      if (this.$validator.errors.any()) return;

      this.submit();
    }

    async submit() {
      this.isSubmitting = true;
      showTips('绑定中...');

      const code = await signup(this.phoneNumber, this.smsCode, this.password, this.name, this.company, this.title);
      switch (code) {
        case ApiCode.OK:
          try {
            getUserInfo(false);
          } catch (e) {
            location.reload();
            return;
          }

          showTips('绑定手机成功');
          this.$router.push({path: this.redirectTo});
          break;
      }

      this.isSubmitting = false;
    }

    sendSMS() {
      const isMobileValid = !this.$validator.errors.has('phoneNumber');

      if (!isMobileValid) showTips('请填写正确的手机号码再发送验证码');

      if (!this.smsBtnAvailable || !isMobileValid) return;

      this.smsBtnAvailable = false;

      try {
        sendSmsByLoginUser(this.phoneNumber, SmsScene.BindMobile)
      } catch (e) {
        this.smsBtnAvailable = true;
        throw e;
      }

      let timer: number;
      let countDown = 60;

      this.smsBtnText = `${countDown}s`;
      showTips('验证码发送成功');
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
    }
  }
</script>
