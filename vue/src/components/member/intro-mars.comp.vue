<template>
  <div class="container">

    <!--<div class="content">
      <div class="cover">
        <img style="width:100%;" src="https://og9s6vxbs.qnssl.com/memers/mars-intro.jpeg?t=1">
        <div style="padding: 15px;color:#afafaf;text-align: center;font-size: 14px;">
          年度会员升级优惠218元。
          <br>
          如需开票请联系造就会员客服微信zaojiu6。
        </div>
      </div>
    </div>
    <button class="button button-primary" @click="btnClick()">{{btnText}}</button>-->
    <div class="content">
      <img src="https://og9s6vxbs.qnssl.com/mars_member/text0.jpg" />
      <!--<img src="https://og9s6vxbs.qnssl.com/aia/marsPhoto.jpg" />-->
      <div class="video-content">
        <header :class="{
        'sticky': isVideoPlayed && !isLandscape && !isOnScreen,
        'played': isVideoPlayed,
        'played-landscape': isVideoPlayed && isLandscape
      }">
          <div class="player" id="player" @click="isVideoPlayed = true"></div>


          <div class="live-cover" v-if="!isVideoPlayed">
            <img
              class="cover-image"
              alt="话题间封面"
              :src="coverUrl"
              @error="coverUrl = defaultCoverUrl"
            >

            <div class="big-play"></div>
          </div>
        </header>
      </div>
      <img src="https://og9s6vxbs.qnssl.com/aia/text1.jpg" />
      <div class="img-group margin-bot">
        <img src="https://og9s6vxbs.qnssl.com/aia/principle.jpg" />
        <div class="btn-detail left" @click="goTalk(0)">详情</div>
      </div>
      <div class="img-group margin-bot">
        <img src="https://og9s6vxbs.qnssl.com/aia/tap.jpg" />
        <div class="btn-detail right" @click="goTalk(1)">详情</div>
      </div>
      <div class="img-group margin-bot">
        <img src="https://og9s6vxbs.qnssl.com/aia/history&future.jpg" />
        <div class="btn-detail left" @click="goTalk(2)">详情</div>
      </div>
      <div class="img-group" style="margin-top:60px">
        <img src="https://og9s6vxbs.qnssl.com/aia/hacking_growth.jpg" />
        <div class="btn-detail right" @click="goTalk(3)">详情</div>
      </div>
      <img src="https://og9s6vxbs.qnssl.com/mars_member/text2.jpg" />
      <img src="https://og9s6vxbs.qnssl.com/aia/card自有.jpg" />
      <div style="padding-bottom: 56.25px;"></div>
    </div>
    <div class="footer-btn"></div>
    <div class="btn-cover" @click="btnClick()"></div>
  </div>
</template>

