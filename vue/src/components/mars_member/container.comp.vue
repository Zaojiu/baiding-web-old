<template>
  <div class="member-activate">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>

  .member-activate {
    background-color: rgb(26, 26, 26);
    padding:24px 20px;
    overflow: hidden;
    height: 100vh;
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model'
  import {isInApp, isInWechat} from "../../shared/utils/utils";
  import {PostOrderObject, OrderObjectType} from "../../shared/api/order.model";

  @Component({})
  export default class MarsComponent extends Vue {

  }
</script>
