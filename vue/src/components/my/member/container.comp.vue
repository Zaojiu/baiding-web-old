<template>
  <div class="member-activate">
    <article class="member-page">
      <top-nav></top-nav>
      <div class="header">
        <div class="left">
          <span class="title">造就会员</span>
          <span class="time" v-if="timeOver">{{timeOver}}到期</span>
        </div>
        <div class="btn" v-if="showBuyBtn" @click="goIntro">续费</div>
      </div>
      <nav>
        <ul class="nav">
          <li v-if="isMember"
              @click="changeNav(0)"
              :class="{'active':navIndex===0,'little-padding':memberType!==1}">
            会员卡
          </li>
          <li v-if="!isMember"
              @click="changeNav(1)"
              :class="{'active':navIndex===1,'little-padding':memberType!==1}">
            特别优惠
          </li>
          <li v-if="isMember&&memberType === 1"
              @click="changeNav(2)"
              :class="{'active':navIndex===2,'little-padding':memberType!==1}">
            计划表
          </li>
          <li @click="changeNav(3)"
              :class="{'active':navIndex===3,'little-padding':memberType!==1}">
            专属视频
          </li>
          <li @click="changeNav(4)"
              :class="{'active':navIndex===4,'little-padding':memberType!==1}">
            会员课程
          </li>
          <li v-if="!isAndroid" @click="changeNav(5)"
              :class="{'active':navIndex===5,'little-padding':memberType!==1}">
            干货下载
          </li>
        </ul>
      </nav>
      <section class="member-content"
               :class="{
                  'submargin':isCard,
                  'web-btn-show':!isInApp&&!isMember,
                  'web-btn-hide':!isInApp&&isMember,
                  'app-btn-show':isInApp&&!isMember,
                  'app-btn-hide':isInApp&&isMember,
          }"
               @touchstart="touchStart"
               @touchmove="touchMove"
               @touchend="touchEnd">
        <transition name="slide-left">
          <router-view :is-member="isMember"></router-view>
        </transition>
      </section>
    </article>
    <footer v-if="!isMember">
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
      .header {
        height: 54px;
        padding: 11px 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .left {
          color: #f2f2f2;

          .title {
            line-height: 30px;
            font-size: 30px;
            font-weight: bold;
          }
        }

        .time {
          font-weight: normal;
          font-size: 15px;
          padding-left: 20px;
        }
        .btn {
          font-size: 14px;
          color: #fff;
          background: linear-gradient(rgb(204, 169, 104), rgb(154, 120, 58));
          display: inline-block;
          padding: 4px 20px;
          border-radius: 22px;
          line-height: 16px;
        }

        @media (max-width: 335px) {
          .left {
            .title {
              line-height: 26px;
              font-size: 26px;
            }
          }

          .time {
            font-size: 14px;
            padding-left: 10px;
          }
          .btn {
            padding: 3px 16px;
          }
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
        .little-padding {
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
        height: calc(100vh - 148px);
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
  import {getUserInfoCache, refreshUserInfo} from "../../../shared/api/user.api";
  import {UserInfoModel} from '../../../shared/api/user.model'
  import {isInApp, isInWechat, isAndroid} from "../../../shared/utils/utils";
  import {initIOS, callHandler} from "../../../shared/utils/ios";
  import {PostOrderObject, OrderObjectType} from "../../../shared/api/order.model";
  import {host} from "../../../env/environment";
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from "../../../shared/utils/share";
  import {ApiError} from '../../../shared/api/xhr';
  import {ApiCode, ApiErrorMessage} from '../../../shared/api/code-map.enum';
  import {createOrder} from '../../../shared/api/order.api';
  import {Store} from "../../../shared/utils/store";
  import {showTips} from '../../../store/tip';
  import {getRelativePath} from '../../../shared/utils/utils';
  import {pay} from '../../../shared/api/pay.api';
  import {setPaymentNone} from "../../../store/payment";

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
    showBuyBtn = false;
    memberType = -1;//-1非会员 0 普通会员，1 火星会员
    timeOver = '';
    isAndroid = isAndroid && isInApp;
    isPaying = false;

    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        setShareInfo('造就会员', '', `${host.assets}/assets/img/zaojiu-logo.jpg`, `${host.self}/new-member/video`);
      }
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
      this.share();
      this.isInApp = isInApp;
      this.showBuyBtn = false;
      this.isCard = false;
      if (this.userInfo && this.userInfo.member.valid) {
        this.isMember = true;
        this.timeOver = moment(this.userInfo.member.expiredAt).format('YYYY-MM-DD');
        // 30天内过期，提示继续购买
        let diffTime = this.userInfo.member.expiredAt.diff(moment());
        if (diffTime < 2592000000 && diffTime > 0) {
          this.timeOver = this.userInfo.member.expiredAt.endOf('day').fromNow();
          this.showBuyBtn = true;
        }
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
          if (!this.isAndroid) {
            this.navIndex = 5;
          }
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
          if (!this.isAndroid) {
            this.$router.replace({path: '/new-member/download'});
          }
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
        case -1: // 非会员
          switch (this.navIndex) {
            case 1:
              if (up) {
                this.changeNav(3);
              } else {
                if (!this.isAndroid) {
                  this.changeNav(5);
                } else {
                  this.changeNav(4);
                }
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
                if (!this.isAndroid) {
                  this.changeNav(5);
                } else {
                  this.changeNav(1);
                }
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
        case 0: // 普通会员
          switch (this.navIndex) {
            case 0:
              if (up) {
                this.changeNav(3);
              } else {
                if (!this.isAndroid) {
                  this.changeNav(5);
                } else {
                  this.changeNav(4);
                }
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
                if (!this.isAndroid) {
                  this.changeNav(5);
                } else {
                  this.changeNav(0);
                }
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
        case 1: //火星会员
          switch (this.navIndex) {
            case 0:
              if (up) {
                this.changeNav(2);
              } else {
                if (!this.isAndroid) {
                  this.changeNav(5);
                } else {
                  this.changeNav(4);
                }
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
                if (!this.isAndroid) {
                  this.changeNav(5);
                } else {
                  this.changeNav(0);
                }
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

    checkMobileBinded(to: string) {
      // 未绑定手机
      if (this.userInfo && this.userInfo.isMobileBinded) {
        return true;
      }
      this.$router.push({path: '/mobile-bind-event', query: {redirectTo: to}});
      return false;
    };

    async goIntro() {
      this.userInfo = getUserInfoCache();

      //安卓端购买跳转
      if (this.isAndroid) {
        await initIOS();
        callHandler('payOrder', `${host.self}/orders?items=${encodeURIComponent(JSON.stringify([this.memberOrderObject]))}`);
        return;
      }

      // web 创建订单
      if (!this.checkMobileBinded(this.$route.fullPath)) {
        return;
      }
      this.createOrder();
    }

    //订单
    async createOrder() {
      if (this.isPaying) return;

      this.isPaying = true;

      try {
        const orderMeta = await createOrder([this.memberOrderObject], [], false);
        await this.payOrder(orderMeta.orderNo);
      } catch (e) {
        if (e instanceof ApiError) {
          const code = e.code;

          if (code === ApiCode.ErrOrderNeedProcessOthers) {
            const oldOrderNum = e.originError.response && e.originError.response.data.data.orderNo;
            this.payOrder(oldOrderNum);
          } else if (e.isUnauthorized) {
            Store.memoryStore.delete('userInfo');
            showTips(`请登录`);
            this.$router.push({path: '/signin', query: {redirectTo: getRelativePath(location.href, '/lives')}});
          } else {
            const errMessage = ApiErrorMessage[code] || `未知错误: ${code}`;
            showTips(errMessage);
          }

          throw e;
        }
      } finally {
        this.isPaying = false;
      }
    }

    async payOrder(orderNo: string) {
      await pay(orderNo, `${host.self}/new-member/card`);
      setPaymentNone();
      this.userInfo = await refreshUserInfo();
      this.init();
      if (!isInApp && !isInWechat) {
        // this.$router.push({path: `/new-member/card`, query: {payResult: 'success'}});
      }
      showTips('支付成功');
    }
  }
</script>
