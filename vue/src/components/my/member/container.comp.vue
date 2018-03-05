<template>
  <div class="member-activate">
    <article class="member-page">
      <top-nav></top-nav>
      <h1>造就会员<span v-if="timeOver">{{timeOver}}到期</span></h1>
      <nav>
        <ul class="nav">
          <li v-if="isMember"
              @click="changeNav(0)"
              :class="{'active':navIndex===0,'app-padding':!isMember||isMember&&memberType === 0}">
            会员卡
          </li>
          <li v-if="!isMember"
              @click="changeNav(1)"
              :class="{'active':navIndex===1,'app-padding':!isMember||isMember&&memberType === 0}">
            特别优惠
          </li>
          <li v-if="isMember&&memberType === 1"
              @click="changeNav(2)"
              :class="{'active':navIndex===2,'app-padding':!isMember||isMember&&memberType === 0}">
            计划表
          </li>
          <li @click="changeNav(3)"
              :class="{'active':navIndex===3,'app-padding':!isMember||isMember&&memberType === 0}">
            专属视频
          </li>
          <li @click="changeNav(4)"
              :class="{'active':navIndex===4,'app-padding':!isMember||isMember&&memberType === 0}">
            在线课程
          </li>
          <li @click="changeNav(5)"
              :class="{'active':navIndex===5,'app-padding':!isMember||isMember&&memberType === 0}">
            干货下载
          </li>
        </ul>
      </nav>
      <section class="member-content"
               :class="{
                  'submargin':isCard,
                  'web-btn-show':!isInApp&&(openBtn&&!isMember),
                  'web-btn-hide':!isInApp&&(!openBtn||isMember),
                  'app-btn-show':isInApp&&(openBtn&&!isMember),
                  'app-btn-hide':isInApp&&(!openBtn||isMember),
          }"
               @touchstart="touchStart"
               @touchmove="touchMove"
               @touchend="touchEnd">
        <transition name="slide-left">
          <router-view :is-member="isMember"></router-view>
        </transition>
      </section>
    </article>
    <footer v-if="!isMember&&openBtn">
      <button @click="goIntro">立即开通会员</button>
    </footer>
  </div>
</template>

