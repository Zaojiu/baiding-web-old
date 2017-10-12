<template>
  <div class="qrcode-container" v-if="isPopup" @click="close()">
    <div class="content" @click.stop>
      <img class="qrcode" :src="getQrcode" alt="二维码">
      <div class="tips" v-html="tips"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .qrcode-container {
    position: absolute;
    background-color: rgba(0, 0, 0, .6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    .content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      background-color: $color-w;
      padding: 20px;
      color: $color-dark-gray;
      border-radius: 4px;
      text-align: center;

      .qrcode {
        display: block;
        width: 240px;
        height: 240px;
      }

      .tips {
        font-size: $font-size-md;
        color: $color-dark-gray;
        margin-top: 15px;
        line-height: 1.5em;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {qrcodeStore, hideQrcode} from '../store/qrcode';
  import {yaqrcode} from 'yaqrcode';

  @Component
  export default class QrcodeComponent extends Vue {
    get tips(): string {
      return qrcodeStore.state.tips;
    }

    get isPopup(): boolean {
      return qrcodeStore.state.isPopup;
    }

    get url(): string {
      return qrcodeStore.state.url;
    }

    close() {
      hideQrcode();
    }

    get getQrcode(): string {
      return yaqrcode(this.url, {size: 240});
    }
  }
</script>