<style lang="scss" scoped>

  .container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    color: #000;

    .content {
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      background: #000;
      font-size: 0;

      .margin-bot {
        margin-bottom: 3.25rem;
      }

      .img-group {
        position: relative;

        .btn-detail {
          font-size: 1rem;
          text-align: center;
          line-height: 2.75rem;
          color:#fff;
          font-weight: bold;
          border-radius: 24px;
          height: 2.75rem;
          width: 6.25rem;
          position: absolute;
          bottom: 2.25rem;
          background: linear-gradient(90deg, #ff9232, #e34103);
        }

        .left {
          left: 9%;
        }

        .right {
          right: 9%;
        }
      }

      img {
        width: 100%;
      }
    }

    @keyframes circle-opacity {
      0% {
        opacity: 1;
        transform: scale(1); }
      50% {
        opacity: 0.6;
        transform: scale(1.15); }
      100% {
        opacity: 1;
        transform: scale(1); }
    }

    .footer-btn {
      position: fixed;
      bottom: 20px;
      right: 14px;
      height: 4.12rem;
      width: 4.12rem;
      background: linear-gradient(195deg, #bf6823, #b12400);
      border-radius: 17.6vw;
      box-shadow: 4px 4px 8px 0 #000;
      animation: circle-opacity 2s infinite;
      animation-delay: .6s;
    }

    .btn-cover {
      position: fixed;
      height: 3.5rem;
      width: 3.5rem;
      bottom: calc(20px + 0.31rem);
      right: calc(14px + 0.31rem);
      background-color: #00d3c1;
      -webkit-box-pack: center;
      -moz-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -moz-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      z-index: 2;
      padding: 10px;
      border-radius: 56px;
      background: url(https://og9s6vxbs.qnssl.com/aia/buy_now.png) no-repeat;
      background-size: 100% 100%;
    }

    .video-content {
      flex-shrink: 0;
      overflow: hidden;
      //padding-top: 56.25%;
      width: 98%;
      margin: 0 auto;
      background-color: #0A0A17;

      .video {
        position: absolute;
        top: 0;
        right: 0;
        height: 56.25vw;
        width: 100%;
      }

      header {
        position: relative;

        &.sticky {
          position: sticky;
          top: 0;
          z-index: $z-index-page-lv1;
        }

        &.played:before {
          height: 56.25vw;
        }

        &.played-landscape:before {
          height: 100vh;
        }

        &:before {
          content: "";
          display: block;
          height: 240px;
          transition: height .5s;
        }

        @media (max-width: 1024px) and (orientation: landscape) {
          .video-container {
            .video {
              &:before {
                height: 100vh;
              }
            }
          }
        }

        .player {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }

        .live-cover {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          display: flex;
          flex-direction: column-reverse;
          pointer-events: none;
          background-color: #000;
          .cover-thumbnail-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: $color-w;
            overflow: hidden;

            .cover-thumnail {
              position: absolute;
              top: -10px;
              left: -10px;
              width: calc(100% + 20px);
              height: calc(100% + 20px);
              background-position: center;
              background-size: cover;
              filter: blur(10px);
            }
          }

          .cover-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            //object-fit: cover;
            text-indent: -10000px;
          }

          .big-play {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            background: url("/assets/icon/new-big-play.svg") center top no-repeat;
            background-size: 80% 80%;
            pointer-events: none;
            min-width: 66px;
            padding-top: 74px;
            font-size: 14px;
            text-align: center;
            white-space: nowrap;
            color: $color-w;
            text-shadow: 0 0 2px $color-b;
          }
        }
      }

    }

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
  import {isInApp,isInWechat} from "../../shared/utils/utils";
  import {checkOrderFee} from "../../shared/api/order.api";
  import {isOnLargeScreen, isAndroid, isiOS, setScrollPosition} from '../../shared/utils/utils';
  import {ZaojiuPlayer, ZaojiuPlayerInstance, PlayerEvent} from "zaojiu-player";
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from "../../shared/utils/share";
  import {host} from "../../env/environment";

  @Component
  export default class IntroMarsComponent extends Vue {
    defaultCoverUrl = 'https://og9s6vxbs.qnssl.com/aia/marsPhoto.jpg';
    userInfo: UserInfoModel | null = null;
    fee = new Money(1000000);
    memberOrderObject = new PostOrderObject('member-mars', OrderObjectType.Member, 1); // hardcode temporary
    isOnScreen = isOnLargeScreen;
    isVideoPlayed = false;
    isLandscape = false;
    coverUrl = '';
    seeking = false;
    player: ZaojiuPlayerInstance;
    isLoading = false;

    created() {
      // this.preLoadImg([
      //   'https://og9s6vxbs.qnssl.com/aia/text0.jpg',
      //   'https://og9s6vxbs.qnssl.com/aia/marsPhoto.jpg',
      //   'https://og9s6vxbs.qnssl.com/aia/text1.jpg'
      // ]);
      this.share();
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
      } finally {
         this.prepareVideo(); //todo 如果要视屏，将这句和css，html中的注释放出
      }
    }

    preLoadImg(urlArray: Array<string>){
      let count = 1;
      let that =this;
      this.isLoading = true;
      urlArray.forEach((item)=>{
        let img = new Image();
        img.src = item;
        img.onload = function () {
          count += 1;
          if (count === urlArray.length){
            setTimeout(function () {
              that.isLoading = false;
            },1);
          }
        }
      });
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/member/intro-mars`;
        let title = '造就&友邦火星计划联名卡 正式招募';
        setShareInfo(
          title,
          '造就与AIA友邦，基于对新事物共同的好奇心，关注个人自我成长，携手发布火星计划联名卡。',
          'https://og9s6vxbs.qnssl.com/zaojiu-logo.jpg',
          url
        );
      }
    }

    prepareVideo() {
      System.import('zaojiu-player').then((player: ZaojiuPlayer) => {
        this.player = new player({
          element: 'player',
          playList: [{
            src: '',// todo url
            quality: '标清',
            mimetype: 'video/mp4'
          }, {
            src: 'https://og9s6vxbs.qnssl.com/members/mars-member.mp4',// todo url
            quality: '高清',
            mimetype: 'video/mp4'
          }],
        });
        this.player.event$.subscribe((e: PlayerEvent) => {
          switch (e.type) {
            case 'play':
              break;
            case 'error':
              this.isVideoPlayed = true;
              break;
            case 'seeking':
              this.seeking = true;
              break;
            case 'playing':
              this.seeking = false;
              break;
          }
        });
      });

      // 横竖屏polyfill
      System.import('o9n').then((o9n: any) => {
        this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && (isAndroid || isiOS);
        o9n.orientation.onchange = (evt: any) => {
          this.isLandscape = evt.target.type.indexOf('landscape') !== -1 && (isAndroid || isiOS);
        }
      });
    }

    goTalk(type: number) {
      switch (type) {
        case 0:
          window.location.href = 'https://mp.weixin.qq.com/s/ewC2su1rr3OWQ-yZVmy5SQ';
          break;
        case 1:
          window.location.href = 'https://mp.weixin.qq.com/s/gxu-nP9qTFUdF9a3qS5s7Q';
          break;
        case 2:
          window.location.href = 'https://mp.weixin.qq.com/s/liMOKIBDePgukPTuBEy94w';
          break;
        case 3:
          window.location.href = 'https://mp.weixin.qq.com/s/0N7FegkuGaHXdxEcsZvm3g';
          break;
      }
    }

    get btnText(): string {
      let text: string;
      if (this.userInfo && this.userInfo.isMember) {
        if (this.userInfo.member.memberId == "member-year") {
          let fee = new Money(1000000 - 21800);
          text = `升级成为火星会员 ${fee.toYuan('', '元/2年')}(已优惠${new Money(21800).toYuan('')}元)`;
        } else if (this.userInfo.member.memberId == "member-mars") {
          text = '已是火星会员，查看我的权益';
        } else {
          text = `购买造就火星会员 ${this.fee.toYuan('', '元/2年')}`;
        }
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
      if (isInApp) {
        this.$router.push({path: '/new-member/card?login=1'});
      } else {
        this.$router.push({path: '/new-member/card'});
      }
    }

    async buy() {
      if (!this.userInfo) {
        this.$router.push({path: '/signin', query: {redirectTo: `/member/intro-mars`}});
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
