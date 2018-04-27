<template>
  <article class="wiee-container"
           @touchstart="touchStart" @touchmove="touchMove"
  >
    <header class="header">
      <div class="img" @click="goToNextPage('detail')"><img
        src="https://og9s6vxbs.qnssl.com/wiee/index/home-right.png"/></div>
      <span @click="showMenu = true" class="font-set"><i class="bi bi-menu"></i></span>
      <div class="menu" v-if="showMenu">
        <div class="menu-list">
          <div class="close">
            <i @click="showMenu = false" class="bi bi-close"></i>
          </div>
          <ul class="menu-ul">
            <li @click="goTo('index')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu01.png"/>
              </div>
              <div class="text">
                <h4>首页</h4>
                <div>HOME</div>
              </div>
            </li>
            <li @click="goTo('guests')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu02.png"/>
              </div>
              <div class="text">
                <h4>嘉宾</h4>
                <div>GUESTS</div>
              </div>
            </li>
            <li @click="goTo('plan')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu03.png"/>
              </div>
              <div class="text">
                <h4>行程</h4>
                <div>AGENDA</div>
              </div>
            </li>
            <li @click="goTo('map')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu04.png"/>
              </div>
              <div class="text">
                <h4>地图</h4>
                <div>MAP</div>
              </div>
            </li>
            <li @click="goTo('live')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu05.png"/>
              </div>
              <div class="text">
                <h4>直播</h4>
                <div>LIVE</div>
              </div>
            </li>
          </ul>
          <div class="footer" @click="goTo('other')">
            <div class="btn">
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="content"
             :style="{overflow:showMenu?'hidden':'auto'}"
    >
      <div class="index">
        <img src="https://og9s6vxbs.qnssl.com/wiee/index/index-bg.jpg"/>
        <div class="index-action">
          <div class="img-wiee">
            <img src="https://og9s6vxbs.qnssl.com/wiee/index/wiee-zaojiu.png"/>
          </div>
          <div class="img" @click="goTo('index')">
            <img src="https://og9s6vxbs.qnssl.com/wiee/index/down.png"/>
          </div>
        </div>
      </div>

      <div id="index" class="zao-detail">
        <h2><img src="https://og9s6vxbs.qnssl.com/wiee/detail/ZAO.png"/></h2>
        <p>
          笛卡尔说：“我思故我在。”思考使人类真正获得了存在的价值，思想则是人类思考绽放出的耀眼火花。
        </p>
        <p>
          随着科技的飞速进步，它越来越深刻地改变着我们所处的世界。商业的价值转化发生了巨大的改变，城市的发展越来越依赖技术化的规划，教育的形态变得更加丰富多彩，文化与艺术则越来越多地与技术手段相结合。
        </p>
        <p>
          我们走到了一个值得深刻思考的十字路口，科技与人文在此交汇、碰撞，时间与空间的冲突、变革愈发频繁。我们试图在这个路口汇聚当下走在最前面的一群思想者，去探讨未来趋势的方向，去辩谈城市的构造与包容，去深思教育的未来形态，去诠释艺术的全新面貌。
        </p>
      </div>

      <div id="guests" class="guest">
        <h2>
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/guests.png"/>
        </h2>
        <div class="guest-show">
          <img :src="guestObj.url"/>
          <div class="action" ref="guests">
            <h3>{{guestObj.name}}</h3>
            <p v-for="item in guestObj.desc">{{item}}</p>
            <div class="button-group">
              <button @click="goToSpeaks(guestObj.id)">详情</button>
              <button @click="goToGroup()">提问</button>
            </div>
          </div>
        </div>
        <div class="guest-control">
          <div class="guest-item" v-for="item in guestArray" :class="{'active':guestIndex===item.index}"
               @click="chooseGuest(item.index)">
            <img :src="item.cover"/>
          </div>
        </div>
      </div>

      <div id="plan" class="plan">
        <h2>
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/agenda.png"/>
        </h2>
        <nav class="plan-nav">
          <span class="item" :class="{'active':planIndex === 0}" @click="choosePlan(0)">5月19日</span>
          <span class="item" :class="{'active':planIndex === 1}" @click="choosePlan(1)">5月20日</span>
          <span class="item" :class="{'active':planIndex === 2}" @click="choosePlan(2)">5月21日</span>
          <span class="item" :class="{'active':planIndex === 3}" @click="choosePlan(3)">5月22日</span>
        </nav>
        <div class="plan-content">
          <section class="plan-content">
            <h3>{{planData.desc}}</h3>
            <div class="step-item" v-for="(content,index) in planData.content">
              <div class="line" :class="{first: index===0,last: index===(planData.content.length - 1)}"></div>
              <div class="line-text" :class="{'other-text-top':!content.status}">
                <p class="start">{{content.start}}</p>
                <p class="end">{{content.end}}</p>
              </div>
              <div class="cycle" :class="{'other-top':!content.status}"></div>
              <div class="desc-content" :class="{'other-color':!content.status}">
                <div class="desc">
                  <h4 v-for="h4 in content.title">{{h4}}</h4>
                  <p>{{content.desc}}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div id="map" class="map">
        <h2>
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/map.png"/>
        </h2>
        <div class="map-content">
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/map-detail.png"/>
        </div>
        <div class="map-btn">
          <button @click="goToNextPage('map')">
            查看场馆信息
          </button>
        </div>
      </div>

      <div id="live" class="live" v-if="liveInfoListAll.length>0">
        <h2>
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/live.png"/>
        </h2>
        <header class="live-banner">
          <img class="img" :src="liveInfo.cover169Url" @error="liveInfo.cover169Url = defaultImg"/>
          <div class="play">
            <img src="https://og9s6vxbs.qnssl.com/wiee/detail/play.png"/>
          </div>
        </header>
        <div class="live-content">
          <div class="item" v-for="item in liveInfoList">
            <div class="item-banner">
              <img :src="item.cover169Url" @error="item.cover169Url = defaultImg"/>
            </div>
            <div class="text-content">
              <div class="item-text">
                <h3>{{item.subject}}</h3>
                <p>{{liveTime[liveInfo.id]}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="live-btn">
          <button @click="goToNextPage('live')">
            查看全部直播
          </button>
        </div>
      </div>
      <div class="collaboration" id="a">
        <h5>合作单位</h5>
        <div class="co-content">
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/link-1.png"/>
        </div>
      </div>
      <div class="collaboration padding-60">
        <h5>赞助单位</h5>
        <div class="co-content">
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/link-2.png"/>
        </div>
      </div>
    </section>
    <div class="footer-btn" v-if="showBtn" @click="goToGroup()">我想问</div>
  </article>
</template>

<style lang="scss" scoped>
  .wiee-container {
    height: 100vh;
    background-color: #000;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      width: 100%;
      height: 56px;
      top: 0;
      left: 0;
      padding: 0 20px;
      color: #fff;

      .img {
        font-size: 0;

        img {
          height: 24px;
        }
      }

      .font-set {
        font-size: 13px;
      }

      @media (min-height: 412px) {
        .img {
          font-size: 0;

          img {
            height: 26px;
          }
        }

        .font-set {
          font-size: 14px;
        }
      }

      button {
        color: #fff;
      }

      .menu {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, .8);
        z-index: 3;
        overflow: hidden;

        .menu-list {
          background-color: rgb(0, 0, 0);
          position: absolute;
          top: 0;
          right: 0;
          border-left: solid 1px rgb(26, 26, 26);
          height: 100vh;
          display: flex;
          flex-direction: column;

          .close {
            text-align: right;
            padding: 20px 20px 30px 0;
          }

          .menu-ul {
            padding: 0 65px 0 26px;
          }

          li {
            text-align: center;
            color: #fff;
            display: flex;
            align-items: baseline;
            justify-content: flex-start;
            margin-bottom: 46px;

            .icon {
              height: 18px;
              width: 18px;
              font-size: 0;
              margin-right: 13px;

              img {
                width: 100%;
              }
            }

            .text {
              text-align: left;

              h4 {
                font-size: 24px;
                line-height: 24px;
                letter-spacing: 9px;
                margin-bottom: 4px;
              }

              div {
                font-size: 16px;
                line-height: 16px;
                letter-spacing: 1.9px;
                font-weight: 600;
                padding-left: 1px;
              }
            }

          }

          .footer {
            text-align: center;
            flex: 1;
            position: relative;

            .btn {
              width: 170px;
              font-weight: bold;
              background: url("https://og9s6vxbs.qnssl.com/wiee/index/side-btn.png") no-repeat;
              background-size: 100% 100%;
              font-size: 17px;
              line-height: 17px;
              left: 50%;
              transform: translateX(-50%);
              height: 44px;
              position: absolute;
              bottom: 12px;
            }

          }
        }
      }

    }

    .footer-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 52px;
      background-color: rgb(0, 211, 193);
      text-align: center;
      color: #fff;
      line-height: 52px;
      font-weight: bold;
      z-index: 2;
    }

    .content {
      position: absolute;
      width: 100%;
      height: calc(100vh - 56px);
      top: 56px;
      left: 0;
      color: #fff;

      > div {
        background-color: #000;
      }

      .index {
        height: 100%;
        position: relative;
        font-size: 0;

        > img {
          margin-top: 34px;
          width: 100%;
        }
        .index-action {
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 15px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .img-wiee {
            margin-bottom: 28px;
            height: 29px;
            font-size: 0;
            img {
              height: 100%;
            }
          }

          .img {
            height: 55px;
            font-size: 0;
            img {
              height: 100%;
            }
          }

          @media (min-height: 412px) {
            .img-wiee {
              height: 32px;
            }
            .img {
              height: 61px;
            }
          }
        }

      }

      .zao-detail {
        padding: 35px 20px 0 20px;

        h2 {
          height: 44px;
          font-size: 0;
          margin-bottom: 15px;

          img {
            height: 100%;
          }
        }

        p {
          font-size: 16px;
          line-height: 26px;
          letter-spacing: 1.6px;
          font-weight: bold;

          & + p {
            margin-top: 30px;
          }
        }
      }

      .guest {
        padding-top: 36px;

        h2 {
          height: 27px;
          padding: 0 20px;
          font-size: 0;

          img {
            height: 100%;
          }
        }

        .guest-show {
          font-size: 0;
          position: relative;
          padding-top: 77.8%;
          font-size: 0;
          margin-top: 9px;

          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }

          .action {
            padding-right: 20px;
            width: 168px;
            font-size: 14px;
            position: absolute;
            bottom: 0;
            right: 0;
            padding-bottom: 41px;
            z-index: 1;

            .h3 {
              font-size: 18px;
              line-height: 18px;
            }

            p {
              margin-top: 7px;
              font-size: 13px;
              line-height: 18px;
              color: rgb(166, 166, 166)
            }

            .button-group {
              display: flex;
              align-items: center;
              margin-top: 80px;

              button {
                color: #fff;
                font-size: 12px;
                line-height: 12px;
                padding: 9px 0;
                width: 69px;
                text-align: center;
                border: 0;
                // border: 1px solid rgb(255, 255, 255);
                border-radius: 40px;
                background: url("https://og9s6vxbs.qnssl.com/wiee/detail/guest-btn.jpg") no-repeat;
                background-size: 100% 100%;

                &:first-child {
                  margin-right: 10px;
                }
              }
            }
          }
        }

        .guest-control {
          overflow-x: scroll;
          width: 100%;
          white-space: nowrap;
          font-size: 0;

          .guest-item {
            position: relative;
            display: inline-block;
            height: 70px;
            width: 60px;
            background-color: #1A1A1A;

            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }

            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              height: 70px;
              width: 60px;
              background-color: rgba(0, 0, 0, .5);
            }
          }

          .active {
            &::after {
              background-color: rgba(0, 0, 0, 0);
            }
          }
        }

      }

      .plan {
        padding: 50px 20px 0 20px;

        h2 {
          height: 23px;
          font-size: 0;

          img {
            height: 100%;
          }
        }

        .plan-nav {
          margin: 24px 0 32px 0;
          font-size: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          .item {
            font-size: 14px;
            line-height: 14px;
            padding-bottom: 8px;
            color: #fff;
            flex: 1;
            text-align: center;
            border-bottom: 2px solid rgb(216, 216, 216);
          }

          .active {
            position: relative;
            color: rgb(0, 211, 193);
            border-bottom: 2px solid rgb(0, 211, 193);

            &::after {
              content: '';
              display: block;
              position: absolute;
              left: 50%;
              bottom: -8px;
              width: 0;
              height: 0;
              transform: translateX(-50%);
              border-left: 5px solid transparent;
              border-top: 6px solid rgb(0, 211, 193);
              border-right: 5px solid transparent;
            }
          }
        }

        .plan-content {

          .first {
            top: 25px !important;
          }

          .last {
            height: 20px !important;
          }

          h3 {
            font-size: 20px;
            line-height: 20px;
            color: rgb(242, 242, 242);
            letter-spacing: 1px;
            margin-bottom: 0;
          }

          .step-item {
            display: flex;
            align-items: baseline;
            vertical-align: top;
            position: relative;
            padding: 0 13px 0 0;

            .line {
              position: absolute;
              left: 58px;
              top: -8px;
              height: 100%;
              width: 1px;
              background-color: rgb(230, 230, 230);
              padding: 38px 0 6px;
            }

            .line-text {
              position: absolute;
              top: 29px;
              text-align: right;

              .start {
                font-size: 14px;
                line-height: 14px;
                color: rgb(242, 242, 242);
                font-weight: bold;
                margin-bottom: 4px;
              }

              .end {
                font-size: 13px;
                line-height: 13px;
                color: rgb(166, 166, 166);
              }
            }

            .other-text-top {
              top: 42px;
            }

            .cycle {
              margin-left: 50px;
              border: 1px solid rgb(255, 255, 255);
              background-color: rgb(255, 255, 255);
              width: 16px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              border-radius: 16px;
              position: absolute;
              top: 25px;
              z-index: 1;
            }

            .desc-content {
              position: relative;
              margin: 0 0 0 77px;
              flex-grow: 1;
              .desc {
                background-color: transparent;
                border-radius: 4px;
                padding: 24px 0 0 0;

                h4 {
                  font-size: 14px;
                  padding-bottom: 6px;
                }

                p {
                  font-size: 14px;
                  line-height: 20px;
                  color: rgb(166, 166, 166)
                }
              }
            }

            .other-top {
              top: 40px;
            }

            .other-color {
              top: 10px;

              .desc {
                padding: 10px 18px;
                background: url("https://og9s6vxbs.qnssl.com/wiee/detail/rest.png") repeat;
                background-size: 100% 100%;
                margin: 20px 0;

                h4 {
                  padding: 0;
                }
              }
            }

          }

        }

      }

      .map {
        padding-top: 50px;

        h2 {
          height: 24px;
          font-size: 0;
          padding: 0 20px;

          img {
            height: 100%;
          }
        }

        .map-content {
          font-size: 0;

          img {
            font-size: 0;
            width: 100%;
          }
        }

        .map-btn {
          text-align: center;
          font-size: 0;
          padding: 12px 0 38px 0;

          button {
            color: #fff;
            height: 46px;
            width: 174px;
            border: 0;
            border-radius: 23px;
            font-size: 17px;
            font-weight: bold;
            background: url("https://og9s6vxbs.qnssl.com/wiee/detail/live-style.png") no-repeat;
            background-size: 100% 100%;
          }
        }

      }

      .live {
        padding: 40px 20px 16px 20px;

        h2 {
          margin-bottom: 21px;
          height: 25px;
          font-size: 0;

          img {
            height: 100%;
          }
        }

        .live-banner {
          position: relative;
          padding-top: 56.25%;
          background-color: #1A1A1A;
          font-size: 0;

          .play {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            height: 48px;
            width: 48px;
            font-size: 0;

            img {
              width: 100%;
            }
          }

          > .img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }

        .live-content {
          padding: 24px 0 20px 0;

          .item {
            display: flex;
            justify-content: left;
            align-items: center;
            margin-bottom: 20px;
            font-size: 0;

            .item-banner {
              width: 37%;
              padding-top: 20.81%;;
              background-color: #1A1A1A;
              font-size: 0;
              position: relative;

              img {
                border: 0;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
              }
            }

            .text-content {
              width: 63%;
              position: relative;
              font-size: 0;
              padding-top: 18%;

              .item-text {
                padding-left: 12px;
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;

                h3 {
                  font-size: 16px;
                  line-height: 20px;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }

                p {
                  font-size: 12px;
                  color: rgb(128, 128, 128);
                  white-space: pre-line;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                }
              }
            }
          }
        }

        .live-btn {
          text-align: center;

          button {
            color: #fff;
            height: 46px;
            line-height: 46px;
            width: 174px;
            border: 0;
            border-radius: 23px;
            font-size: 17px;
            font-weight: bold;
            background: url("https://og9s6vxbs.qnssl.com/wiee/detail/live-style.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }

      .collaboration {
        padding: 31px 20px 0 20px;

        h5 {
          font-size: 16px;
          line-height: 16px;
        }

        .co-content {
          padding-top: 12px;
          font-size: 0;

          img {
            width: 100%;
          }
        }
      }

      .padding-60 {
        padding-bottom: 60px;
      }

    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model'
  import {isInApp, isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";
  import {guests, PlanList} from './wiee.data';
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';
  import {LiveInfoModel} from "../../shared/api/lives.model";
  import {listNow} from '../../shared/api/lives.api';
  import {praseLiveTime} from '../../shared/utils/utils';

  @Component({})
  export default class ActivateComponent extends Vue {
    navIndex = 0;
    userInfo: UserInfoModel;
    isInApp = isInApp;
    originX: number;
    moveClientX: number;
    originY: number;
    moveClientY: number;
    showBtn = false;
    guestDom: any;
    guestIndex = 0;
    planIndex = 0;
    guestObj: { name: string, desc: string[], url: string } = guests[0];
    guestArray = guests;
    showMenu = false;
    planData: any = PlanList[0];
    liveInfo: LiveInfoModel;
    liveInfoList: LiveInfoModel[] = [];
    liveInfoListAll: LiveInfoModel[] = [];
    defaultImg = '/assets/img/default-cover.jpg';
    liveTime: { [liveId: string]: string } = {};


    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    created() {
      this.share();
      this.init();
      this.$nextTick(() => {
        this.guestDom = this.$refs['guests'];
      })
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        setShareInfo(
          '造就思想节：发现最有创造力的思想',
          `科技与人文交汇的十字路口`,
          `${host.assets}/assets/img/zaojiu-logo.jpg`,
          `${host.self}${this.$route.fullPath}`
        );
      }
    }

    async init() {
      this.liveInfoListAll = await listNow('', 4);
      for (let liveInfo of this.liveInfoListAll) {
        this.liveTime[liveInfo.id] = praseLiveTime(liveInfo);
      }
      this.liveInfo = this.liveInfoListAll[0];
      this.liveInfoList = this.liveInfoListAll.slice(1, 4);

    }

    goTo(tab: string) {
      this.showMenu = false;
      location.href = `/wv/wiee/index#${tab}`;
    }

    goToGroup() {
      this.$router.push({path: '/group/5aec2ad12cfc070001746a4d/cover'});
    }

    goToNextPage(page: string) {
      if (page !== 'live') {
        this.$router.push({path: `/wv/wiee/${page}`})
      } else {
        window.location.href = 'https://www.zaojiu.com/lives/wiee';
      }
    };

    goToSpeaks(id: string) {
      this.$router.push({path: `/wv/wiee/guests/${id}/desc`})
    };

    touchStart(e: TouchEvent) {

    }

    touchMove(e: TouchEvent) {
      let guestDom = (this.guestDom as HTMLElement);
      let rect = guestDom.getBoundingClientRect();
      let top = rect.top;
      if (top <= (document.documentElement.clientHeight - 70) && top > 300) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
      if (top <= 300) {
        this.showBtn = false;
      }
    }

    touchEnd() {
    }

    chooseGuest(index: number) {
      this.guestIndex = index;
      this.guestObj = guests[index];
    }

    choosePlan(index: number) {
      this.planIndex = index;
      switch (index) {
        case 0:
          this.planData = PlanList[0];
          break;
        case 1:
          this.planData = PlanList[1];
          break;
        case 2:
          this.planData = PlanList[2];
          break;
        case 3:
          this.planData = PlanList[3];
          break;
      }
    }
  }
</script>
