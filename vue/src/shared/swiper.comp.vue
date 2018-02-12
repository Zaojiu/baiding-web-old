<template>
  <div class="slide" v-on:mouseover="stop()" v-on:mouseout="move()">
    <div class="slideshow">
      <transition-group tag="ul" name="image">
        <li v-for="(img, index) in imgArray" v-show="index===mark" :key="index">
          <img :src='img'>
        </li>
      </transition-group>
    </div>
    <div class="bullet">
      <span v-for="(item, index) in imgArray" :class="{ 'active':index===mark }"
            @click="change(index)" :key="index"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .slide {
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    position: relative;
    height: 0;
    padding-top: 56.25%;

    .slideshow {
      position: absolute;
      top: 0;
      width: 100%;
    }
    ul {
      width: 100%;
    }

    li {
      width: 100%;
      position: absolute;
    }

    img {
      width: 100%;
    }

    .bar {
      position: absolute;
      width: 100%;
      bottom: 10px;
      margin: 0 auto;
      z-index: 10;
      text-align: center;
    }

    .bar span {
      width: 20px;
      height: 5px;
      border: 1px solid;
      background: white;
      display: inline-block;
      margin-right: 10px;
    }

    .active {
      background: red !important;
    }

    .image-enter-active {
      transform: translateX(0);
      transition: all 1.5s ease;
    }

    .image-leave-active {
      transform: translateX(-100%);
      transition: all 1.5s ease;
    }

    .image-enter {
      transform: translateX(100%);
    }

    .image-leave {
      transform: translateX(0);
    }
  }

  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }

</style>

<script>
  export default {
    data() {
      return {
        timer: null, //定时器
        mark: 0, //比对图片索引的变量
        imgArray: [
          'https://og9s6vxbs.qnssl.com/memers/member-action-first.jpg',
          'https://og9s6vxbs.qnssl.com/memers/member-action-s.jpg',
          'https://og9s6vxbs.qnssl.com/memers/member-action-t.jpg',
          'https://og9s6vxbs.qnssl.com/memers/member-action-f.jpg',
          'https://og9s6vxbs.qnssl.com/memers/member-action-fi.jpg'
        ]
      }
    },
    methods: {
      autoPlay() {
        this.mark++;
        if (this.mark === 4) {
          this.mark = 0;
        }
      },
      play() {
        this.timer = setInterval(this.autoPlay, 2500)
      },
      change(i) {
        this.mark = i
      },
      stop() {
        clearInterval(this.timer)
      },
      move() {
        this.timer = setInterval(this.autoPlay, 2500)
      }
    },
    created() {
      this.play()
    },

    beforeDestroy() {
      this.stop();
    }
  }
</script>
