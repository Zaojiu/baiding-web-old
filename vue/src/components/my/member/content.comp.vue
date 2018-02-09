<template>
  <div class="member-card">
    <div v-for="item in listImg" class="image-cover" @click="actionImgCover()">
      <img :src="item"/>
    </div>
    <ul v-if="listText.length">
      <li v-for=" text in listText "><span class="dot"></span><span v-html="text"></span></li>
    </ul>
    <div v-if="showVideoBtn" class="gold-btn" @click="goToVideo()">
      <span>查看专属视频</span><i class="bi bi-member-video-enter"></i>
    </div>
    <p v-if="showRemarks">注：会员九折优惠和现金券福利不可同享</p>
    <p class="ps" v-if="isMember">您是造就会员，欢迎回来</p>
    <p v-else class="ps">您还不是造就会员</p>
  </div>
</template>

<style lang="scss" scoped>
  .member-card {
    color: #fff;
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
  import {initIOS, callHandler} from "../../../shared/utils/ios";
  import {isInApp} from "../../../shared/utils/utils";

  @Component({
    props: ['isMember'],
  })
  export default class Action extends Vue {
    isInApp: boolean = isInApp;
    listText: string[] = [];
    listImg: string[] = [];
    showVideoBtn: boolean;
    showRemarks: boolean;
    inTab = 1;
    defaultCover = 'assets/img/default-cover.jpg';

    created() {
      this.showVideoBtn = false;
      this.init();
    }

    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    init() {
      this.isInApp = isInApp;
      this.showRemarks = false;
      this.showVideoBtn = false;
      switch (this.$route.name) {
        case "new-member.card":
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-one.png',
            'https://og9s6vxbs.qnssl.com/member/member-two.png'
          ];
          this.listText = [];
          this.inTab = 0;
          break;
        case "new-member.action":
          this.showRemarks = true;
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-action.png'
          ];
          this.listText = [
            '线上福利:<br/>' +
            '享有全年52场线上专题Talk<br/>' +
            '500个会员专属视频<br/>' +
            '专享深度访谈及幕后花絮<br/>' +
            '在线课程的持续更新<br/>' +
            '近千个演讲视频及嘉宾演讲PPT<br/>' +
            '五折购买在线 “大师课程”<br/>',
            '线下福利:<br/>' +
            '优先优惠购票<br/>' +
            '会员专属座位<br/>' +
            '优先参与小型线下沙龙<br/>' +
            '优先购买衍生品及演讲者书籍'
          ];
          this.inTab = 1;
          break;
        case "new-member.video":
          this.showVideoBtn = true;
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-only-video.png'
          ];
          this.listText = [
            '500场精心剪辑的高清演讲视频',
            '专享演讲者深度访谈及幕后花絮'
          ];
          this.inTab = 2;
          break;
        case "new-member.course":
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/online-class.png'
          ];
          this.listText = [
            '『造就UNI』在线课程第一期课堂：《数据的本质》在线课程 （每月持续更新）',
            '五折购买在线《大师之课》'
          ];
          this.inTab = 3;
          break;
        case "new-member.download":
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-download.png'
          ];
          this.listText = [
            '可订阅并下载近千个专属演讲视频',
            '可下载收藏500多个造就演讲PPT'
          ];
          this.inTab = 4;
          break;
        default:
      }
    }

    actionImgCover() {
      // 在线课程跳转到课程
      if (this.inTab === 3) {
        this.$router.push({path: '/columns/5a5f080551281300015d4449'});
      }
    };

    async goToVideo() {
      if (this.isInApp) {
        await initIOS();
        callHandler('pushMemberVideo', '');
      } else {
        this.$router.push({path: '/member/video'});
      }
    }
  }
</script>
