<template>
  <div class="container">
    <div class="talk-group">
      <div class="talk-item">
        <div class="img">
          <img :src="defaultImg"/>
          <div class="tag">
            <span>#人文</span>
            <span>16'50''</span>
          </div>
          <div class="play">
            <img src="https://og9s6vxbs.qnssl.com/wiee/detail/play.png"/>
          </div>
        </div>
        <h3>共享住宅的核心根本是什么？</h3>
        <p>Chris Lehane · Siri联合创始人及董事长</p>
      </div>
      <div class="talk-item">
        <div class="img">
          <img :src="defaultImg"/>
          <div class="tag">
            <span>#人文</span>
            <span>16'50''</span>
          </div>
          <div class="play">
            <img src="https://og9s6vxbs.qnssl.com/wiee/detail/play.png"/>
          </div>
        </div>
        <h3>共享住宅的核心根本是什么？</h3>
        <p>Chris Lehane · Siri联合创始人及董事长</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100%;
    background-color: #000;
    overflow-y: auto;
    padding: 25px 20px 0 20px;

    .talk-group {
      .talk-item {
        margin-bottom: 35px;

        .img {
          padding-top: 56.25%;
          font-size: 0;
          position: relative;
          background-color: #1A1A1A;

          img {
            position: absolute;
            top:0;
            left: 0;
            width: 100%;
          }
        }

        .play {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          height: 48px;
          width: 48px;

          img {
            width: 100%;
          }
        }

        .tag {
          position: absolute;
          width: 100%;
          left: 0;
          bottom: 8px;
          color: #fff;
          font-size: 12px;
          line-height: 12px;
          background-color: transparent;
          display: flex;
          justify-content: space-between;
          padding: 0 16px;
        }

        h3 {
          color: #fff;
          font-size: 16px;
          line-height: 22px;
          text-align: left;
          margin-top: 12px;
        }
        p {
          margin-top: 4px;
          color: rgb(166, 166, 166);
          font-size: 14px;
          line-height: 16px;
          text-align: left;
        }
      }
    }

  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';

  @Component({})
  export default class ActivateComponent extends Vue {
    list = [
      {
        name: 'Chris Lehane · Siri联合创始人及董事长',
        url: '',
        desc: '同济大学设计创意学院教授,同济大学设计创意学院教授'
      }
    ];
    defaultImg = '/assets/img/default-cover.jpg';

    created() {
      this.init();
    }


    async init() {
    }
  }
</script>
