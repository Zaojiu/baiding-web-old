<template>
  <nav class="top-nav" v-if="!isInApp">
    <i class="bi bi-zaojiu-logo"></i>
    <a class="link" href="" v-if="userInfo" @click.prevent="gotoMy()">
      <img class="avatar avatar-round" :src="userInfo.avatar" alt="用户头像">个人中心
    </a>
  </nav>
</template>

<style lang="scss">
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    background-color: $color-w;
    border-bottom: solid 1px $color-gray4;

    .bi-zaojiu-logo {
      font-size: 26px;
      color: $color-dark-gray;
    }

    .link {
      display: flex;
      align-items: center;
      font-size: $font-size-14;
      color: $color-dark-gray;

      .avatar {
        height: 24px;
        width: 24px;
        margin-right: 8px;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {getUserInfoCache} from './api/user.api';
  import {UserInfoModel} from "./api/user.model";
  import {isInApp} from './utils/utils';

  @Component
  export default class TopNavComponent extends Vue {
    isInApp = isInApp;

    get userInfo(): UserInfoModel|null {
      let userInfo: UserInfoModel;

      try {
        userInfo = getUserInfoCache(false);
      } catch (e) {
        return null;
      }

      return userInfo;
    }

    gotoMy() {
      this.$router.push({path: '/my'});
    }
  }
</script>
