<template>
  <div class="member-card">
    <div v-for="item in listImg" class="image-cover">
      <img :src="item"/>
    </div>
    <ul v-if="listText.length">
      <li v-for=" text in listText "><span class="dot"></span><span>{{text}}</span></li>
    </ul>
    <div v-if="showVideoBtn && isMember" class="gold-btn" @click="goToVideo()">
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
            '享受早鸟优惠 9 折票价',
            '提前 1 至 3 天开放兑换和购买通道',
            '兑换或购买后获赠抵用现金券 （可微信或微博分享）'
          ];
          break;
        case "new-member.video":
          this.showVideoBtn = true;
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-only-video.png'
          ];
          this.listText = [
            '定期推送精选视频和音频，例如：闭门课程/会议，每月至少一次；嘉宾闭门专访，每月至少 2 次；活动花絮',
            'CEO 的季度分享',
            '免费观看造就 Now 直播（非会员收费 ¥9.9)'
          ];
          break;
        case "new-member.course":
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/online-class.png'
          ];
          this.listText = [
            '免费学习在线音频 2 节',
            '9 折优惠购买更多课程'
          ];
          break;
        case "new-member.download":
          this.listImg = [
            'https://og9s6vxbs.qnssl.com/member/member-download.png'
          ];
          this.listText = [
            '演讲视频下载，不包括精选视频',
            '演讲 PPT 下载',
            '演讲内容导读，总结和感受',
            '视觉素材（屏保，壁纸等)'
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
