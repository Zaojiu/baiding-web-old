<template>
  <div class="container">
    <div class="content">
      <div class="cover">
        <img style="width:100%;" src="https://og9s6vxbs.qnssl.com/memers/mars-intro.jpeg">
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
          font-size: $font-size-14;
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
      background-color: #BD2F14;
      color: #fff;
      font-size: $font-size-14;
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
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {PostOrderObject, OrderObjectType} from "../../shared/api/order.model";
  import {isInApp} from "../../shared/utils/utils";
  import {checkOrderFee} from "../../shared/api/order.api";

  @Component
  export default class IntroMarsComponent extends Vue {
    userInfo: UserInfoModel|null = null;
    fee = new Money(1000000);
    memberOrderObject = new PostOrderObject('member-mars', OrderObjectType.Member, 1); // hardcode temporary

    created() {
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
      }
    }

    get btnText(): string {
      let text: string;
      console.log(this.userInfo);
      if (this.userInfo && this.userInfo.isMember && this.userInfo.member.memberId === 'member-mars') {
        text = '已是火星会员，查看我的权益';
      } else {
        text = `购买造就火星会员 ${this.fee.toYuan('', '元/2年')}`;
      }

      return text;
    }

    btnClick() {
      if (this.userInfo && this.userInfo.isMember && this.userInfo.member.memberId === 'member-mars') {
        this.goMyMember();
      } else {
        this.buy();
      }
    }

    goMyMember() {
      if(isInApp){
        this.$router.push({path: '/new-member/card?login=1'});
      }else{
        this.$router.push({path: '/new-member/card'});
      }
    }

    async buy() {
      if (!this.userInfo) {
        this.$router.push({path: '/signin', query: {redirectTo: `/member/intro`}});
        return;
      }

      if (this.userInfo.isMember && this.userInfo.member.memberId === 'member-mars') return;

      this.$router.push({
        path: '/orders',
        query: {items: encodeURIComponent(JSON.stringify([this.memberOrderObject]))}
      });
    }
  }
</script>

#BD2F14
