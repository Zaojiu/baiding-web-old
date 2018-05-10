<template>
  <div class="container">
    <div class="map" ref="map">
      <img :src="$t('m.wiee.mapBgUrl')" border="0" usemap="#planetmap" alt="地图"/>
      <map v-if="lang!=='en'" name="planetmap" id="planetmap">
        <area @click="showMapDetail(4)" shape="rect" coords="400,230,502,272" alt="创意集市"/>
        <area @click="showMapDetail(6)" shape="rect" coords="599,229,715,271" alt="未来教育区"/>
        <area @click="showMapDetail(7)" shape="rect" coords="452,349,653,388" alt="未来城市与大学展示区"/>
        <area @click="showMapDetail(8)" shape="rect" coords="690,307,778,347" alt="创客馆"/>
        <area @click="showMapDetail(9)" shape="rect" coords="593,408,745,450" alt="未来生活展示区"/>
        <area @click="showMapDetail(10)" shape="rect" coords="500,497,654,545" alt="未来居住展示区"/>
        <area @click="showMapDetail(11)" shape="rect" coords="768,364,877,409" alt="智汇云顶"/>
        <area @click="showMapDetail(12)" shape="rect" coords="684,567,840,611" alt="未来交通展示区"/>
      </map>
      <map name="planetmap" id="planetmap" v-else>
        <area @click="showMapDetail(4)" shape="rect" coords="338,230,486,281" alt="创意集市"/>
        <area @click="showMapDetail(6)" shape="rect" coords="593,238,792,282" alt="未来教育区"/>
        <area @click="showMapDetail(7)" shape="rect" coords="288,352,645,396" alt="未来城市与大学展示区"/>
        <area @click="showMapDetail(8)" shape="rect" coords="678,316,841,355" alt="创客馆"/>
        <area @click="showMapDetail(9)" shape="rect" coords="479,419,739,459" alt="未来生活展示区"/>
        <area @click="showMapDetail(10)" shape="rect" coords="358,509,654,546" alt="未来居住展示区"/>
        <area @click="showMapDetail(11)" shape="rect" coords="763,373,941,419" alt="智汇云顶"/>
        <area @click="showMapDetail(12)" shape="rect" coords="682,578,964,615" alt="未来交通展示区"/>
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
    lang = 'zh';
    mapSrc = '';

    created() {
      this.init();
    }

    @Watch('$route.name')
    setNavIndex() {
      this.init()
    }

    mounted() {
      this.scroll();
    }

    scroll() {
      this.$nextTick(function () {
        let map = this.$refs['map'] as HTMLElement;
        map.scroll(400, 0)
      });
    }

    async init() {
      this.lang = this.$route.query['lang'];
      if (this.lang === 'en') {
        this.$i18n.locale = 'en';
      }
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
          this.sideTitle = this.$t('m.wiee.mapTextTitle4') as string;
          this.sideContent = this.$t('m.wiee.mapTextContent4') as string;
          this.showSide = true;
          break;
        case 5:
          break;
        //未来教育区  0
        case 6:
          this.sideTitle = this.$t('m.wiee.mapTextTitle6') as string;
          this.sideContent = this.$t('m.wiee.mapTextContent6') as string;
          this.showSide = true;
          break;
        //未来城市与大学展示区1
        case 7:
          this.$router.push({path: `/wv/wiee/map/7`});
          break;
        //创客馆   0
        case 8:
          this.sideTitle = this.$t('m.wiee.mapTextTitle8') as string;
          this.sideContent = this.$t('m.wiee.mapTextContent8') as string;
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
          this.sideTitle = this.$t('m.wiee.mapTextTitle11') as string;
          this.sideContent = this.$t('m.wiee.mapTextContent11') as string;
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