<style lang="scss" scoped>

  .member-activate {
    background-color: rgb(36, 36, 36);
    overflow: hidden;
    .member-page {
      height: 100vh;
      h1 {
        padding: 12px 20px;
        color: rgb(242, 242, 242);
        line-height: 28px;
        font-size: 30px;
        span {
          font-weight: normal;
          font-size: 16px;
          padding-left: 20px;
        }
      }
      @media (max-width: 386px) {
        .nav {
          font-size: 14px !important;
        }
      }
      @media (max-width: 366px) {
        .nav {
          li {
            margin-right: 10px !important;
          }
        }
      }

      @media (max-width: 356px) {
        .nav {
          font-size: 12px !important;
        }
      }

      .nav {
        padding: 0 20px;
        font-size: 15px;
        display: flex;
        font-weight: bold;
        .app-padding {
          margin-right: 26px;
        }
        li {
          margin-right: 12px;
          color: rgb(242, 242, 242);
          line-height: 44px;
          position: relative;
          text-align: center;
        }
        .active {
          &:after {
            content: "";
            position: absolute;
            width: 112%;
            margin: 0 -6%;
            height: 4px;
            background-color: #d6ad60;
            bottom: 2px;
            left: 0;
            display: block;
          }
        }
      }
      .member-content {
        padding: 20px 20px 0 20px;
        background-color: rgb(26, 26, 26);
        overflow: hidden;
      }
      .submargin {
        padding: 24px 20px;
      }

      .web-btn-show {
        height: calc(100vh - 224px);
      }
      .web-btn-hide {
        height: calc(100vh - 146px);
      }
      .app-btn-show {
        height: calc(100vh - 174px);
      }
      .app-btn-hide {
        height: calc(100vh - 96px);
      }
    }
    footer {
      display: flex;
      position: absolute;
      bottom: 0;
      background-color: rgb(36, 36, 36);
      max-width: 1024px;
      width: 100%;
      padding: 15px;
      button {
        width: 100%;
        height: 48px;
        background: linear-gradient(rgb(204, 169, 104), rgb(154, 120, 58));
        color: #fff;
        font-size: 18px;
        font-weight: 700;
        border-radius: 4px;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {UserInfoModel} from '../../../shared/api/user.model'
  import {isInApp, isInWechat} from "../../../shared/utils/utils";
  import {initIOS, callHandler} from "../../../shared/utils/ios";
  import {PostOrderObject, OrderObjectType} from "../../../shared/api/order.model";

  @Component({})
  export default class ActivateComponent extends Vue {
    navIndex = 1;
    userInfo: UserInfoModel;
    memberOrderObject = new PostOrderObject('member-year', OrderObjectType.Member, 1);
    isCard = false;
    isMember = false;
    isInApp = false;
    originX: number;
    moveClientX: number;
    originY: number;
    moveClientY: number;
    openBtn = true;
    memberType = -1;//-1非会员 0 普通会员，1 火星会员
    timeOver = '';

    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    created() {
      try {
        if (isInApp) {
          let subject = this.$route.query['login'];
          if (subject === '1') {
            this.userInfo = getUserInfoCache(false);
          }
        } else if (isInWechat) {
          this.userInfo = getUserInfoCache(true);
        } else {
          this.userInfo = getUserInfoCache(false);
        }
      } catch (e) {

      }
      this.init();
    }

    async init() {
      this.navIndex = 1;
      this.isInApp = isInApp;
      this.isCard = false;
      if (this.userInfo && this.userInfo.member.valid) {
        this.isMember = true;
        this.timeOver = moment(this.userInfo.member.expiredAt).format('YYYY-MM-DD');
        if (this.userInfo.member.memberId && this.userInfo.member.memberId === 'member-mars') {
          this.memberType = 1;
        } else {
          this.memberType = 0;
        }
      } else {
        this.isMember = false;
        this.memberType = -1;
      }
      switch (this.$route.name) {
        case "new-member.card":
          this.navIndex = 0;
          this.isCard = true;
          break;
        case "new-member.action":
          this.navIndex = 1;
          break;
        case "new-member.plan":
          this.navIndex = 2;
          break;
        case "new-member.video":
          this.navIndex = 3;
          break;
        case "new-member.course":
          this.navIndex = 4;
          break;
        case "new-member.download":
          this.navIndex = 5;
          break;
        default:
      }
    }

    changeNav(navIndex: number) {
      switch (navIndex) {
        case 0:
          this.$router.push({path: `/new-member/card`});
          break;
        case 1:
          this.$router.push({path: '/new-member/action'});
          break;
        case 2:
          this.$router.push({path: '/new-member/plan'});
          break;
        case 3:
          this.$router.push({path: '/new-member/video'});
          break;
        case 4:
          this.$router.push({path: '/new-member/course'});
          break;
        case 5:
          this.$router.push({path: '/new-member/download'});
          break;
        default:
      }
    }

    touchStart(e: TouchEvent) {
      this.originX = e.touches[0].clientX;
      this.originY = e.touches[0].clientY;
      this.moveClientX = e.touches[0].clientX;
      this.moveClientY = e.touches[0].clientY;
    }

    touchMove(e: TouchEvent) {
      this.moveClientX = e.touches[0].clientX;
      this.moveClientY = e.touches[0].clientY;
    }

    touchEnd() {
      if (Math.abs(this.originY - this.moveClientY) - Math.abs(this.originX - this.moveClientX) > 5) {
        return;
      }
      if (this.originX - this.moveClientX > 20) {
        this.touchChangeNav(false);
      } else if (this.moveClientX - this.originX > 20) {
        this.touchChangeNav(true);
      }
    }

    touchChangeNav(up: boolean) {
      switch (this.memberType) {
        case -1:
          switch (this.navIndex) {
            case 1:
              if (up) {
                this.changeNav(3);
              } else {
                this.changeNav(5);
              }
              break;
            case 3:
              if (up) {
                this.changeNav(4);
              } else {
                this.changeNav(1);
              }
              break;
            case 4:
              if (up) {
                this.changeNav(5);
              } else {
                this.changeNav(3);
              }
              break;
            case 5:
              if (up) {
                this.changeNav(1);
              } else {
                this.changeNav(4);
              }
              break;
          }
          break;
        case 0:
          switch (this.navIndex) {
            case 0:
              if (up) {
                this.changeNav(3);
              } else {
                this.changeNav(5);
              }
              break;
            case 3:
              if (up) {
                this.changeNav(4);
              } else {
                this.changeNav(0);
              }
              break;
            case 4:
              if (up) {
                this.changeNav(5);
              } else {
                this.changeNav(3);
              }
              break;
            case 5:
              if (up) {
                this.changeNav(0);
              } else {
                this.changeNav(4);
              }
              break;
          }
          break;
        case 1:
          switch (this.navIndex) {
            case 0:
              if (up) {
                this.changeNav(2);
              } else {
                this.changeNav(5);
              }
              break;
            case 2:
              if (up) {
                this.changeNav(3);
              } else {
                this.changeNav(0);
              }
              break;
            case 3:
              if (up) {
                this.changeNav(4);
              } else {
                this.changeNav(2);
              }
              break;
            case 4:
              if (up) {
                this.changeNav(5);
              } else {
                this.changeNav(3);
              }
              break;
            case 5:
              if (up) {
                this.changeNav(0);
              } else {
                this.changeNav(4);
              }
              break;
          }
          break;
        default:
      }
    }

    async goIntro() {
      this.userInfo = getUserInfoCache();
      if (this.userInfo && this.userInfo.member.valid) {
        return;
      }

      //web端购买
      if (this.userInfo && !this.userInfo.member.valid) {
        this.$router.push({
          path: '/orders',
          query: {items: encodeURIComponent(JSON.stringify([this.memberOrderObject]))}
        });
      }
    }
  }
</script>
