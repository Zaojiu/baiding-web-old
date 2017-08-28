<template>
  <div class="container">
    <div class="content">
      <header>
        <img class="avatar avatar-round avatar-lg" v-bind:src="userInfo.avatar" alt="用户头像">
      </header>
      <div class="date"></div>
      <div class="tips">欢迎加入造就会员</div>
      <div class="rights" v-for="right in rights">
        <div class="title">{{right.title}}</div>
        <div class="desc">{{right.desc}}</div>
        <div class="used" v-if="right.totalAmount">可用权益：{{right.availableAmount}}/{{right.totalAmount}}</div>
        <button class="button button-dark-blue" @click="gotoRight(right.id)">查看详情</button>
      </div>
    </div>
    <footer>
      <button class="button button-primary" @click="activate()" v-if="!userInfo.member.valid">实体卡激活</button>
      <button class="button button-dark-blue" @click="buy()">{{buyBtnText}}</button>
    </footer>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .content {
      flex-grow: 1;
      overflow: auto;

      .cover {
        width: 100%;
        height: auto;
      }
    }

    .button {
      flex-shrink: 0;
      border-radius: 0;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Money} from '../../shared/utils/utils';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {listMemberRights} from '../../shared/api/member.api';
  import {MemberRight} from "../../shared/api/member.model";

  @Component
  export default class MemberComponent extends Vue {
    userInfo = getUserInfoCache();
    fee = new Money(49900);
    isLoading = false;
    rights: MemberRight[] = [];

    created() {
      this.initData();
    }

    async initData() {
      this.isLoading = true;
      this.rights = await listMemberRights();
      this.isLoading = false;
    }

    get buyBtnText(): string {
      let text: string;

      if (this.userInfo.isMember) {
        text = '续费会员';
      } else {
        text = `购买会员 ${this.fee.toYuan('', '元/年')}`;
      }

      return text;
    }

    buy() {
      this.$router.push({path: '/order', query: {items: 'dsdsdsdsd'}});
    }

    activate() {
      this.$router.push({path: '/member/activate'});
    }

    gotoRight(id: string) {
      this.$router.push({path: `/my/member/rights/${id}`});
    }
  }
</script>
