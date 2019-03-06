<template>
  <div class="member-card">
    <div v-for="item in listImg" class="image-cover">
      <img :src="item"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .member-card {
    color: #fff;
    overflow: hidden;
    height: 100%;

    .image-cover {
      font-size: 0;
      height: 100%;
      overflow: auto;

      img {
        width: 100%;
      }
      & + .image-cover {
        margin-top: 32px;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';

  @Component({})
  export default class PlanList extends Vue {
    listImg: string[] = [];

    created() {
      this.init();
    }

    async init() {
      this.listImg = [
        'https://baiding-pub.zaojiu.com/members/mars-plan-speaker.jpg'
      ];
    }

  }
</script>
