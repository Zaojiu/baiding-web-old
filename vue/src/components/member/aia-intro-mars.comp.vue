<template>
  <div class="container">
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
    <div class="content">
      <div class="cover">
        <img style="width:100%;" src="https://og9s6vxbs.qnssl.com/memers/mars-intro.jpeg?t=1">
        <div style="padding: 15px;color:#afafaf;text-align: center;font-size: 14px;">
          年度会员升级优惠218元。
          <br>
          如需开票请联系造就会员客服微信zaojiu6。
        </div>
      </div>
    </div>
    <button class="button button-primary" @click="btnClick()">{{btnText}}</button>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .video-content {
      flex-shrink: 0;
      overflow: hidden;
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
  import {isInApp, isInWechat, isInWeiBo} from "../../shared/utils/utils";
  import {isOnLargeScreen, isAndroid, isiOS, setScrollPosition} from '../../shared/utils/utils';
  import {ZaojiuPlayer, ZaojiuPlayerInstance, PlayerEvent} from "zaojiu-player";
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from "../../shared/utils/share";
  import {host} from "../../env/environment";
  import {createOrder} from "../../shared/api/order.api";
  import {ApiError} from "../../shared/api/xhr";
  import {ApiCode} from "../../shared/api/code-map.enum";
  import {Store} from "../../shared/utils/store";
  import {showTips} from "../../store/tip";
  import {getRelativePath} from "../../shared/utils/utils";
  import {ApiErrorMessage} from "../../shared/api/code-map.enum";
  import {setPaymentNone} from "../../store/payment";
  import {pay} from "../../shared/api/pay.api";

  @Component
  export default class IntroMarsComponent extends Vue {
    defaultCoverUrl = 'https://og9s6vxbs.qnssl.com/members/mars-member-card.png';
    userInfo: UserInfoModel | null = null;
    fee = new Money(1000000);
    isOnScreen = isOnLargeScreen;
    isVideoPlayed = false;
    isLandscape = false;
    coverUrl = '';
    seeking = false;
    player: ZaojiuPlayerInstance;
    memberType = 'member-aia-mars';
    isPaying = false;

    created() {
      this.handlePayResultForRedirect();
      this.share();
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
      } finally {
        this.prepareVideo();
      }
    }

    async handlePayResultForRedirect() {
      const query = this.$route.query;
      const payResult = query['payResult'];

      if (!payResult) return true;

      if (payResult === 'success') {
        showTips('支付成功');
        setTimeout(() => {
          this.$router.push({path: '/new-member/card'});
        }, 10)
      } else if (payResult === 'cancel') {
        showTips('订单未支付');
      } else {
        showTips('支付失败，请重试');
        console.error(decodeURIComponent(payResult));
      }

      return false;
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/member/intro-mars`;
        let title = '造就火星计划';
        setShareInfo(
          title,
          '一起探索科技创新与未来的前沿',
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

    get btnText(): string {
      let text: string;
      if (this.userInfo && this.userInfo.isMember && this.userInfo.member.memberId == this.memberType) {
        text = '已购买造就-友邦火星联名卡，查看我的权益';
      } else {
        let fee = new Money(1000000);
        text = `购买造就.友邦火星联名卡 ${fee.toYuan('', '元/2年')}`;
      }
      return text;
    }

    btnClick() {
      if (this.userInfo && this.userInfo.isMember && this.userInfo.member.memberId === this.memberType) {
        this.goMyMember();
      } else {
        // this.buy();
        this.goIntro();
      }
    }

    goMyMember() {
      if (isInApp) {
        this.$router.push({path: '/new-member/card?login=1'});
      } else {
        this.$router.push({path: '/new-member/card'});
      }
    }

    /*async buy() {
      if (!this.userInfo) {
        this.$router.push({path: '/signin', query: {redirectTo: `/member/aia-intro-mars`}});
        return;
      }

      if (this.userInfo.isMember && this.userInfo.member.memberId === this.memberType) return;

      this.$router.push({
        path: '/orders',
        query: {
          items: encodeURIComponent(JSON.stringify([new PostOrderObject(this.memberType, OrderObjectType.Member, 1)])) // hardcode temporary
        }
      });
    }*/

    checkMobileBinded(to: string) {
      // 未绑定手机
      if (this.userInfo && this.userInfo.isMobileBinded) {
        return true;
      }
      this.$router.push({path: '/mobile-bind-event', query: {redirectTo: to}});
      return false;
    };

    async goIntro() {
      this.userInfo = getUserInfoCache();

      //安卓端购买跳转
      /*if (this.isAndroid) {
        await initIOS();
        callHandler('payOrder', `${host.self}/orders?items=${encodeURIComponent(JSON.stringify([this.memberOrderObject]))}`);
        return;
      }*/

      // web 创建订单
      if (!this.checkMobileBinded(this.$route.fullPath)) {
        return;
      }
      this.createOrder();
    }

    //订单
    async createOrder() {
      if (this.isPaying) return;

      this.isPaying = true;

      try {
        const orderMeta = await createOrder([new PostOrderObject(this.memberType, OrderObjectType.Member, 1)], [], false);
        await this.payOrder(orderMeta.orderNo);
      } catch (e) {
        if (e instanceof ApiError) {
          const code = e.code;

          if (code === ApiCode.ErrOrderNeedProcessOthers) {
            const oldOrderNum = e.originError.response && e.originError.response.data.data.orderNo;
            this.payOrder(oldOrderNum);
          } else if (e.isUnauthorized) {
            Store.memoryStore.delete('userInfo');
            showTips(`请登录`);
            this.$router.push({path: '/signin', query: {redirectTo: getRelativePath(location.href, '/lives')}});
          } else {
            const errMessage = ApiErrorMessage[code] || `未知错误: ${code}`;
            showTips(errMessage);
          }

          throw e;
        }
      } finally {
        this.isPaying = false;
      }
    }

    async payOrder(orderNo: string) {
      let redirectUrl = `${host.self}/wv/aia-intro-mars`;
      await pay(orderNo, redirectUrl);
      setPaymentNone();
      showTips('支付成功');
      if (!isInWechat && !isInApp && !isInWeiBo) {
        this.$router.push({path: '/new-member/card'})
      }
    }
  }
</script>
