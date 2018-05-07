<template>
  <div class="container">
    <div class="map" ref="map">
      <img src="https://og9s6vxbs.qnssl.com/wiee/map.jpg" border="0" usemap="#planetmap" alt="地图"/>
      <map name="planetmap" id="planetmap">
        <!--<area @click="showMapDetail(1)" shape="rect" coords="241,288,326,326" alt="参观入口"/>
        <area @click="showMapDetail(2)" shape="rect" coords="186,404,257,443" alt="停车场"/>
        <area @click="showMapDetail(3)" shape="rect" coords="413,52,598,92" alt="停车场(巴士)"/>-->
        <area @click="showMapDetail(4)" shape="rect" coords="400,230,502,272" alt="创意集市"/>
        <!--<area @click="showMapDetail(5)" shape="rect" coords="604,98,694,139" alt="参观入口（2）"/>-->
        <area @click="showMapDetail(6)" shape="rect" coords="599,229,715,271" alt="未来教育区"/>
        <area @click="showMapDetail(7)" shape="rect" coords="452,349,653,388" alt="未来城市与大学展示区"/>
        <area @click="showMapDetail(8)" shape="rect" coords="690,307,778,347" alt="创客馆"/>
        <area @click="showMapDetail(9)" shape="rect" coords="593,408,745,450" alt="未来生活展示区"/>
        <area @click="showMapDetail(10)" shape="rect" coords="500,497,654,545" alt="未来居住展示区"/>
        <area @click="showMapDetail(11)" shape="rect" coords="768,364,877,409" alt="智汇云顶"/>
        <area @click="showMapDetail(12)" shape="rect" coords="684,567,840,611" alt="未来交通展示区"/>
        <!--<area @click="showMapDetail(13)" shape="rect" coords="637,665,735,715" alt="参观入口（3）"/>-->
      </map>
      <div class="tips">
        <span>拖动查看更多</span>
      </div>
    </div>
    <div class="aside" v-if="showSide">
      <div class="aside-main">
        <h2 class="title">
          {{sideTitle}}
          <img @click="closeSide" class="close" src="https://og9s6vxbs.qnssl.com/wiee/close.png"/>
        </h2>
        <div class="content">
          <p>{{sideContent}}</p>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;

    .map {
      font-size: 0;
      width: 100%;
      height: 100vh;
      background-color: #000;
      overflow: auto;

      img {
        height: 800px;
      }
    }

    .tips {
      position: fixed;
      width: 100vw;
      bottom: 12px;
      text-align: center;

      span {
        width: 148px;
        height: 30px;
        background-color: rgb(0, 211, 193);
        color: #fff;
        font-size: 14px;
        border-radius: 15px;
        padding: 5px 20px;
        box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, .3);
      }
    }

    .aside {
      position: absolute;
      height: 100%;
      background-color: rgba(0, 0, 0, .8);
      z-index: 1;
      width: 100%;
      top: 0;

      .aside-main {
        position: absolute;
        overflow-y: auto;
        width: 80%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #000;
        border-radius: 4px;
        padding-bottom: 16px;

        .title {
          position: relative;
          color: rgb(0, 211, 193);
          font-size: 20px;
          line-height: 20px;
          text-align: center;
          padding: 16px 0;

          .close {
            position: absolute;
            top: 0;
            right: 0;
            width: 28px;
            height: 28px;
          }
        }

        .content {
          padding: 4px 20px 16px 20px;
          height: 240px;
          overflow-y: auto;

          p {
            color: rgb(166, 166, 166);
            font-size: 14px;
            line-height: 22px;
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
    showSide = false;
    sideTitle = '';
    sideContent = '';

    created() {
    }

    @Watch('$route.name')
    setNavIndex() {
      this.init()
    }

    mounted() {
      this.init();
    }

    async init() {
      this.$nextTick(function () {
        let map = this.$refs['map'] as HTMLElement;
        map.scroll(400, 0)
      });
    }

    closeSide() {
      this.showSide = false;
      this.sideContent = '';
      this.sideTitle = '';
    }

    showMapDetail(number: number) {
      switch (number) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        //创意集市
        case 4:
          this.sideTitle = '创意集市';
          this.sideContent = '我们为新兴设计师和艺术家提供开放、多元的创作环境和交易平台，推崇个人创造和精神创新，鼓励创意立业，是一个生成创意并商业化的的实验舞台。';
          this.showSide = true;
          break;
        case 5:
          break;
        //未来教育区  0
        case 6:
          this.sideTitle = '未来教育区';
          this.sideContent = '最有创新性和颠覆性的教育理念展示区，用科技的手段和人文的理念普及知识与教育';
          this.showSide = true;
          break;
        //未来城市与大学展示区1
        case 7:
          this.$router.push({path: `/wv/wiee/map/7`});
          break;
        //创客馆   0
        case 8:
          this.sideTitle = '创客馆';
          this.sideContent = '创客是一群喜欢或者享受创新的人，追求自身创意的实现，而创客馆为这些创客们提供实现创意和交流创意思路及产品的线下和线上相结合、创新和交友相结合的平台。';
          this.showSide = true;
          break;
        //未来生活展示区  1
        case 9:
          this.$router.push({path: `/wv/wiee/map/9`});
          break;
        //未来居住展示区  1
        case 10:
          this.$router.push({path: `/wv/wiee/map/10`});
          break;
        //智汇云顶  0
        case 11:
          this.sideTitle = '智汇云顶';
          this.sideContent = '可容纳5000人的超级会场，不需传统搭建和框架结构，短短数天即可吹起来。';
          this.showSide = true;
          break;
        //未来交通展示区  1
        case 12:
          this.$router.push({path: `/wv/wiee/map/12`});
          break;
        case 13:
          break;
        default:
          return;
      }
    }
  }
</script>
