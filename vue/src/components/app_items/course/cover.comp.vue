<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isNotFound">无此专栏</error>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="courses" v-else>
      <top-nav></top-nav>

      <div class="cover" v-once>
        <img :src="courseInfo.cover169Url" alt="专栏封面">
      </div>

      <header class="block" v-once>
        <h1 class="title">{{courseInfo.subject}}</h1>
        <p class="period">共{{courseInfo.totalVol}}期</p>
        <div class="info">
          <img class="avatar avatar-round avatar-45" :src="courseInfo.speaker.coverUrl" alt="嘉宾头像">
          <div class="intro">
            <strong class="nick">{{courseInfo.speaker.subject}}</strong>
            <p class="content">{{courseInfo.speaker.title}}</p>
          </div>
        </div>
      </header>

      <section class="courses-intro block">
        <div class="head">
          <h2>课程简介</h2>
          <a href="" @click.prevent="toggleCollape()" :style="{textDecoration: 'none'}">{{!isIntroCollape ? '折叠' :
            '展开'}}</a>
        </div>
        <div class="intro article-content no-margin"
             v-bind:class="{'collaped': isIntroCollape}" v-html="courseInfo.content"></div>
      </section>

      <section class="courses-list block" >
        <div class="head">
          <h2>专栏列表</h2>
          <span>{{courseInfo.currentVol}}/{{courseInfo.totalVol}}</span>
        </div>
        <ul class="list">
          <li v-for="(item, index) in items"
              :class="{'not-ready': item.isStatusNotReady, 'need-pay': item.isStatusReady && !courseInfo.paid && item.payType != 3 }">

            <div class="top">
              <div class="item-detail">
                <h3 class="item-title">{{getCourseItemIndex(item)}}{{item.subject}}</h3>
                <p class="item-intro" @click="go(item)">{{item.desc}}</p>
                <audio-bar class="audio-bar"
                           v-if="item.isTypeAudio && !item.isStatusNotReady && (item.payType == 3 || courseInfo.paid)"
                           :audioUrl="item.audioUrl"></audio-bar>
              </div>

              <div class="operation-area" @click="go(item)">
                <i class="bi bi-paper3" v-if="item.isTypePost"></i>
                <i class="bi bi-paper3" v-else-if="item.isTypeAudio"></i>
                <i class="bi bi-video2" v-else-if="item.isTypeVideo"></i>
                <span class="tips">{{itemBtnText(item)}}</span>
              </div>
            </div>

            <section class="item-intro-toggle block"
                     v-if=" !item.isStatusNotReady && (item.payType == 3 || courseInfo.paid) ">
              <div class="head">
                <h4>课时简介</h4>
                <a href="" @click.prevent="itemToggle(index)" :style="{textDecoration: 'none'}">{{ item.toggle ? '折叠' :
                  '展开'}}</a>
              </div>
              <div class="intro article-content no-margin"
                   v-bind:class="{'item-collaped': !item.toggle}" v-html="item.content"></div>
            </section>
          </li>
        </ul>
      </section>

      <footer >
        <button class="button button-outline" v-if="false">赠送给好友</button>
        <button class="button button-primary" @click="go()" :disabled="isPaying"><span class="origin-fee"
                                                                                       v-if="originFee&&!isPaid">{{originFee}}</span>{{btnText}}
        </button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .courses {
    background-color: $color-gray5;
    overflow: auto;
    //height: calc(100vh - 50px);

    .cover {
      position: relative;

      &:before {
        content: "";
        display: block;
        padding-top: 56.2%;
      }

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .block {
      padding: 20px 15px;
      box-shadow: 0 2px 2px rgb(236, 236, 236);
      margin-bottom: 10px;
      background-color: $color-w;

      &.no-border {
        box-shadow: none;
        margin-bottom: 0;
      }

      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;

        h2 {
          font-size: $font-size-18;
          color: $color-dark-gray;
          font-weight: normal;
        }

        a, span {
          flex-shrink: 0;
          font-size: $font-size-14;
          color: $color-dark-gray;
        }

        a {
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    header {
      .title {
        font-size: $font-size-24;
        color: $color-dark-gray;
        line-height: 1.25em;
        margin-bottom: 15px;
      }

      .period {
        font-size: $font-size-14;
        color: $color-gray3;
        margin-bottom: 20px;
      }

      .info {
        display: flex;

        .avatar {
          flex-shrink: 0;
          margin-right: 10px;
        }

        .intro {
          .nick {
            display: block;
            font-size: $font-size-14;
            color: $color-dark-gray;
            margin-bottom: 5px;
          }

          .content {
            font-size: $font-size-14;
            color: $color-gray3;
            line-height: 1.57em;
            word-break: break-all;
            white-space: pre-wrap;
            text-align: justify;
          }
        }
      }
    }

    .courses-intro {
      .intro {
        font-size: $font-size-16;
        color: $color-gray3;
        line-height: 1.75em;
        max-height: 100000px;
        transition: max-height .3s;
        overflow: hidden;

        &.collaped {
          max-height: 300px;
        }
      }
    }

    .courses-list {
      box-shadow: none;
      margin-bottom: 50px;

      .head {
        margin-bottom: 20px;
      }

      .list {
        li {
          border-bottom: solid 1px rgb(236, 236, 236);
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;

          .top {
            display: flex;
            flex-direction: row;
            width: 100%;
            align-items: center;
            justify-content: space-between;

            .item-detail {
              flex-grow: 1;
              overflow: hidden;

              .item-title {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: $font-size-16;
                color: $color-dark-gray;
                margin-bottom: 5px;
              }

              .item-intro {
                overflow: hidden;
                display: -webkit-box;
                text-overflow: ellipsis;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                white-space: pre-wrap;
                text-align: justify;
                line-height: 1.5em;
                font-size: $font-size-14;
                color: $color-gray3;
                margin-right: 10px;
                margin-bottom: 5px;
              }

              .audio-bar {
                margin: 4px 10px 4px 0;
              }
            }

            .operation-area {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: auto;

              .bi {
                font-size: 22px;
                color: $color-dark-gray;
                margin: 8px;
              }

              .duration, .tips {
                font-size: $font-size-12;
                line-height: 1em;
              }

              .duration {
                margin-bottom: 12px;
                color: $color-dark-gray;
              }

              .tips {
                color: $color-gray3;
                padding-bottom: 10px;
                white-space: nowrap;
              }
            }
          }

          .item-intro-toggle {
            box-shadow: unset;
            margin: 6px;
            padding: 0 4px 0 0;
            width: 100%;

            .head {
              margin-bottom: 6px;
            }

            .intro {
              font-size: $font-size-16;
              color: $color-gray3;
              line-height: 1.75em;
              max-height: 100000px;
              transition: max-height .3s;
              overflow: hidden;

              &.item-collaped {
                max-height: 0;
              }
            }
          }

          &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }

          &.need-pay {
            .item-detail {
              .item-title {
                color: $color-gray3;
              }
            }

            .operation-area {
              .bi, .duration {
                color: $color-gray3;
              }
            }
          }

          &.not-ready {
            .item-detail {
              .item-title, .item-intro, time {
                color: #c8c8c8;
              }
            }

            .operation-area {
              .bi, .duration, .tips {
                color: #c8c8c8;
              }
            }
          }

        }
      }
    }

    footer {
      position: fixed;
      width: 100%;
      max-width: 1024px;
      bottom: 0px;
      background-color: $color-w;
      left: 0;

      .button {
        border-radius: 0;
        height: 50px;
        line-height: 50px;
      }

      .button-primary {
        flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: bold;

        .origin-fee {
          font-weight: normal;
          text-decoration: line-through;
          padding-right: 10px;
        }
      }

      .button-outline {
        width: 40%;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component, Watch} from 'vue-property-decorator';
  import {getCourseInfo, listCourseItems, joinGroup} from '../../../shared/api/course.api';
  import {getUserInfoCache} from '../../../shared/api/user.api';
  import {Course, CourseItem} from '../../../shared/api/course.model';
  import {UserInfoModel} from "../../../shared/api/user.model";
  import padStart from 'lodash/padStart';
  import {Store} from "../../../shared/utils/store";
  import {createOrder} from '../../../shared/api/order.api';
  import {pay} from '../../../shared/api/pay.api';
  import {PostOrderObject, OrderObjectType} from "../../../shared/api/order.model";
  import {ApiError} from '../../../shared/api/xhr';
  import {ApiCode, ApiErrorMessage} from '../../../shared/api/code-map.enum';
  import {showTips} from '../../../store/tip';
  import {setPaymentNone} from "../../../store/payment";
  import {getRelativePath} from '../../../shared/utils/utils';
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from '../../../shared/utils/share';
  import {isInWechat,isInApp} from "../../../shared/utils/utils";
  import {host} from "../../../env/environment";
  import audioBar from "../../../shared/audio-bar.comp.vue";
  import {params} from "../../../shared/utils/utils";

  @Component({
    components: {
      audioBar: audioBar,
    }
  })
  export default class CoverComponent extends Vue {
    id = '';
    courseInfo = new Course({});
    userInfo: UserInfoModel | null = null;
    isLoading = false;
    isError = false;
    isIntroCollape = true;
    items: CourseItem[] = [];
    isPaying = false;
    isNotFound = false;
    isPaid = false;
    cashbackId = '';
    isInApp = isInApp;
    created() {
      this.id = this.$route.params['courseId'];

      try {
        if (isInWechat) {
          this.userInfo = getUserInfoCache(true);
        } else {
          this.userInfo = getUserInfoCache(false);
        }
      } catch (e) {
      }

      this.routeChange();
    }

    @Watch('$route')
    routeChange() {
      if (!this.fromPaymentResult()) {
        this.initData();
      }
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;
      this.cashbackId = this.$route.query['cashbackId'];

      try {
        this.courseInfo = await getCourseInfo(this.id);
        this.isPaid = this.courseInfo.currentUserInfo && this.courseInfo.currentUserInfo.paid;

        this.$emit('setGroupId', this.courseInfo.groupId);
        this.items = await listCourseItems(this.id);
      } catch (e) {
        if (e instanceof ApiError && e.code === ApiCode.ErrNotFound) {
          this.isNotFound = true;
        } else {
          this.isError = true;
        }
        throw e;
      } finally {
        this.isLoading = false;
        if (isInWechat) {
          this.share();
        }
      }
    }

    async share() {
      await initWechat();
      setShareInfo(this.courseInfo.subject,
        `我正在「造就」学习《${this.courseInfo.subject}》,期待你的加入`,
        `${host.assets}/assets/img/zaojiu-logo.jpg`,
        `${host.self}${this.$route.fullPath}`);
    }

    fromPaymentResult() {
      const payResult = this.$route.query['payResult'];

      if (!payResult) return false;

      if (payResult === 'success') {
        showTips('支付成功');
        joinGroup(this.courseInfo.groupId);
        setPaymentNone();
      } else if (payResult === 'cancel') {
        showTips('订单未支付');
      } else {
        showTips('支付失败，请重试');
        console.error(decodeURIComponent(payResult));
      }

      this.$router.back();

      return true;
    }

    get btnText(): string {
      const latestViewedCourseItem: { [key: string]: string } = Store.localStore.get('latestViewedCourseItem') || {};
      const latestViewedItemId = latestViewedCourseItem[this.id] || '';
      const latestViewedItem = this.items.find((item) => item.id === latestViewedItemId);

      if (this.courseInfo && this.courseInfo.isNeedPay) {
        if (!this.courseInfo.currentUserInfo) {
          // 未登录
          return `支付: ${this.courseInfo.totalFee.toYuan()}`;
        } else if (!this.courseInfo.currentUserInfo.paid) {
          // 已登录，未付费
          if (this.userInfo && this.userInfo.isMember) {
            if (this.courseInfo.memberFee.value === 0) {
              return `会员免费`;
            } else {
              return `会员价: ${this.courseInfo.memberFee.toYuan()}`;
            }
          } else {
            if (this.courseInfo.totalFee.value === 0) {
              return `限时免费`;
            } else {
              return `支付: ${this.courseInfo.totalFee.toYuan()}`;
            }
          }
        } else {
          if (latestViewedItem) {
            return `继续阅读 ${this.getCourseItemIndex(latestViewedItem, false)}`;
          } else {
            return '阅读专栏';
          }
        }
      } else {
        if (latestViewedItem) {
          return `继续阅读 ${this.getCourseItemIndex(latestViewedItem, false)}`;
        } else {
          return '阅读专栏';
        }
      }
    }

    get originFee(): string {
      if (this.courseInfo.originFee.value && this.courseInfo.originFee.value !== this.courseInfo.totalFee.value) {
        return this.courseInfo.originFee.toYuan();
      }

      return '';
    }

    itemBtnText(item: CourseItem): string {
      if (item.isStatusNotReady) {
        return '即将上线';
      } else if (item.isPayTypeCourse && !this.courseInfo.paid) { // TODO: payTypeSingle
        return '收费';
      } else {
        if (item.isTypeVideo) {
          return item.isPayTypeFree && !this.courseInfo.paid ? '试看' : '观看';
        } else if (item.isTypeAudio) {
          return item.isPayTypeFree && !this.courseInfo.paid ? '图文' : '图文';
        } else if (item.isTypePost) {
          return item.isPayTypeFree && !this.courseInfo.paid ? '试读' : '图文';
        }
      }

      return '进入';
    }

    getCourseItemIndex(item: CourseItem, withSuffix = true): string {
      const index = this.items.findIndex(_item => _item.id === item.id);
      return index !== -1 ? padStart(`${index + 1}`, 3, '0') + (withSuffix ? ' | ' : '') : '';
    }


    toggleCollape() {
      this.isIntroCollape = !this.isIntroCollape;
    }

    itemToggle(index: number) {
      this.items[index].toggle = this.items[index].toggle ? false : true;
      return;
    }

    go(item?: CourseItem) {
      if (item && item.isStatusNotReady) return;

      const checkLogin = (to: string) => {
        // 未登录
        if (!this.userInfo) {
          this.$router.push({path: '/signin', query: {redirectTo: to}});
          return false;
        }

        return true;
      };

      const checkMobileBinded = (to: string) => {
        // 未绑定手机
        if (this.userInfo && this.userInfo.isMobileBinded) {
          return true;
        }
        this.$router.push({path: '/mobile-bind-event', query: {redirectTo: to}});
        return false;
      };
      if (item) {
        // ready and paid or free item
        if (item.isStatusReady && (item.payType == 3 || (item.isPayTypeCourse && this.courseInfo.paid))) {
          const to = `/app/course/${this.id}/items/${item.id}`;
          if (checkLogin(to)) this.$router.push({path: to});
        }
      } else {
        const latestViewedCourseItem: { [key: string]: string } = Store.localStore.get('latestViewedCourseItem') || {};
        const latestViewedItemId = latestViewedCourseItem[this.id] || '';
        const latestViewedItem = this.items.find((item) => item.id === latestViewedItemId);

        if (this.courseInfo.paid) {
          let to = '';
          if (latestViewedItem) {
            to = `/app/course/${this.id}/items/${latestViewedItem.id}`;
          } else if (this.items.length) {
            to = `/app/course/${this.id}/items/${this.items[0].id}`;
          }

          if (checkLogin(to)) this.$router.push({path: to});
        } else {
          if (checkLogin(this.$route.fullPath) && checkMobileBinded(this.$route.fullPath)) {
            this.createOrder();
          }
        }
      }
    }

    async createOrder() {
      if (this.isPaying) return;

      this.isPaying = true;
      const orderQuery = new PostOrderObject(this.id, OrderObjectType.Course, 1);

      try {
        const orderMeta = await createOrder([orderQuery], [], false, this.cashbackId);
        await this.pay(orderMeta.orderNo);
      } catch (e) {
        if (e instanceof ApiError) {
          const code = e.code;

          if (code === ApiCode.ErrOrderNeedProcessOthers) {
            const oldOrderNum = e.originError.response && e.originError.response.data.data.orderNo;
            this.pay(oldOrderNum);
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

    async pay(orderNo: string) {
      await pay(orderNo);
      this.$router.push({path: `/course/${this.id}/cover`, query: {payResult: 'success'}});
    }
  }
</script>
