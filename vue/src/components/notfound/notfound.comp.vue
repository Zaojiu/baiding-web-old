<template>
  <div class="notfound-page">
    <i class="bi bi-not-found"></i>
    <div class="slogan">页面被机器狗吃了</div>
    <button class="back-btn" @click="goHome()" v-if="!isInApp">返回</button>
  </div>
</template>

<style lang="scss" scoped>
  .notfound-page {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: auto;

    .bi {
      font-size: 115px;
    }

    .slogan {
      text-align: center;
      margin-top: 15px;
      font-size: 17px;
      color: $color-dark-gray;
      white-space: nowrap;
    }

    .back-btn {
      margin-top: 40px;
      width: 200px;
      text-align: center;
      line-height: 50px;
      color: $color-w;
      font-size: 17px;
      background-color: $color-brand;
      border-radius: 25px;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {getRelativePath, isInApp} from '../../shared/utils/utils';

  @Component
  export default class NotFoundComponent extends Vue {
    isInApp = isInApp;

    goHome() {
      this.$router.push({path: '/lives'});
    }
  }
</script>
