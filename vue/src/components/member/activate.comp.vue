<template>
  <div class="member-activate">
    <top-nav></top-nav>

    <section class="user-section"></section>

    <form class="main-form" name="form" @submit.prevent="validateAndSubmit()" v-focus-first-invalid>
      <section>
        <h2>会员卡激活</h2>
        <small>仅限实物卡激活</small>
        <div class="form-group" :class="{'has-error': errors.has('memberCode')}">
          <div class="input-group">
            <input
              name="memberCode"
              v-model="memberCode"
              v-validate="{rules: {required: true}}"
              v-focus
              v-has-value
            >
            <label class="required">会员卡号</label>
          </div>
          <p class="helper error" v-if="errors.first('memberCode:required')">请填写会员卡号</p>
        </div>

        <div class="form-group" :class="{'has-error': errors.has('wechatNumber')}">
          <div class="input-group">
            <input
              name="wechatNumber"
              v-model="wechatNumber"
              v-validate="{rules: {required: true}}"
              v-has-value
            >
            <label class="required">微信号</label>
          </div>
          <p class="helper error" v-if="errors.first('wechatNumber:required')">请填写微信号</p>
        </div>

        <div class="form-group"
             :class="{'has-error': errors.has('name')}">
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
             :class="{'has-error': errors.has('company')}">
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
             :class="{'has-error': errors.has('title')}">
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
          <button class="button button-primary" :disabled="isSubmitting">{{!isSubmitting ? '激活会员卡' : '激活中...'}}
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .member-activate {
    section {
      padding: 30px 15px;
      border-bottom: solid 10px #f8f8f8;

      h2 {
        font-size: $font-size-18;
        color: $color-dark-gray;
        text-align: center;
        line-height: 1em;
        font-weight: bold;
      }

      small {
        display: block;
        font-size: $font-size-14;
        color: $color-gray3;
        text-align: center;
        margin-top: 5px;
      }
    }

    .user-section {
      height: 50vw;
      max-height: 400px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position-y: 50%;
      background-image: url('/assets/img/member-activate-background.png');
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
      font-size: $font-size-20;
      color: $color-dark-gray;
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
  import {Component} from 'vue-property-decorator';
  import {UserInfoModel} from "../../shared/api/user.model";
  import {refreshUserInfo, getUserInfoCache, getUserDetailInfo} from "../../shared/api/user.api";
  import {form} from '../../shared/form';
  import {showTips} from "../../store/tip";
  import {activateMember} from "../../shared/api/member.api";
  import {Store} from "../../shared/utils/store";
  import {getRelativePath} from '../../shared/utils/utils';

  @Component({
    directives: form,
  })
  export default class ActivateComponent extends Vue {
    userInfo = getUserInfoCache();
    memberCode = '';
    wechatNumber = '';
    name = '';
    company = '';
    title = '';
    isSubmitting = false;

    async created() {
      let userDetailInfo;

      try {
        this.memberCode = this.$route.query['code'];
        userDetailInfo = await getUserDetailInfo();
      } catch (e) {
      }

      if (userDetailInfo) {
        if (userDetailInfo.company) this.company = userDetailInfo.company;
        if (userDetailInfo.realname) this.name = userDetailInfo.realname;
        if (userDetailInfo.position) this.title = userDetailInfo.position;
      }
    }

    validateAndSubmit() {
      this.$validator.validateScopes();

      if (this.$validator.errors.any()) return;

      this.submit();
    }

    async submit() {
      this.isSubmitting = true;
      showTips('激活会员中...');

      try {
        await activateMember(this.memberCode, this.wechatNumber, this.name, this.company, this.title);
        Store.memoryStore.delete('userInfo');
        await refreshUserInfo();
      } catch (e) {
        throw e;
      } finally {
        this.isSubmitting = false;
      }

      showTips('激活会员成功');
      this.$router.push({path: '/my/member'});
    }
  }
</script>
