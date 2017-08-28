<template>
  <div class="container">

  </div>
</template>

<style lang="scss" scoped>
  .container {

  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Money} from '../../shared/utils/utils';
  import {getUserInfoCache} from "../../shared/api/user.api";

  @Component
  export default class OrderComponent extends Vue {
    userInfo = getUserInfoCache();
    fee = new Money(49900);

    get btnText(): string {
      let text: string;

      if (this.userInfo.isMember) {
        text = '已是会员，查看我我的权益';
      } else {
        text = `购买造就会员 ${this.fee.toYuan('', '元/年')}`;
      }

      return text;
    }

    submit() {

    }

    popupCouponSelector() {

    }

    closeCouponSelector() {

    }

    addCoupon() {

    }

    deleteCoupon() {

    }
  }
</script>
