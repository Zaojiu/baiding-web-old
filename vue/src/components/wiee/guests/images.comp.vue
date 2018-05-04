<template>
  <div class="container">
    <div class="talk-group">
      <div class="talk-item">
        <div class="img">
          <img :src="defaultImg"/>
        </div>
      </div>
      <div class="talk-item">
        <div class="img">
          <img :src="defaultImg"/>
        </div>
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
          font-size: 0;
          position: relative;
          background-color: #1A1A1A;

          img {
            width: 100%;
          }

          img[src=""]{
            opacity: 0;
          }

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
    defaultImg = 'https://og9s6vxbs.qnssl.com/wiee/load-error.jpg';

    created() {
      this.init();
    }


    async init() {
    }
  }
</script>
