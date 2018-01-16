<template>
  <div class="member-card">
    <div v-for="item in listImg" class="image-cover">
      <img :src="item"/>
    </div>
    <ul v-if="listText.length">
      <li v-for=" text in listText "><span class="dot"></span><span>{{text}}</span></li>
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
        span{
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
      .bi{
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
    .ps{
      color:#d6ad60;
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
          break;
        case "new-member.action":
          this.showRemarks = true;
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-action.png'
          ];
          this.listText = [
            '优先抢票',
            '优惠价购买所有正价商品'
          ];
          break;
        case "new-member.video":
          this.showVideoBtn = true;
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-only-video.png'
          ];
          this.listText = [
            '可观看精选演讲视频',
            '可观看CEO的季度分享视频',
            '免费观看造就NOW全年现场直播'
          ];
          break;
        case "new-member.course":
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/online-class.png'
          ];
          this.listText = [
            '免费观看《数据的本质》在线课程',
            '优惠购买更多在线「大师之课」'
          ];
          break;
        case "new-member.download":
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-download.png'
          ];
          this.listText = [
            '可下载演讲视频',
            '可下载演讲PPT'
          ];
          break;
        default:
      }
    }

    goToVideo = async () => {
      if (this.isInApp) {
        await initIOS();
        callHandler('pushMemberVideo', '');
      }
      return;
    }
  }
</script>
