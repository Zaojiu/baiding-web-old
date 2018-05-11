<template>
  <div class="img-wrapper">
    <div class="cover-bg">
      <transition-group tag="div" :name="translation">
        <div class="img-cover"
             v-for="(item,index) in imgList"
             v-if="index===mark"
             @click="actionFather(item)"
             :key="index">
          <img
            :src="item"/>
        </div>
      </transition-group>
    </div>
    <div class="control">
      <div class="item-content" v-for="(item,index) in imgList" @click="changeImg(index)">
        <div class="item"
             :class="{'active':index===mark}"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .img-wrapper {
    width: 100%;

    .cover-bg {
      width: 100%;
      position: relative;
      font-size: 0;
      padding-top: 56.25%;

      .img-cover {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        overflow: hidden;
        transition: all .5s cubic-bezier(.55, 0, .1, 1);

        img {
          width: 100%;
        }
      }
    }

    .control {
      display: flex;
      justify-content: center;

      .item-content {
        padding: 10px 10px;
      }

      .item {
        font-size: 0;
        color: #fff;
        background-color: #909090;
        height: 3px;
        width: 20px;
        text-align: center;
        border-radius: 7px;
      }

      .active {
        background-color: #31b5a5;
      }
    }

    .image-left-enter, .image-right-leave-active {
      opacity: 0;
      transform: translate(100%, 0);
    }
    .image-left-leave-active, .image-right-enter {
      opacity: 0;
      transform: translate(100%, 0);
    }

  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component({
    props: ['imgList'],
  })
  export default class MySwiperComponent extends Vue {
    timer: any;//定时器
    mark = 0; //图片索引
    imgList: string[];
    autoChange: boolean;
    translation = 'image-left';

    changeImg(index: number) {
      if (index > this.mark) {
        this.translation = 'image-left'
      } else {
        this.translation = 'image-right'
      }
      this.mark = index;
    }

    actionFather(url: string) {
      this.$emit('itemClick', url)
    }

  }

</script>
