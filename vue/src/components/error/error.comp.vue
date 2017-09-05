<template>
  <div class="reload-page">
    <i class="bi bi-not-found"></i>
    <div class="slogan">您访问的页面似乎出了点问题</div>
    <button class="reload-btn" @click="goBack()">重新加载</button>
  </div>
</template>

<style lang="scss" scoped>
  .reload-page {
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

    .reload-btn {
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
  import { Component } from 'vue-property-decorator';
  import {getRelativePath} from '../../shared/utils/utils';

  @Component
  export default class ErrorComponent extends Vue {
    redirectTo = '';

    created() {
      this.redirectTo = getRelativePath(this.$route.query['redirectTo'], '/lives');
    }

    goBack() {
      if (this.redirectTo) {
        this.$router.push(this.redirectTo);
      } else {
        history.go(-1);
      }
    }
  }
</script>
