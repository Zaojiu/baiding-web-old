<template>
  <div class="container">
    <img class="avatar-lg avatar-round avatar" :src="userInfo.avatar" alt="用户头像">
    <div class="nick">{{userInfo.nick}}</div>

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
        我的会员
      </div>
      <i class="bi bi-right-arrow"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    background-color: #fafafa;
    overflow: hidden;

    .avatar {
      display: block;
      margin: 40px auto 0;
    }

    .nick {
      color: $color-dark-gray;
      font-size: $font-size-md;
      text-align: center;
      margin: 15px 0 40px;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import {getUserInfoCache} from '../../shared/api/user.api';

  @Component
  export default class MyComponent extends Vue {
    userInfo = getUserInfoCache();

    gotoMyTicket() {
      this.$router.push({path: '/my/tickets'});
    }

    gotoMyOrder() {
      this.$router.push({path: '/my/orders'});
    }

    gotoMyMember() {
      this.$router.push({path: '/my/member'});
    }
  }
</script>
