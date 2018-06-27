<template>
  <div class="container">

    <div class="wechat-signin-container show" v-if="showWechatQrcode">
      <div class="qrcode-container">
        <div class="loading-container" :class="{show: $store.state.user.qrcodeUrl === undefined}">
          <bd-loading class="loading"></bd-loading>
          {{$t('m.signIn.qrcodeLoading')}}...
        </div>
        <div class="retry" v-if="isWechatQrcodeError">{{$t('m.signIn.qrcodeError')}}
          <a href="" @click.prevent="getQrcodeUrl()">{{$t('m.signIn.tryAgain')}}</a>
        </div>
        <iframe
          :class="{show: $store.state.user.qrcodeUrl}"
          :src="$store.state.user.qrcodeUrl"
          @error="isWechatQrcodeError = true"
          frameborder="0"
        ></iframe>
      </div>
      <a class="button button-primary" href="" @click.prevent="showWechatQrcode=false">{{$t('m.signIn.back')}}</a>
    </div>

    <img class="avatar-round avatar"
         :src="isLogin?userInfo.avatar:'https://og9s6vxbs.qnssl.com/default-user.png'"
         alt="用户头像">
    <div class="nick">{{isLogin?userInfo.nick:'未登录'}}</div>

    <div v-if="isLogin">
      <div class="clickable-block group-end" @click="gotoMyOrder()">
        <div class="title">
          <i class="bi bi-paper3"></i>
          我的订单
        </div>
        <i class="bi bi-right-arrow"></i>
      </div>

      <div class="clickable-block group-end" @click="gotoMyTicket()">
        <div class="title">
          <i class="bi bi-ticket"></i>
          我的票券
        </div>
        <i class="bi bi-right-arrow"></i>
      </div>

      <div class="clickable-block group-end" @click="gotoMyMember()">
        <div class="title">
          <i class="bi bi-people2"></i>
          会员
        </div>
        <i class="bi bi-right-arrow"></i>
      </div>

      <div class="login-out" @click="loginOut()">
        切换账号
      </div>
    </div>

    <div class="login" v-if="!isLogin">
      <div class="clickable-block group-end" @click="loginByMobile()">
        <div class="title">
          <i class="bi bi-people2"></i>
          手机号登录
        </div>
        <i class="bi bi-right-arrow"></i>
      </div>

      <div class="clickable-block group-end" @click="loginByWechat()">
        <div class="title">
          <i class="bi bi-wechat2"></i>
          微信登录
        </div>
        <i class="bi bi-right-arrow"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    background-color: #fafafa;
    overflow: hidden;

    .wechat-signin-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
      transition: opacity .3s;
      background-color: #fff;

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

    .avatar {
      display: block;
      width: 100px;
      height: 100px;
      margin: 40px auto 0;
    }

    .nick {
      color: $color-dark-gray;
      font-size: $font-size-16;
      text-align: center;
      margin: 15px 0 40px;
    }

    .login-out {
      text-align: center;
      padding: 12px;
      background-color: red;
      color: #fff;
      font-weight: 700;
      width: 90%;
      margin: 30px auto 0 auto;
      border-radius: 4px;
    }
    .login {
      margin-top: 30px;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache, signOut} from '../../shared/api/user.api';
  import {UserInfoModel} from '../../shared/api/user.model';
  import {showLoginPopUp} from '../../store/loginPopUp';
  import {isInWechat, isInApp} from '../../shared/utils/utils';
  import {wechatAuth} from '../../shared/utils/auth';
  import {host} from '../../env/environment';
  import {FETCH_SIGNIN_QRCODE} from '../../store/user';

  @Component
  export default class MyComponent extends Vue {
    userInfo: UserInfoModel | null;
    isLogin = true;
    isWechatQrcodeError = false;
    showWechatQrcode = false;

    created() {
      this.initData();
      this.getQrcodeUrl();
    }

    initData() {
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
        this.userInfo = null;
      } finally {
        this.isLogin = !!(this.userInfo && this.userInfo.uid);
      }
    }

    gotoMyTicket() {
      this.$router.push({path: '/my/tickets'});
    }

    gotoMyOrder() {
      this.$router.push({path: '/my/orders'});
    }

    gotoMyMember() {
      this.$router.push({path: '/new-member/action'});
    }

    async loginOut() {
      await signOut();
      this.initData();
    }

    loginByMobile() {
      showLoginPopUp();
    }

    loginByWechat() {
      if (isInWechat) {
        wechatAuth(`${host.self}${this.$route.fullPath}`);
      } else if (!isInWechat && !isInApp) {
        //微信登录二维码
        this.showWechatQrcode = true;
      }
    }

    async getQrcodeUrl() {
      this.isWechatQrcodeError = false;
      const success = await this.$store.dispatch(FETCH_SIGNIN_QRCODE, `${host.self}${this.$route.fullPath}`);
      this.isWechatQrcodeError = !success;
    }

  }
</script>
