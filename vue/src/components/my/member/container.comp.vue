<template>
  <div class="member-activate">
    <article class="member-page">
      <top-nav></top-nav>
      <h1>造就会员</h1>
      <nav>
        <ul class="nav">
          <li v-if="isMember" @click="changeNav(0)" :class="{active:navIndex===0,'app-padding':!isMember}">会员卡</li>
          <li @click="changeNav(1)" :class="{active:navIndex===1,'app-padding':!isMember}">特别优惠</li>
          <li @click="changeNav(2)" :class="{active:navIndex===2,'app-padding':!isMember}">专属视频</li>
          <li @click="changeNav(3)" :class="{active:navIndex===3,'app-padding':!isMember}">在线课程</li>
          <li @click="changeNav(4)" :class="{active:navIndex===4,'app-padding':!isMember}">干货下载</li>
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
        padding: 24px 42px;
        background-color: rgb(26, 26, 26);
        overflow: auto;
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

    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    created() {
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
      this.init();
    }

    async init() {
      this.navIndex = 1;
      this.isInApp = isInApp;
      this.isCard = false;
      if (this.userInfo) {
        this.isMember = this.userInfo.member.valid;
      } else {
        this.isMember = false;
      }
      switch (this.$route.name) {
        case "new-member.card":
          this.navIndex = 0;
          this.isCard = true;
          break;
        case "new-member.action":
          this.navIndex = 1;
          break;
        case "new-member.video":
          this.navIndex = 2;
          break;
        case "new-member.course":
          this.navIndex = 3;
          break;
        case "new-member.download":
          this.navIndex = 4;
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
          this.$router.push({path: '/new-member/video'});
          break;
        case 3:
          this.$router.push({path: '/new-member/course'});
          break;
        case 4:
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
        if (this.navIndex < 4) {
          this.changeNav(this.navIndex + 1);
        } else {
          if (this.isMember) {
            this.changeNav(0);
          } else {
            this.changeNav(1);
          }
        }
      } else if (this.moveClientX - this.originX > 20) {
        if (this.isMember) {
          if (this.navIndex > 0) {
            this.changeNav(this.navIndex - 1);
          } else {
            this.changeNav(4);
          }
        } else {
          if (this.navIndex > 1) {
            this.changeNav(this.navIndex - 1);
          } else {
            this.changeNav(4);
          }
        }
      }
    }

    async goIntro() {
      this.userInfo = getUserInfoCache();
      if (this.userInfo && this.userInfo.member.valid) {
        return;
      }

      if (this.userInfo && !this.userInfo.member.valid) {
        this.$router.push({
          path: '/orders',
          query: {items: encodeURIComponent(JSON.stringify([this.memberOrderObject]))}
        });
      }
    }
  }
</script>
