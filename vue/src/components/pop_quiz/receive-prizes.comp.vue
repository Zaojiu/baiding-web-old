<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else>
      <article class="form-content" v-if="id==='info'">
        <h2>填写信息领取奖品</h2>
        <form name="postComment" class="form" @submit.prevent="validateAndSubmit()" v-focus-first-invalid>

          <div class="my-form-group" :class="{'has-error': errors.has('name')}">
            <div class="input-group">
              <label class="required">姓名:</label>
              <input
                name="name"
                v-model="name"
                v-validate="{rules: {required: true}}"
                v-has-value
              >
            </div>
            <p class="helper error" v-if="errors.first('name:required')">请填写姓名</p>
          </div>

          <div class="my-form-group" :class="{'has-error': errors.has('mobile')}">
            <div class="input-group">
              <label class="required">手机:</label>
              <input
                name="mobile"
                v-model="mobile"
                v-validate="{rules: {required: true,regex: regexpMobile}}"
                v-has-value
              >
            </div>
            <p class="helper error" v-if="errors.first('mobile:required')">请填写手机号吗</p>
            <p class="helper error" v-else-if="errors.first('mobile:regex')">手机号码格式错误，请重新填写</p>
          </div>

          <div class="my-form-group" :class="{'has-error': errors.has('address')}">
            <div class="input-group">
              <label class="required">地址:</label>
              <input
                name="address"
                v-model="address"
                v-validate="{rules: {required: true}}"
                v-has-value
              >
            </div>
            <p class="helper error" v-if="errors.first('address:required')">请填写收货地址</p>
          </div>

          <div class="submit">
            <button>提交</button>
          </div>
          <p class="tips">收到资料后，我们会尽快把奖品寄出</p>
        </form>
      </article>
      <article v-if="id==='member'" class="active-member">
        <div class="content">
          <h2>会员激活码</h2>
          <h2>{{memberNo}}</h2>
          <p>· 恭喜你，获得星际能量之造就会员体验卡。使用造就会员体验卡获得一个月的会员权益。</p>
          <p>· 有效期内和造就会员享有同样权益，每人限用一张。已是会员的同学，可增加一个月的权益。</p>
          <p>· 赠送好友，好东西值得分享。</p>
          <p>· 未来登上火星月球的你，别忘了在这里开启好奇心大门。</p>
          <button class="active" @click="goToActiveMember">立即激活</button>
          <button class="more" @click="goToMember">了解造就会员</button>
        </div>
      </article>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    background-color: rgb(22, 27, 60);
    height: 100vh;
    position: absolute;
    width: 100%;
    z-index: 3;
    top: 0;

    .active-member {
      padding: 20px;

      .content {
        border: 2px solid rgb(214, 173, 96);
        height: calc(100vh - 40px);
        overflow: auto;
        border-radius: 12px;
        text-align: center;
        padding: 28px 20px 40px 20px;
        color: rgb(214, 173, 96);
        background-color: rgba(0, 0, 0, 0.3);

        h2 {
          font-size: 28px;
          line-height: 28px;
          &:nth-child(2) {
            margin-top: 8px;
            margin-bottom: 28px;
          }
        }
        p {
          text-align: left;
          font-size: 14px;
          line-height: 26px;
        }

        button {
          height: 50px;
          border-radius: 25px;
          width: 100%;
          font-size: 18px;
        }

        .active {
          margin-top: 93px;
          color: rgba(255, 255, 255, .87);
          background: linear-gradient(90deg, rgb(154, 120, 58), rgb(204, 169, 104));
        }

        .more {
          margin-top: 28px;
          border: 1px solid rgb(154, 120, 58);
          color: rgb(154, 120, 58);
        }
      }
    }

    .form-content {
      h2 {
        margin-top: 24px;
        margin-bottom: 32px;
        text-align: center;
        font-size: 24px;
        line-height: 33px;
        color: rgb(255, 255, 255);
      }

      .my-form-group {
        width: calc(100% - 84px);
        margin: 0 auto 28px auto;
        height: 50px;
        line-height: 50px;
        border-radius: 27px;
        background-color: rgba(255, 255, 255, .3);

        &:hover {
          border: 1px solid #fff;
        }

        label {
          padding: 0 20px;
          font-size: 18px;
          line-height: 18px;
          color: rgba(255, 255, 255, .8);
        }

        input {
          font-size: 18px;
          line-height: 18px;
          color: #fff;
          background-color: hsl(231, 12%, 41%);
          border: none;
          appearance: none;
          outline: none;
        }
        .error {
          line-height: 2em;
          color: yellow;
          padding-left: 20px;
        }

      }

      .submit {
        text-align: center;
        button {
          width: calc(100% - 84px);
          height: 50px;
          border-radius: 25px;
          background-color: rgb(253, 241, 126);
          font-size: 18px;
        }
      }

      .tips {
        text-align: center;
        font-size: 14px;
        line-height: 14px;
        color: rgba(255, 255, 255, .5);
        margin-top: 16px;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {setTitle} from '../../shared/utils/title';
  import {postAddress} from '../../shared/api/pop_quiz.api'
  import {form} from '../../shared/form';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model'
  import {regexpMobile} from '../../shared/utils/utils';
  import {showTips} from '../../store/tip';
  import {params} from "../../shared/utils/utils";
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';
  import {isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";

  @Component({
    directives: form
  })
  export default class Index extends Vue {
    isLoading = false;
    isError = false;
    userInfo: UserInfoModel;
    chance = 0;
    id = '';
    name = '';
    mobile = '';
    address = '';
    memberNo = '';
    regexpMobile = regexpMobile;

    created() {
      this.id = this.$route.params['id'];
      this.userInfo = getUserInfoCache(true);
      this.initData();
    }

    async initData() {

      if (isInWechat) {
        await initWechat();
        setShareInfo('造就题先生',
          '星球登陆战，答题赢大奖，等你来战！',
          '',
          `${host.self}/wv/pop_quiz?uid=${this.userInfo.uid}`);
      }

      switch (this.id) {
        case 'member':
          setTitle('激活会员卡');
          this.memberNo = this.$route.query['memberNo'];
          break;
        case 'info':
          setTitle('');
          break;
        default:
      }
    }

    goToMember() {
      this.$router.push({path: '/new-member/action'});
    }

    goToActiveMember() {
      this.$router.push({path: `/member/activate?${params({code: this.memberNo})}`});
    }

    validateAndSubmit() {
      this.$validator.validateScopes();

      if (this.$validator.errors.any()) return;

      this.submit();
    }

    async submit() {
      try {
        await postAddress(this.name, this.address, this.mobile);
        showTips('提交成功！');
        this.$router.push({path: '/wv/pop_quiz'});

      } catch (e) {
        // todo 错误
        showTips('提交失败！请重试');
      }

    }

  }
</script>

