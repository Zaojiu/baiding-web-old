<template>
  <div class="container">
    <div class="content">
      <img class="cover" src="/assets/img/default-cover.jpg" alt="会员头图">
      <h2 class="title">会员权益</h2>
      <ol class="list">
        <li>您可免费参加6次“造就Talk”线下演讲，并获得会员专享的优先坐席，更有机会与演讲嘉宾小范围面对面交流。</li>
        <li>您将获得4本由造就为您精心挑选的畅销书籍，让好书陪你度过春夏秋冬。</li>
        <li>您将享受9折会员价购买造就正价收费产品。</li>
        <li>您将优先获得“在线大师课程”的体验机会。</li>
      </ol>
    </div>
    <button class="button button-dark-blue" @click="goMyMember()">{{btnText}}</button>
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

  @Component
  export default class IntroComponent extends Vue {
    userInfo = getUserInfoCache();
    fee = new Money(49900);

    get btnText(): string {
      let text: string;

      if (this.userInfo.isMember) {
        text = '已是会员，查看我的权益';
      } else {
        text = `购买造就会员 ${this.fee.toYuan('', '元/年')}`;
      }

      return text;
    }

    goMyMember() {
      this.$router.push({path: '/my/member'});
    }
  }
</script>
