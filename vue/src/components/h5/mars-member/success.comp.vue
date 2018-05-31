<template>
  <div class="container">
    <!--<div class="video-content">
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
    </div>-->
    <h3>恭喜您加入火星计划</h3>
    <h4>和我们众多会员一起探索科技创新与未来的前沿</h4>
    <div class="content">
      <div class="mobile">24小时专线对接:<a href="tel:18817962164"> 18817962164</a></div>
      <div class="cover" style="font-size: 0">
        <img style="width:100%;" src="https://og9s6vxbs.qnssl.com/members/mars-intro-nopay.jpeg">
        <div style=""></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #000;

    h3 {
      font-size: 22px;
      text-align: center;
      color: #d01e0f;
      letter-spacing: 2px;
      background-color: #000;
      padding: 14px 20px 6px 20px;
    }

    h4 {
      color: #d01e0f;
      letter-spacing: 2px;
      background-color: #000;
      padding: 0px 20px;
      font-size: 12px;
      text-align: center;
    }

    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 15px;
      width: 100%;
      button {
        width: 100%;
        background-color: rgb(0, 211, 193);
        border-radius: 4px;
        font-size: 18px;
        line-height: 18px;
        padding: 11px 0;
        color: #fff;
        font-weight: 600;
      }
    }

    .video-content {
      flex-shrink: 0;
      font-size: 0;
      overflow: hidden;
      padding-top: 56.25%;
      background-color: #0A0A17;
      position: relative;

      .video {
        position: absolute;
        top: 0;
        right: 0;
        height: 56.25vw;
        width: 100%;
      }

      header {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;

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
            object-fit: cover;
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
      position: relative;

      .mobile {
        position: absolute;
        top: 30px;
        left: 0;
        text-align: center;
        width: 100%;
        color: #fff;
        font-size: 16px;
        z-index: 1;

        a {
          color: #fff;
        }
      }

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
  import {Money} from '../../../shared/utils/utils';
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {UserInfoModel} from '../../../shared/api/user.model';
  import {PostOrderObject, OrderObjectType} from "../../../shared/api/order.model";
  import {isOnLargeScreen, isAndroid, isiOS, setScrollPosition} from '../../../shared/utils/utils';
  import {ZaojiuPlayer, ZaojiuPlayerInstance, PlayerEvent} from "zaojiu-player";
  import {form} from '../../../shared/form/index';
  import {showTips} from "../../../store/tip";
  import {isInWechat} from "../../../shared/utils/utils";
  import {host} from "../../../env/environment";
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from '../../../shared/utils/share';

  @Component({
    directives: form,
  })
  export default class IntroMarsComponent extends Vue {
    defaultCoverUrl = 'https://og9s6vxbs.qnssl.com/members/mars-member-card.png';
    userInfo: UserInfoModel | null = null;
    fee = new Money(1000000);
    memberOrderObject = new PostOrderObject('member-mars', OrderObjectType.Member, 1); // hardcode temporary
    isOnScreen = isOnLargeScreen;
    isVideoPlayed = false;
    isLandscape = false;
    coverUrl = '';
    seeking = false;
    player: ZaojiuPlayerInstance;
    showSide = false;
    isSubmitting = false;
    email = '';
    name = '';
    mobile = '';


    created() {
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
      } finally {
        this.share();
        //this.prepareVideo();
      }
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/wv/intro-mars`;
        let title = '造就火星计划';
        setShareInfo(
          title,
          '一起探索科技创新与未来的前沿',
          'https://og9s6vxbs.qnssl.com/reservation/zaojiu-logo.png',
          url
        );
      }
    }

    /*prepareVideo() {
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
    }*/

    back() {
      this.$router.push({path: `/wv/intro-mars`})
    }
  }
</script>
