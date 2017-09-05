<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="!right" @retry="initData()"></error>
    <div class="main" v-else>
      <i class="bi bi-close" @click="backToMyMember()"></i>
      <i class="bi bi-member-right-book" v-if="right.isTypeBook"></i>
      <i class="bi bi-member-right-video" v-else-if="right.isTypeEvent"></i>
      <i class="bi bi-member-right-discount" v-else-if="right.isTypeNormalDiscount"></i>

      <h1>{{right.title}}</h1>
      <div class="desc" v-if="right.desc">
        <h2>权益说明</h2>
        <div v-html="right.desc" v-once></div>
      </div>

      <div class="code-tabs">
        <div class="tabs">
          <div class="tab" :class="{activate: tabIndex === 0}" @click="tabIndex = 0">
            <h3>可用权益：<strong>{{right.availableAmount}}</strong></h3>
            <small>共获取过{{right.totalAmount}}次权益</small>
          </div>
          <div class="tab" :class="{activate: tabIndex === 1}" @click="tabIndex = 1">
            <h3>已使用权益：<strong>{{right.totalAmount - right.availableAmount}}</strong></h3>
            <small>共{{right.sharedAmount}}次权益被好友领取</small>
          </div>
        </div>

        <div class="codes" v-if="tabIndex === 0">
          <div class="content" v-for="code in unusedCodes">
            过期时间：{{code.expiredAt.format('YYYY-MM-DD')}}
          </div>
          <div class="content" v-if="!unusedCodes.length">暂无可用权益</div>
        </div>

        <div class="codes" v-if="tabIndex === 1">
          <div class="content" v-for="code in usedCodes">
            过期时间：{{code.usedAt.format('YYYY-MM-DD')}}
          </div>
          <div class="content" v-if="!usedCodes.length">暂无已用权益</div>
        </div>
      </div>

      <a class="member-intro-link" href="" @click.prevent="gotoMemberIntro()">会员权益说明</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $color-w;
    overflow: $color-w;

    .main {
      position: relative;
      overflow: hidden;

      .bi-close {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #16178c;
        font-size: 20px;
      }

      .bi-member-right-book, .bi-member-right-video, .bi-member-right-discount {
        display: flex;
        font-size: 62px;
        color: #16178c;
        margin: 35px auto 0;
      }

      h1 {
        font-size: $font-size-xsm;
        color: #16178c;
        margin-top: 10px;
        text-align: center;
      }

      .desc {
        position: relative;
        margin: 10px 17px 0;
        padding: 7px 17px;
        background-color: #16178c;

        &, h2 {
          font-size: $font-size-xsm;
          color: $color-w;
        }

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
      }

      .code-tabs {
        margin: 10px 17px 0;

        .tabs {
          height: 45px;
          display: flex;

          .tab {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            font-weight: bold;
            padding-left: 17px;
            background-color: #a4a4a7;
            flex-basis: 50%;

            h3 {
              color: #16178c;
              font-size: 13px;
              line-height: 1em;
              display: flex;
              align-items: center;
              white-space: nowrap;

              strong {
                font-size: 22px;
              }
            }

            small {
              font-size: $font-size-xsm;
              color: $color-w;
              margin-top: 2px;
              transform: scale(.9);
              transform-origin: left top;
              white-space: nowrap;
            }

            &.activate {
              background-color: #16178c;

              h3 {
                color: #00ebd8;
              }
            }

            &:last-child {
              padding-left: 37px;
            }

            &:first-child {
              position: relative;

              &.activate {
                &:before {
                  border-left-color: #16178c;
                }
              }

              &:before {
                position: absolute;
                content: '';
                top: 0;
                right: -44px;
                height: 0;
                width: 0;
                border: solid 22px #a4a4a7;
                border-top-color: transparent;
                border-bottom-color: transparent;
                border-right-color: transparent;
              }
            }
          }
        }

        .codes {
          border-top: solid 4px #16178c;

          .content {
            background-color: #eaeaf4;
            padding: 17px;
            font-size: 15px;
            color: #858590;
            font-weight: bold;
            line-height: 1.2em;
            margin-bottom: 3px;
          }
        }
      }

      .member-intro-link {
        display: block;
        margin-top: 44px;
        text-align: center;
        font-size: $font-size-sm;
        color: #a4a4a7;
        transform: scale(.83333);
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {getMemberRight, listMemberRightsCode} from '../../shared/api/member.api';
  import {MemberRight} from "../../shared/api/member.model";
  import {Discount} from "../../shared/api/order.model";

  @Component
  export default class MemberRightsComponent extends Vue {
    id = '';
    userInfo = getUserInfoCache();
    isLoading = false;
    unusedCodes: Discount[] = [];
    usedCodes: Discount[] = [];
    right: MemberRight|null = null;
    tabIndex = 0;

    created() {
      this.id = this.$route.params['id'];

      this.initData();
    }

    async initData() {
      this.isLoading = true;
      this.right = await getMemberRight(this.id);
      const codes = await listMemberRightsCode(this.id);
      this.unusedCodes = codes.filter((code) => !code.isStatusUsed);
      this.usedCodes = codes.filter((code) => code.isStatusUsed);
      this.isLoading = false;
    }

    backToMyMember() {
      this.$router.push({path: '/my/member'});
    }

    gotoMemberIntro() {
      this.$router.push({path: '/member/intro'});
    }
  }
</script>
