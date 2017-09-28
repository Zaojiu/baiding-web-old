<template>
  <div class="container">
    <top-nav></top-nav>

    <div class="content">
      <div class="cover">
        <img src="/assets/img/member-intro-cover.png" alt="会员头图">
        <div class="tips">
          <small>造就会员</small>
          <div class="price">{{fee.toYuan('', '元/年', true, 0)}}</div>
        </div>
      </div>
      <div class="block">
        <h2 class="title">会员权益</h2>
        <ol class="list">
          <li>您可免费参加6次“造就Talk”线下演讲，并获得会员专享的优先坐席，更有机会与演讲嘉宾小范围面对面交流。</li>
          <li>您将获得4本由造就为您精心挑选的畅销书籍，让好书陪你度过春夏秋冬。</li>
          <li>您将享受9折会员价购买造就正价收费产品。</li>
          <li>您将优先获得“在线大师课程”的体验机会。</li>
        </ol>
      </div>

      <div class="block">
        <h2 class="title">会员须知</h2>
        <ol class="list">
          <li>购买之日起自动开通会员身份有效期为一年。</li>
          <li>有效期内可随时续费延长您的会员身份。</li>
          <li>会员身份将与您的手机号一对一绑定。</li>
          <li>我们将不断增加更多有意思的权益和体验给到会员。</li>
        </ol>
      </div>
    </div>
    <button class="button button-primary" @click="btnClick()">{{btnText}}</button>
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
        position: relative;

        &:before {
          display: block;
          padding-top: 45.3%;
          content: '';
        }

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .tips {
          position: absolute;
          bottom: 22px;
          left: 16px;
          color: $color-w;
          font-size: 13px;
          line-height: 1em;
          font-weight: bold;

          .price {
            margin-top: 11px;
            padding: 7px 6px 6px 3px;
            font-size: 17px;
            border: solid 1px $color-w;
          }
        }
      }

      .block {
        position: relative;
        margin: 15px;
        padding: 15px;
        background-color: #686bb2;

        &:before {
          content: '';
          position: absolute;
          height: 0;
          width: 0;
          right: -1px;
          top: -1px;
          border: solid 12px $color-w;
          border-left-color: transparent;
          border-bottom-color: transparent;
        }

        .title, ol {
          font-size: $font-size-sm;
          color: $color-w;
        }

        .title {
          line-height: 1em;
          font-weight: bold;
          margin-bottom: 10px;
        }

        ol {
          padding-left: 15px;
          line-height: 1.45em;
        }
      }
    }

    .button {
      position: relative;
      flex-shrink: 0;
      border-radius: 0;
      height: 53px;
      line-height: 53px;
      background-color: #16178c;
      color: #01dfd3;
      font-size: $font-size-sm;
      font-weight: bold;

      &:before {
        content: '';
        position: absolute;
        height: 0;
        width: 0;
        left: 50%;
        top: -1px;
        transform: translateX(-50%);
        border: solid 10px $color-w;
        border-left-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {Money} from '../../shared/utils/utils';
  import {getUserInfo, getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {PostOrderObject, OrderObjectType} from "../../shared/api/order.model";
  import {checkOrderFee} from "../../shared/api/order.api";

  @Component
  export default class IntroComponent extends Vue {
    userInfo: UserInfoModel|null = null;
    fee = new Money(49800);
    memberOrderObject = new PostOrderObject('member-year', OrderObjectType.Member, 1); // hardcode temporary

    async created() {
      try {
        this.userInfo = await getUserInfo(false);
      } catch (e) {
      }
    }

    get btnText(): string {
      let text: string;

      if (this.userInfo && this.userInfo.isMember) {
        text = '已是会员，查看我的权益';
      } else {
        text = `购买造就会员 ${this.fee.toYuan('', '元/年')}`;
      }

      return text;
    }

    btnClick() {
      if (this.userInfo && this.userInfo.isMember) {
        this.goMyMember();
      } else {
        this.buy();
      }
    }

    goMyMember() {
      this.$router.push({path: '/my/member'});
    }

    async buy() {
      if (!this.userInfo) {
        this.userInfo = await getUserInfo();
        if (this.userInfo.isMember) return;
      }

      this.$router.push({
        path: '/orders',
        query: {items: encodeURIComponent(JSON.stringify([this.memberOrderObject]))}
      });
    }
  }
</script>
