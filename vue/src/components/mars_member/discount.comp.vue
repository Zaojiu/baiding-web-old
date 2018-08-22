<template>
  <div class="content">
    <div class="member-card">
      <div class="image-cover">
        <Swiper/>
      </div>
      <div class="member-desc">
        <div class="desc">
          在2018年，我们邀请到的TALK演讲嘉宾包括：蔡康永，瑞达利欧，徐新， 青山周平，马岩松，王坚，克里斯·安德森，尼尔·弗格森，金培达，陈少琪等
          <br/>
          <br/>
          未来几个月，我们将会探讨“音乐之美”，“生活能不能慢一拍”，“人工智能”，“量化投资”， “真实的选择”，“全金属狂潮”，“众生基因”等等话题。
          <br/>
          <br/>
          欢迎您的加入，让我们一起开启全新的认知世界。
        </div>
        <h3>会员权益 线上福利：</h3>
        <p class="dot"><span class="cycle"></span>享有全年52场线上专题TALK</p>
        <p class="dot"><span class="cycle"></span>海量会员专属视频及深度访谈、幕后花絮</p>
        <p class="dot"><span class="cycle"></span>近千个嘉宾演讲PPT</p>
        <h3>会员权益 线下福利:</h3>
        <p class="dot"><span class="cycle"></span>全年任选24场TALK门票免费兑换</p>
        <p class="dot"><span class="cycle"></span>优先参与小型线下沙龙</p>
        <p class="dot"><span class="cycle"></span>优先购买衍生品及演讲者书籍</p>

        <h2>Q&A:</h2>
        <h4 class="margin16">1.我的造就会员有效期是多久？</h4>
        <p>造就会员时效为自购买之日起一年</p>

        <h4>2.会员每个月能够享受几场兑换福利？</h4>
        <p>会员一年能获得24张Talk门票兑换券，每月可收到2张兑换券，您可兑换任意场次。
          <br/>
          <br/>
          兑换券当月有效，不累计。
          <br/>
          <br/>
          兑换券将于购买后的第二日发放到您的个人账户中。
          <br/>
          <br/>
          兑换券可在微信公众号或者造就APP都可在个人账户中查看。<br/>
        </p>
        <p class="margin16">注：造就火星专场不列入兑换权益中。</p>

        <h4>3.怎样用兑换券兑换门票？</h4>
        <h5><span class="cycle gray"></span>造就APP兑换门票</h5>
        <p class="tap">
          1. 打开造就APP并点击“现场”板块
          <br/>
          <br/>
          2. 点击“购买门票”-点击“立即购买”—订单页面点击“选取优惠”—选取权益兑换券—点击“使用优惠”即可免费兑换。
        </p>
        <h5 class="margin32"><span class="cycle gray"></span>造就公众号兑换门票</h5>
        <p class="tap">
          1.进入造就会员-活动报名-选择要兑换的活动-点击“购买门票”-点击“立即购买”—订单页面点击“选取优惠”—选取权益兑换券—点击“使用优惠”即可免费兑换。
        </p>

        <h4>4.在北京、广州会不会有活动？</h4>
        <p>您好，是会有的。
          <br/>
          <br/>
          北京每月一场TALK，过去几个月，我们曾经探讨的主题有：“孤独·我们共同的隐秘”，“第三种智慧”，“人工智能”，“爆发式增长”，“超级航空—飞向更远的深空”等等。<br/><br/>
          广州深圳地区，每月会有一场TALK，我们曾经探讨的主题包括： “人间四月天”，“一个城市的想象力”，“破茧”，“溯源·我的城”，“EDU”教育与成长等等。<br/><br/>
          后续活动详细信息可以关注造就公众号（xingshu100）。
        </p>
        <h4>5.上海活动接下来排期是怎样的？</h4>
        <p>
          上海每个月至少会有2场的活动，您可关注造就公众号的推送内容，我们也会提前一个月将下个月的TALK主题和参会信息推送给您。<br/><br/>
          详细信息可以关注造就公众号（xingshu100）。
        </p>
        <h4>
          6.如何联系造就？
        </h4>
        <p>
          客服微信：可添加微信号（zaojiu6）<br/>
          客服邮箱：service@zaojiu.com
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    height: 100%;
    overflow: auto;
    padding: 24px 0 0 0;
  }

  .member-card {
    color: #fff;
    overflow: hidden;
    .image-cover {
      font-size: 0;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
      }
      & + .image-cover {
        margin-top: 32px;
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

    .member-desc {
      padding-bottom: 56px;
      color: rgb(217, 217, 217);

      .desc {
        font-size: 14px;
        line-height: 24px;
        margin-top: 24px;
        font-weight: 600;
        padding-bottom: 4px;
      }

      .margin16{
        margin-top: 16px;
      }

      .tap{
        padding-left: 17px;

      }

      .cycle {
        display: inline-block;
        height: 8px;
        width: 8px;
        border-radius: 4px;
        background-color: rgb(217, 217, 217);
        margin-right: 8px;
      }

      .dot{
        margin-top: 12px;
        font-weight: bold;
        font-size: 14px;
        line-height: 20px;
        color: rgb(217, 217, 217);
      }

      .gray{
        background-color: rgb(128, 128, 128);
      }

      .margin32{
        margin-top: 32px;
      }

      h2 {
        margin-top: 44px;
        font-size: 20px;
        line-height: 20px;
      }
      h3 {
        margin-top: 40px;
        font-size: 16px;
        line-height: 20px;
      }
      h4 {
        margin-top: 32px;
        font-size: 16px;
        line-height: 20px;
      }

      h5 {
        color: rgb(128, 128, 128);
        margin-top: 8px;
        font-size: 14px;
        line-height: 20px;
      }
      p {
        margin-top: 8px;
        color: rgb(128, 128, 128);
        font-size: 14px;
        line-height: 20px;
      }
      .tips{
        margin-top: 16px;
      }
    }


    .ps {
      color: #d6ad60;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component,} from 'vue-property-decorator';
  import {isInApp} from "../../shared/utils/utils";
  import Swiper from '../../shared/swiper.comp.vue';

  @Component({
    components: {
      Swiper: Swiper,
    }
  })
  export default class Discount extends Vue {
    isInApp: boolean = isInApp;
    listImg: string[] = [];
    inTab = 1;
    id = 'discount';
    defaultCover = 'assets/img/default-cover.jpg';

    created() {
      this.init();
    }

    init() {
      this.isInApp = isInApp;
      this.listImg = [
        'https://og9s6vxbs.qnssl.com/member/member-action.png'
      ];
    }
  }
</script>
