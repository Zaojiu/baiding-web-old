<template>
  <div class="container">
    <top-nav></top-nav>

    <header>
      <img class="avatar avatar-round" :src="userInfo.avatar" alt="用户头像">
      <div class="nick">{{userInfo.nick}}</div>
    </header>
    <div class="date" v-if="userInfo.isMember">
      <div class="inner"></div>
      <div class="background" :style="{width: progressWidthPrecent + '%'}"></div>
      <div class="text">
        会员有效期: {{userInfo.member.joinAt.format('YYYY年MM月DD日')}}-{{userInfo.member.expiredAt.format('YYYY年MM月DD日')}}
      </div>
    </div>
    <div class="rights">
      <div class="right" v-for="right in rights">
        <i class="bi bi-member-right-book" v-if="right.isTypeBook"></i>
        <i class="bi bi-member-right-video" v-else-if="right.isTypeEvent"></i>
        <i class="bi bi-member-right-discount" v-else-if="right.isTypeNormalDiscount"></i>
        <div class="title" @click.prevent="userInfo.member.valid ? gotoRight(right.id) : true">{{right.title}}</div>
        <div class="detail" v-if="userInfo.member.valid">
          <div class="amount">可用权益：<span v-if="right.totalAmount">{{right.availableAmount}}/{{right.totalAmount}}</span><span
            v-else>0</span></div>
          <a class="detail-link" href="" @click.prevent="gotoRight(right.id)">查看详情</a>
        </div>
        <div class="desc" v-if="right.desc">{{right.desc}}</div>
      </div>
    </div>
    <footer>
      <a class="activate-link" href="" @click.prevent="activate()" v-if="!userInfo.isMember&&!isApp">使用激活码开通会员权限</a>
      <button class="buy-button" @click="goIntro()" v-if="!userInfo.isMember&&!isApp">{{buyBtnText}}</button>
      <a class="intro-link" href="" @click.prevent="goIntro()" v-if="!isApp">会员权益说明</a>
    </footer>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    overflow: hidden;

    header {
      background-image: url('/assets/img/my-member-cover.png');
      background-size: 100% 100%;
      text-align: center;
      height: 50vw;
      padding-top: 26px;

      .avatar {
        display: block;
        height: 67px;
        width: 67px;
        object-fit: cover;
        margin: 0 auto;
      }

      .nick {
        margin-top: 5px;
        font-size: $font-size-14;
        color: $color-w;
        font-weight: bold;
      }
    }

    .date {
      position: relative;
      height: 18px;
      padding: 2px;
      border: solid 1px #909090;
      border-radius: 9px;
      display: flex;
      margin: 10px 35px 19px;

      .inner {
        border-radius: 7px;
        background-color: #909090;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
      }

      .background {
        position: absolute;
        right: 2px;
        border-radius: 7px;
        background-color: #16178c;
        height: 12px;
      }

      .text {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        text-align: center;
        font-size: $font-size-12;
        color: $color-w;
        transform: scale(.78);
      }
    }

    .date + .rights {
      .right:first-child {
        margin-top: 0;
      }
    }

    .right {
      position: relative;
      margin: 20px 35px;
      padding-left: 45px;

      &:first-child {
        margin-top: 40px;
      }

      &:last-child {
        margin-bottom: 40px;
      }

      .bi {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 37px;
        color: #16178c;
      }

      .title {
        padding-left: 15px;
        padding-bottom: 5px;
        border-bottom: solid 1px #aaaaaa;
        font-size: $font-size-16;
        color: #16178c;
        line-height: 1em;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .detail {
        display: flex;
        justify-content: space-between;
        padding-left: 15px;
        padding-top: 8px;

        .amount, .detail-link {
          font-size: $font-size-12;
          color: #16178c;
        }
      }

      .desc {
        margin-top: 10px;
        padding-left: 15px;
        font-size: $font-size-12;
        color: #666666;
        word-break: break-all;
        white-space: pre-wrap;
        line-height: 1.5em;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    footer {
      display: flex;
      flex-direction: column;
      align-items: center;

      .activate-link {
        font-size: $font-size-12;
        color: #16178c;
      }

      .buy-button {
        position: relative;
        background-color: #16178c;
        height: 30px;
        line-height: 30px;
        color: #00ebd8;
        font-size: $font-size-12;
        border-radius: 15px;
        padding: 0 20px;
        margin-top: 24px;

        &:before {
          position: absolute;
          width: calc(100% + 6px);
          height: calc(100% + 6px);
          content: '';
          left: 0;
          top: 0;
          transform: translateX(-4px) translateY(-4px);
          border: solid 1px #16178c;
          border-radius: calc(15px + 6px);
        }
      }

      .intro-link {
        font-size: $font-size-14;
        color: #a4a4a7;
        transform: scale(.83333);
        margin-top: 40px;
        margin-bottom: 21px;

        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {Money,isInApp} from '../../shared/utils/utils';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {listMemberRights} from '../../shared/api/member.api';
  import {MemberRight} from "../../shared/api/member.model";
  import {PostOrderObject, OrderObjectType} from "../../shared/api/order.model";
  import {checkOrderFee} from "../../shared/api/order.api";

  @Component
  export default class MemberComponent extends Vue {
    userInfo = getUserInfoCache();
    fee = new Money(49800);
    isLoading = false;
    rights: MemberRight[] = [];
    memberOrderObject = new PostOrderObject('member-year', OrderObjectType.Member, 1); // hardcode temporary
    isApp = isInApp;//判断是否在app环境

    get buyBtnText(): string {
      let text: string;

      if (this.userInfo.isMember) {
        text = '续费造就会员';
      } else {
        text = `购买造就会员 ${this.fee.toYuan('', '元/年')}`;
      }

      return text;
    }

    get progressWidthPrecent(): number {
      const percent = moment().diff(this.userInfo.member.joinAt) / this.userInfo.member.expiredAt.diff(this.userInfo.member.joinAt);
      return Math.round(percent * 100);
    }

    created() {
      this.initData();
    }

    async initData() {
      this.isLoading = true;
      this.rights = await listMemberRights();
      await this.getMemberFee();
      this.isLoading = false;
    }

    async getMemberFee() {
      const orderFee = await checkOrderFee([this.memberOrderObject]);
      this.fee = orderFee.totalPrice;
    }

    activate() {
      this.$router.push({path: '/member/activate'});
    }

    gotoRight(id: string) {
      this.$router.push({path: `/my/member/rights/${id}`});
    }

    goIntro() {
      this.$router.push({path: '/member/intro'});
    }
  }
</script>
