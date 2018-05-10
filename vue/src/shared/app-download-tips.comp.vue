<template>
  <div class="download-tips">
    <i class="bi bi-close" @click="$emit('close')"></i>
    <div class="tips">
      造就App
      <small>_REPL_SLOGAN_</small>
    </div>
    <a class="download-btn" @click="redirectToYingYongBao">立即下载</a>
  </div>
</template>

<style lang="scss" scoped>
  .download-tips {
    background-color: rgba(0, 0, 0, .5);
    color: $color-w;
    display: flex;
    width: 100%;
    align-items: center;

    .bi-close {
      flex-shrink: 0;
      font-size: 22px;
      padding: 14px 16px;
      cursor: pointer;
    }

    .tips {
      flex-grow: 1;
      font-size: 14px;
      line-height: 1em;

      small {
        display: block;
        margin-top: 5px;
        font-size: 12px;
      }
    }

    .download-btn {
      height: 26px;
      width: 78px;
      text-align: center;
      line-height: 26px;
      font-size: 12px;
      background-color: $color-brand;
      margin-right: 16px;
      color: $color-w;
      border-radius: 6px;
      cursor: pointer;
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {appConfig, host} from '../env/environment';
  import {showModal} from '../store/modal';

  @Component
  export default class BdLoadingComponent extends Vue {

    showDownloadModal() {
      const content = `<img style="max-width: 80vw; height: auto;" src="${host.assets}/assets/img/yingyongbao-ios-qrcode.png"><p>点击下载按钮或扫码，下载造就APP</p>`;
      const link = appConfig.iosDownloadLink;
      showModal(content, '下载', true, '取消', link);
    }

    redirectToYingYongBao() {
      location.href = 'https://www.zaojiu.com/app';
    }
  }
</script>
