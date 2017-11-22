<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isNotFound">无此专栏</error>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="columns" v-else>
      <top-nav></top-nav>

      <div class="cover" v-once>
        <img :src="columnInfo.cover169Url" alt="专栏封面">
      </div>

      <header class="block" v-once>
        <h1 class="title">{{columnInfo.subject}}</h1>
        <p class="period">共{{columnInfo.totalVol}}期</p>
        <div class="info">
          <img class="avatar avatar-round avatar-45" :src="columnInfo.speaker.coverUrl" alt="嘉宾头像">
          <div class="intro">
            <strong class="nick">{{columnInfo.speaker.subject}}</strong>
            <p class="content">{{columnInfo.speaker.title}}</p>
          </div>
        </div>
      </header>

      <section class="columns-intro block">
        <div class="head">
          <h2>专栏简介</h2>
          <a href="" @click.prevent="toggleCollape()">{{isIntroCollape ? '折叠' : '展开'}}</a>
        </div>
        <div class="intro article-content no-margin" @click.prevent="toggleCollape()" v-bind:class="{'collaped': isIntroCollape}" v-html="columnInfo.content"></div>
      </section>

      <section class="columns-list block">
        <div class="head">
          <h2>专栏列表</h2>
          <span>{{columnInfo.currentVol}}/{{columnInfo.totalVol}}</span>
        </div>
        <ul class="list">
          <li v-for="item in items" :class="{'not-ready': item.isStatusNotReady, 'need-pay': item.isStatusReady && !columnInfo.paid}">
            <div class="item-detail">
              <h3 class="item-title">{{getColumnItemIndex(item)}}{{item.subject}}</h3>
              <p class="item-intro">{{item.desc}}</p>
              <time v-if="!item.publishAtParsed.isZero()">{{item.publishAtParsed.format('YYYY年MM月DD日')}}</time>
            </div>
            <div class="operation-area" @click="go(item)">
              <i class="bi bi-paper3" v-if="item.isTypePost"></i>
              <i class="bi bi-wave2" v-else-if="item.isTypeAudio"></i>
              <i class="bi bi-video2" v-else-if="item.isTypeVideo"></i>
              <span class="duration" v-if="getColumnItemDuration(item)">{{getColumnItemDuration(item)}}</span>
              <span class="tips">{{itemBtnText(item)}}</span>
            </div>
          </li>
        </ul>
      </section>

      <footer>
        <button class="button button-outline" v-if="false">赠送给好友</button>
        <button class="button button-primary" @click="go()" :disabled="isPaying"><span class="origin-fee" v-if="originFee">{{originFee}}</span>{{btnText}}</button>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .columns {
    background-color: $color-gray5;

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

    .columns-intro {
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

    .columns-list {
      box-shadow: none;
      margin-bottom: 50px;

      .head {
        margin-bottom: 20px;
      }

      .list {
        li {
          padding-bottom: 20px;
          border-bottom: solid 1px rgb(236, 236, 236);
          margin-bottom: 20px;
          display: flex;
          align-items: center;

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

            time {
              color: $color-gray3;
              font-size: $font-size-12;
              line-height: 1em;
            }
          }

          .operation-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 40px;

            .bi {
              margin-bottom: 7px;
              font-size: 22px;
              color: $color-dark-gray;
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
            }
          }
        }
      }
    }

    footer {
      position: fixed;
      width: 100%;
      max-width: 1024px;
      bottom: 0;
      background-color: $color-w;
      display: flex;

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
  import {Component,Watch} from 'vue-property-decorator';
  import {getColumnInfo, listColumnItems} from '../../shared/api/column.api';
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {Column, ColumnItem} from '../../shared/api/column.model';
  import {UserInfoModel} from "../../shared/api/user.model";
  import padStart from 'lodash/padStart';
  import {Store} from "../../shared/utils/store";
  import {createOrder} from '../../shared/api/order.api';
  import {pay} from '../../shared/api/pay.api';
  import {PostOrderObject, OrderObjectType} from "../../shared/api/order.model";
  import {ApiError} from '../../shared/api/xhr';
  import {ApiCode, ApiErrorMessage} from '../../shared/api/code-map.enum';
  import {showTips} from '../../store/tip';
  import {setPaymentNone} from "../../store/payment";
  import {getRelativePath} from '../../shared/utils/utils';

  @Component
  export default class CoverComponent extends Vue {
    id = '';
    columnInfo = new Column({});
    userInfo: UserInfoModel | null = null;
    isLoading = false;
    isError = false;
    isIntroCollape = true;
    items: ColumnItem[] = [];
    isPaying = false;
    isNotFound = false;

    created() {
      this.id = this.$route.params['id'];

      try {
        this.userInfo = getUserInfoCache(false);
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

      try {
        this.columnInfo = await getColumnInfo(this.id);
        this.items = await listColumnItems(this.id);
      } catch(e) {
        if (e instanceof ApiError && e.code === ApiCode.ErrNotFound) {
          this.isNotFound = true;
        } else {
          this.isError = true;
        }
        throw e;
      } finally {
        this.isLoading = false;
      }
    }

    fromPaymentResult() {
      const payResult = this.$route.query['payResult'];

      if (!payResult) return false;

      if (payResult === 'success') {
        showTips('支付成功');
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
      const latestViewedColumnItem: {[key: string]: string} = Store.localStore.get('latestViewedColumnItem') || {};
      const latestViewedItemId = latestViewedColumnItem[this.id] || '';
      const latestViewedItem = this.items.find((item) => item.id === latestViewedItemId);

      if (this.columnInfo && this.columnInfo.isNeedPay) {
        if (!this.columnInfo.currentUserInfo) {
          // 未登录
          return `支付: ${this.columnInfo.totalFee.toYuan()}`;
        } else if (!this.columnInfo.currentUserInfo.paid) {
          // 已登录，未付费
          if (this.userInfo && this.userInfo.isMember) {
            if (this.columnInfo.memberFee.value === 0) {
              return `会员免费`;
            } else {
              return `会员价: ${this.columnInfo.memberFee.toYuan()}`;
            }
          } else {
            if (this.columnInfo.totalFee.value === 0) {
              return `限时免费`;
            } else {
              return `支付: ${this.columnInfo.totalFee.toYuan()}`;
            }
          }
        } else {
          if (latestViewedItem) {
            return `继续阅读 ${this.getColumnItemIndex(latestViewedItem, false)}`;
          } else {
            return '阅读专栏';
          }
        }
      } else {
        if (latestViewedItem) {
          return `继续阅读 ${this.getColumnItemIndex(latestViewedItem, false)}`;
        } else {
          return '阅读专栏';
        }
      }
    }

    get originFee(): string {
      if (this.columnInfo.originFee.value && this.columnInfo.originFee.value !== this.columnInfo.totalFee.value) {
        return this.columnInfo.originFee.toYuan();
      }

      return '';
    }

    itemBtnText(item: ColumnItem): string {
      if (item.isStatusNotReady) {
        return '制作中';
      } else if (item.isPayTypeColumn && !this.columnInfo.paid) { // TODO: payTypeSingle
        return '收费';
      } else {
        if (item.isTypeVideo) {
          return item.isPayTypeFree && !this.columnInfo.paid ? '试看' : '观看';
        } else if (item.isTypeAudio) {
          return item.isPayTypeFree && !this.columnInfo.paid ? '试听' : '收听';
        } else if (item.isTypePost) {
          return item.isPayTypeFree && !this.columnInfo.paid ? '试读' : '阅读';
        }
      }

      return '进入';
    }

    getColumnItemIndex(item: ColumnItem, withSuffix = true): string {
      const index = this.items.findIndex(_item => _item.id === item.id);
      return index !== -1 ? padStart(`${index+1}`, 3, '0') + (withSuffix ? ' | ' : '') : '';
    }

    getColumnItemDuration(item: ColumnItem): string {
      if (item.isTypeAudio || item.isTypeVideo) {
        return item.duration.format('mm‘ss“', {trim: false});
      } else {
        return '';
      }
    }

    toggleCollape() {
      this.isIntroCollape=!this.isIntroCollape;
    }

    go(item?: ColumnItem) {
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

        this.$router.push({path: '/mobile-bind', query: {redirectTo: to}});
        return false;
      };

      if (item) {
        // ready and paid or free item
        if (item.isStatusReady && (item.isPayTypeFree || (item.isPayTypeColumn && this.columnInfo.paid))) {
          const to = `/columns/${this.id}/items/${item.id}`;
          if (checkLogin(to)) this.$router.push({path: to});
        }
      } else {
        const latestViewedColumnItem: {[key: string]: string} = Store.localStore.get('latestViewedColumnItem') || {};
        const latestViewedItemId = latestViewedColumnItem[this.id] || '';
        const latestViewedItem = this.items.find((item) => item.id === latestViewedItemId);

        if (this.columnInfo.paid) {
          let to = '';

          if (latestViewedItem) {
            to = `/columns/${this.id}/items/${latestViewedItem.id}`;
          } else if (this.items.length) {
            to = `/columns/${this.id}/items/${this.items[0].id}`;
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
      const orderQuery = new PostOrderObject(this.id, OrderObjectType.Column, 1);

      try {
        const orderMeta = await createOrder([orderQuery], [], false);
        await this.pay(orderMeta.orderNo);
      } catch(e) {
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
      this.$router.push({path: `/columns/${this.id}`, query: {payResult: 'success'}});
    }
  }
</script>
