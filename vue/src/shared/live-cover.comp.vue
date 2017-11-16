<template>
  <div class="cover-container">
    <img class="cover" :src="liveInfo.coverSmallUrl" alt="话题间封面">
    <div class="status">
      <span class="live-status living" v-if="liveInfo.isStarted">直播中</span>
      <span class="live-status" v-if="liveInfo.isClosed">已结束</span>
      <span class="live-type text" v-if="liveInfo.isTypeText" :class="{'living': liveInfo.isStarted}">文字</span>
    </div>
    <count-down class="count-down" :expectStartAt="liveInfo.expectStartAt" :countDownStatus="liveInfo.isCreated"></count-down>
  </div>
</template>

<style lang="scss" scoped>
  .cover-container {
    position: relative;

    &:before {
      content: '';
      display: block;
      width: 100%;
      padding-top: 56.25%;
    }

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }

    .status {
      position: absolute;
      left: 10px;
      top: 10px;
      display: flex;

      .live-status, .live-type {
        display: flex;
        align-items: center;
        height: 20px;
        padding: 0 10px;
        border-radius: 10px;
        line-height: 1em;
        margin-right: 10px;
        background-color: rgb(199, 199, 204);
        font-size: 12px;
        color: $color-dark-gray;

        &.living {
          background-color: rgb(221, 60, 60);
          font-size: 12px;
          color: $color-w;
        }
      }

      .live-status {
        &.living {
          &:before {
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: $color-w;
            margin-right: 4px;
          }
        }
      }
    }

    .count-down {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {LiveInfoModel} from './api/lives.model';
  import {now} from './utils/utils';
  import countDown from './count-down.comp.vue';

  @Component({
    props: ['liveInfo'],
    components: {
      countDown: countDown,
    },
  })
  export default class LiveCoverComponent extends Vue {
    liveInfo: LiveInfoModel;
    timeNow = now.toString();
    timer: any;

    created() {
      this.timer = setInterval(()=> {
        this.timeNow = now.toString();
      }, 1000);
    }

    destroyed() {
      console.log('des');
      clearInterval(this.timer);
    }
  }
</script>
