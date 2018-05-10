<template>
  <div class="container">
    <article class="wiee-container" v-if="showTips">
      <div class="bg"><img class="bg-img" src="https://og9s6vxbs.qnssl.com/wiee/bg.jpg"/></div>
      <button class="jump" @click="jump">跳过{{time}}S</button>
    </article>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    font-size: 0;
  }

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
        width: 100%;
      }
    }

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
    showTips = false;

    @Watch('$route.name')
    setNavIndex() {
      if (this.$route.name === 'wiee.banner') {
        this.showTips = true;
      } else {
        this.showTips = false;
      }
    }

    created() {
      this.setNavIndex();
      this.init();
    }

    mounted() {
      if (this.$route.name === 'wiee.banner') {
        this.timer = setInterval(() => {
          this.time = this.time - 1;
          if (this.time === 0) {
            this.$router.push({path: '/wv/wiee/index'});
            if (this.timer) {
              clearInterval(this.timer);
            }
          }
        }, 1000)
      }
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        setShareInfo(
          '造就思想节：发现最有创造力的思想',
          `科技与人文交汇的十字路口`,
          'https://og9s6vxbs.qnssl.com/wiee/wiee-share.jpg',
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

    init() {
      if (isInWechat) {
        this.share()
      }
    }
  }
</script>
