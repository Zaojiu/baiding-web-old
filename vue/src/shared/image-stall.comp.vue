<template>
  <div class="qrcode-container" v-if="status" @click="close()">
    <div class="show_img">
      <div class="img-content">
        <img :src="url"/>
      </div>
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

    .show_img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      z-index: 1;
      background-color: #0A0A17;
      width: 100%;
      font-size: 0;

      .close-btn {
        position: absolute;
        top: 20px;
        left: 20px;
        font-size: 12px;
        font-weight: bold;
        color: #fff;
        background: #000;
        height: 24px;
        border-radius: 24px;
        width: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .img-content {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        overflow: auto;

        img {
          height: 86vh;
          width: auto;
          margin: auto;
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {imgStore, hideImageStall} from '../store/image-stall';

  @Component
  export default class ImageStallComponent extends Vue {

    get status(): boolean {
      return imgStore.state.status;
    }

    get url(): string {
      return imgStore.state.imgUrl;
    }

    close() {
      hideImageStall();
    }

  }
</script>
