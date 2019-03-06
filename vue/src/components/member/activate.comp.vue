<template>
  <div class="member-activate">
    <div class="main-content">
      <div class="cover">
        <img src="https://baiding-pub.zaojiu.com/member/member-one.png" alt="会员卡">
      </div>

      <div class="top-section">
        <form class="main-form" name="form" @submit.prevent="validateAndSubmit()" v-focus-first-invalid>
          <section class="form-section">
            <div class="form-group-new" :class="{'has-error': errors.has('memberCode')}">
              <div class="input-group">
                <input
                  name="memberCode"
                  v-model="memberCode"
                  v-validate="{rules: {required: true}}"
                  v-focus
                  v-has-value
                  placeholder="会员卡号"
                >
              </div>
              <p class="helper error" v-if="errors.first('memberCode:required')">请填写会员卡号</p>
            </div>

            <div class="form-group-new"
                 :class="{'has-error': errors.has('name')}">
              <div class="input-group">
                <input
                  name="name"
                  v-model="name"
                  v-validate="{rules: {required: true}}"
                  v-has-value
                  placeholder="姓名"
                >
              </div>
              <p class="helper error" v-if="errors.first('name:required')">请填写姓名</p>
            </div>

            <div class="form-group-new"
                 :class="{'has-error': errors.has('company')}">
              <div class="input-group">
                <input
                  name="company"
                  v-model="company"
                  v-validate="{rules: {required: true}}"
                  v-has-value
                  placeholder="公司名称"
                >
              </div>
              <p class="helper error" v-if="errors.first('company:required')">请填写公司名称</p>
            </div>

            <div class="form-group-new"
                 :class="{'has-error': errors.has('title')}">
              <div class="input-group">
                <input
                  name="title"
                  v-model="title"
                  v-validate="{rules: {required: true}}"
                  v-has-value
                  placeholder="职位"
                >
              </div>
              <p class="helper error" v-if="errors.first('title:required')">请填写职位</p>
            </div>
          </section>
        </form>
      </div>
    </div>
    <section class="footer-section">
      <div class="footer">
        <button @click.prevent="validateAndSubmit" :disabled="isSubmitting">{{!isSubmitting ? '激活会员卡' : '激活中...'}}
        </button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .member-activate {
    background-color: rgb(26, 26, 26);

    .main-content {
      padding: 24px 20px 0 20px;
      height: calc(100vh - 75px);
      overflow: auto;
      .top-section {
        padding-bottom: 20px;
      }

      .cover {
        position: relative;

        &:before {
          content: "";
          display: block;
          padding-top: 56.2%;
        }

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          object-fit: cover;
        }
      }
    }

    .footer-section {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 0 15px;
      height: 75px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgb(36, 36, 36);
      box-shadow: 0px -2px 4px rgba(0, 0, 0, .5);

      .footer {
        margin: 0;
        width: 100%;
        button {
          font-size: 18px;
          color: #fff;
          line-height: 25px;
          padding: 11px 0;
          font-weight: bold;
          background: linear-gradient(rgba(204, 169, 104, 1), rgba(154, 120, 58, 1));
          width: 100%;
          border-radius: 4px;
        }
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
    //edit by ywz for 会员激活页不需要输入微信号
    wechatNumber = 'wechat';
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
        let userInfo = await refreshUserInfo();
        showTips('激活会员成功');
        if (userInfo.member.valid) {
          this.$router.push({path: '/new-member/card'});
        } else {
          this.$router.push({path: '/new-member/video'});
        }
      } catch (e) {
        throw e;
      } finally {
        this.isSubmitting = false;
      }
    }
  }
</script>
