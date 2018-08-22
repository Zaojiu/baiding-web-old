<template>
  <div class="member-card">
    <div v-for="item in listImg" class="image-cover">
      <img :src="item"/>
    </div>
    <div v-if="rights.length>0" class="discount">
      <h3>优惠券</h3>
      <p v-for="right in rights">{{right.title}} {{right.availableAmount||0}}张</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .member-card {
    color: #fff;
    overflow: hidden;
    padding-top: 24px;

    .discount {
      color: #fff;
      h3 {
        padding: 15px 0;
      }
      p {
        margin: 8px 0;
        font-size: 14px;
        line-height: 14px;
        color: #fff;
      }
    }

    .image-cover {
      font-size: 0;
      img {
        width: 100%;
      }
      & + .image-cover {
        margin-top: 32px;
      }
    }
    ul {
      margin-top: 12px;
      li {
        padding: 12px 0 0 0;
        font-size: 15px;
        line-height: 24px;
        color: rgb(217, 217, 217);
        font-weight: bold;
        .dot {
          display: inline-block;
          height: 8px;
          width: 8px;
          border-radius: 4px;
          background-color: rgb(217, 217, 217);
          margin-right: 8px;
        }
        span {
          vertical-align: middle;
        }
      }
    }
    .gold-btn {
      margin-top: 24px;
      width: 144px;
      font-size: 14px;
      padding: 5px 0;
      text-align: center;
      border: 1px solid rgb(214, 173, 96);
      border-radius: 4px;
      color: rgb(214, 173, 96);
      box-sizing: border-box;
      position: relative;
      .bi {
        font-size: 16px;
        vertical-align: sub;
        padding-left: 6px;
      }
      &:after {
        display: block;
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        width: 144px;
        height: 32px;
        background: linear-gradient(90deg, rgba(0, 0, 0, .1), rgba(0, 0, 0, 0.6));
        border-radius: 4px;
      }
    }
    p {
      margin: 12px 0;
      color: rgb(128, 128, 128);
      font-size: 13px;
      line-height: 16px;
    }
    .ps {
      color: #d6ad60;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {isInApp} from "../../shared/utils/utils";
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {listMemberRights} from '../../shared/api/member.api';
  import {MemberRight} from "../../shared/api/member.model";

  @Component({})
  export default class Action extends Vue {
    isInApp: boolean = isInApp;
    listText: string[] = [];
    listImg: string[] = [];
    defaultCover = 'assets/img/default-cover.jpg';
    userInfo: UserInfoModel;
    rights: MemberRight[] = [];
    memberType = 0;//0普通会员，1火星会员

    created() {
      this.init();
    }

    async init() {
      this.userInfo = getUserInfoCache(false);
      this.rights = await listMemberRights();
      if (this.userInfo.member.memberId && this.userInfo.member.memberId === 'member-mars') {
        // 火星会员
        this.memberType = 1;
        this.listImg = [
          'https://og9s6vxbs.qnssl.com/members/mars-member-card.png'
        ];
      } else {
        // 普通会员
        this.listImg = [
          'https://og9s6vxbs.qnssl.com/member/member-one.png'
        ];
      }
      this.isInApp = isInApp;
    }

  }
</script>
