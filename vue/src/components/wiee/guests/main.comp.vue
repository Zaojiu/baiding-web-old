<template>
  <div class="container">
    <nav class="nav">
      <div
        @click="changeNav(0)"
        :class="{'active':navIndex===0}">
        介绍
      </div>
      <div
        @click="changeNav(1)"
        :class="{'active':navIndex===1}">
        演讲
      </div>
      <div
        @click="changeNav(2)"
        :class="{'active':navIndex===2}">
        花絮
      </div>
      <div
        @click="changeNav(3)"
        :class="{'active':navIndex===3}">
        画册
      </div>
      <!--<div
        @click="changeNav(4)"
        :class="{'active':navIndex===4}">
        评论
      </div>-->
    </nav>
    <section class="content">
      <transition :name="translation">
        <router-view class="child-view"></router-view>
      </transition>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100%;
    background-color: #000;
    $nav-height: 48px;

    .nav {
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: rgb(166, 166, 166);
      height: 48px;
      font-size: 14px;
      line-height: 16px;

      > div {
        width: 18%;
        text-align: center;
      }

      .active {
        color: rgb(0, 211, 193);
        font-weight: bold;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          width: 100%;
          margin: 0;
          height: 2px;
          background-color: rgb(0, 211, 193);
          bottom: -14px;
          left: 0;
          display: block;
        }
      }
    }

    .content {
      background-color: #000;
      height: calc(100vh - #{$nav-height});
      overflow: hidden;
    }

    .child-view {
      position: absolute;
      left: 0;
      top: $nav-height;
      width: 100%;
      height: calc(100% - #{$nav-height});
      transition: all .5s cubic-bezier(.55, 0, .1, 1);
    }
    .slide-left-enter, .slide-right-leave-active {
      opacity: 0;
      transform: translate(30px, 0);
    }
    .slide-left-leave-active, .slide-right-enter {
      opacity: 0;
      transform: translate(-30px, 0);
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
        name: 'Constantinos Terzidis',
        url: '',
        desc: '同济大学设计创意学院教授,同济大学设计创意学院教授'
      }
    ];
    navIndex = 0;
    translation = '';

    created() {
      this.init();
    }

    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    async init() {
      switch (this.$route.name) {
        case "wiee.guests.desc":
          this.navIndex = 0;
          break;
        case "wiee.guests.talk":
          this.navIndex = 1;
          break;
        case "wiee.guests.highlights":
          this.navIndex = 2;
          break;
        case "wiee.guests.images":
          this.navIndex = 3;
          break;
        default:
      }
    }

    changeNav(navIndex: number) {
      if (navIndex > this.navIndex) {
        this.translation = 'slide-left'
      } else {
        this.translation = 'slide-right'
      }
      this.navIndex = navIndex;
      switch (navIndex) {
        case 0:
          this.$router.push({path: `/wv/wiee/guests/desc`});
          break;
        case 1:
          this.$router.push({path: '/wv/wiee/guests/talk'});
          break;
        case 2:
          this.$router.push({path: '/wv/wiee/guests/highlights'});
          break;
        case 3:
          this.$router.push({path: '/wv/wiee/guests/images'});
          break;
        default:
      }
    }
  }
</script>
