<template>
  <div class="container">
    <div class="talk-group">
      <div class="talk-item">
        <div class="img">
          <img :src="defaultImg"/>
          <div class="play">
            <img src="https://og9s6vxbs.qnssl.com/wiee/detail/play.png"/>
          </div>
        </div>
        <h3>共享住宅的核心根本是什么？</h3>
      </div>
      <div class="talk-item">
        <div class="img">
          <img :src="defaultImg"/>
          <div class="play">
            <img src="https://og9s6vxbs.qnssl.com/wiee/detail/play.png"/>
          </div>
        </div>
        <h3>共享住宅的核心根本是什么？</h3>
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

        }

        h3 {
          color: #fff;
          font-size: 16px;
          line-height: 22px;
          text-align: left;
          margin-top: 12px;
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
