<template>
  <div class="share-popup-container" @click="close()" :class="{opened: isPopup}">
    <div class="wechat-share" v-if="isInWechat">
      点击分享<i class="bi bi-arrow"></i>
    </div>

    <div class="pc-share" v-if="isInWeb && isPopup">
      <img class="qr-code" :src="getQrcode" alt="二维码">
      <div class="tips">扫码分享</div>
      <i class="bi bi-zaojiu-logo"></i>
      <i class="bi bi-zaojiu-slogan"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .share-popup-container {
    display: none;
    position: absolute;
    background-color: rgba(0, 0, 0, .6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    &.opened {
      display: block;
    }

    .wechat-share {
      color: $color-w;
      text-align: right;
      font-size: 20px;

      .bi-arrow {
        transform: rotate(90deg);
        font-size: 50px;
        margin-left: 10px;
        margin-right: 15px;
        vertical-align: bottom;
      }
    }

    .pc-share {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      background-color: $color-w;
      padding: 50px;
      color: $color-dark-gray;
      border-radius: 4px;
      text-align: center;

      .qr-code {
        display: block;
        width: 240px;
        height: 240px;
      }

      .tips {
        font-size: 18px;
        margin-top: 10px;
        margin-bottom: 50px;
      }

      .bi-zaojiu-logo {
        display: block;
        font-size: 55px;
        margin-bottom: 15px;
      }

      .bi-zaojiu-slogan {
        display: block;
        font-size: 25px;
        color: $color-gray;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {shareStore, hideSharePopup} from '../store/share';
  import {isInWechat, isInApp} from './utils/utils';
  import {yaqrcode} from 'yaqrcode';

  @Component
  export default class SharePopupComponent extends Vue {
    isInWechat = isInWechat;
    isInWeb = !isInWechat && !isInApp;

    get isPopup(): boolean {
      return shareStore.state.isPopup;
    }

    get link(): string {
      return shareStore.state.link;
    }

    close() {
      hideSharePopup();
    }

    get getQrcode(): string {
      return yaqrcode(this.link, {size: 240});
    }
  }
</script>
