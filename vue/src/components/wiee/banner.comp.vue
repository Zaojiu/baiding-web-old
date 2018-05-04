<template>
  <article class="wiee-container">
    <div class="bg"><img class="bg-img" src="https://og9s6vxbs.qnssl.com/wiee/bg.jpg"/></div>
    <!--<div class="bg-text"><img src="https://og9s6vxbs.qnssl.com/wiee/bg-txt.png"/></div>-->
    <button class="jump" @click="jump">跳过{{time}}S</button>
  </article>
</template>

<style lang="scss" scoped>
  .wiee-container {
    height: 100vh;
    width: 100%;
    background-color: #000;

    .bg {
      margin: auto;
      width: 100%;
      height: 100vh;
      background-color: #000;
      font-size: 0;

      .bg-img {
        // position: relative;
        width: 100%;
        // animation: big 1.4s ease-in-out 0s both;
      }
    }

    /*@keyframes big {
      0% {
        top: 0;
        transform: scale(1);
      }

      100% {
        top: 60px;
        transform: scale(1.8);
      }
    }*/

    /*.bg-text {
      font-size: 0;
      position: absolute;
      bottom: 0;
      left: 18px;
      width: calc(100% - 36px);
      background-color: transparent;

      img {
        width: 100%;
      }
    }*/

    .jump {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 72px;
      height: 30px;
      border: 1px solid rgb(217, 217, 217);
      border-radius: 15px;
      text-align: center;
      color: rgb(204, 204, 204);
      font-size: 14px;
      line-height: 14px;
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {isInApp, isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';

  @Component({})
  export default class ActivateComponent extends Vue {
    time = 3;
    timer: any;

    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    created() {
      this.init();
    }

    mounted() {
      this.timer = setInterval(() => {
        this.time = this.time - 1;
        if (this.time === 0) {
          this.$router.push({path: '/wv/wiee/index'})
        }
      }, 1000)
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        setShareInfo(
          'WIEE-造就',
          `一场思想盛宴`,
          `${host.assets}/assets/img/zaojiu-logo.jpg`,
          `${host.self}${this.$route.fullPath}`
        );
      }
    }

    destroyed() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    }

    jump() {
      this.$router.push({path: '/wv/wiee/index'})
    }

    async init() {
      if (isInWechat) {
        await this.share()
      }
    }
  }
</script>
