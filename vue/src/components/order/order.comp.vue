<template>
  <div class="container" @click="closeDiscountSelector()">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <div class="invalid-order abs-center" v-else-if="isInvalidOrder">无效订单</div>
    <error class="abs-center" @retry="initData()" v-else-if="isError"></error>
    <div class="order" v-else>
      <div class="old-order" v-if="orderId">
        <div class="order-container">
          <div class="status">
            <div v-if="order.order.isPending">剩余支付时间：<strong>{{order.order.remainDuration.format('mm:ss', {trim: false})}}</strong>
            </div>
            <div v-if="order.order.isClosed"><strong>订单已关闭</strong></div>
            <div v-if="order.order.isSuccess"><strong>支付成功</strong></div>
          </div>

          <div class="block">
            <div class="item" v-for="item in order.items">
              <img class="cover" :src="item.cover" alt="商品图片">
              <div class="detail">
                <div class="title">{{item.subject}}</div>
                <div class="desc">{{item.desc}}</div>
                <div class="price-amount">
                  <div class="price-fee">
                    <div class="fee">{{item.fee.toYuan()}}</div>
                    <div class="price" v-if="item.fee.value !== item.price.value">{{item.price.toYuan()}}</div>
                  </div>
                  <div class="amount">×{{item.nums}}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="discount block" v-if="order.discounts.length">
            <div class="row">
              <span class="title">优惠</span>
            </div>
            <div class="row" v-for="discount in order.discounts">
              <span class="title">{{discount.title}}</span>
            </div>
          </div>

          <div class="amount block">
            <div class="row">
              <span class="title">商品金额</span>
              <span class="content">{{order.order.totalPrice.toYuan()}}</span>
            </div>
            <div class="row" v-if="order.order.totalDiscountAmount.value">
              <span class="title">优惠金额</span>
              <span class="content">{{order.order.totalDiscountAmount.toYuan()}}</span>
            </div>
            <div class="row" v-if="!order.order.isPending">
              <span class="title">合计</span>
              <span class="content">{{order.order.totalDiscountedFee.toYuan()}}</span>
            </div>
          </div>

          <div class="time block">
            <div class="row">
              <span class="title">订单编号</span>
              <span class="content">{{order.order.orderNo}}</span>
            </div>
            <div class="row">
              <span class="title">创建时间</span>
              <span class="content">{{order.order.createdAt.format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div class="row" v-if="order.order.isSuccess">
              <span class="title">付款时间</span>
              <span class="content">{{order.order.finishedAt.format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
          </div>
        </div>

        <footer v-if="order.order.isPending">
          <div class="fee">合计: {{order.order.totalDiscountedFee.toYuan()}}</div>
          <button class="button button-primary" v-if="order.isPending" @click="pay()" :disabled="isPaying">立即支付</button>
        </footer>
      </div>

      <div class="new-order" v-else>
        <div class="order-container">
          <div class="block">
            <div class="item" v-for="item in orderFee.items">
              <img class="cover" :src="item.cover" alt="商品图片">
              <div class="detail">
                <div class="title">{{item.subject}}</div>
                <div class="desc">{{item.desc}}</div>
                <div class="price-amount">
                  <div class="price-fee">
                    <div class="fee">{{item.fee.toYuan()}}</div>
                    <div class="price" v-if="item.fee.value !== item.price.value">{{item.price.toYuan()}}</div>
                  </div>
                  <div class="amount">×{{item.nums}}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="discount block">
            <div class="row">
              <span class="title">优惠</span>
              <a class="discount-selector" href="" @click.prevent.stop="popupDiscountSelector()">选取优惠</a>
            </div>
            <div class="row" v-for="discount in orderFee.discounts">
              <span class="title">{{discount.title}}</span>
              <span class="content"><a href="" @click.prevent="deleteDiscount(discount.code)">删除</a></span>
            </div>
            <div class="row no-record" v-if="!orderFee.discounts.length">暂无优惠</div>
          </div>

          <div class="amount block">
            <div class="row">
              <span class="title">商品金额</span>
              <span class="content">{{orderFee.totalPrice.toYuan()}}</span>
            </div>
            <div class="row" v-if="orderFee.totalDiscountAmount.value">
              <span class="title">优惠金额</span>
              <span class="content">{{orderFee.totalDiscountAmount.toYuan()}}</span>
            </div>
          </div>
        </div>

        <footer>
          <div class="fee">合计: {{orderFee.totalDiscountedFee.toYuan()}}</div>
          <button class="button button-primary" @click="pay()" :disabled="isPaying">提交订单</button>
        </footer>

        <div class="discount-popup" :class="{'show': isDiscountSelectorShow}">
          <div class="header"><i class="bi bi-close"></i></div>
          <div class="row" v-for="discount in discountCodes">
            <div class="discount-title">
              {{discount.title}}
            </div>
            <input type="checkbox">
          </div>
          <button class="button button-primary" @click="closeDiscountSelector()">使用优惠</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    .invalid-order {
      font-size: $font-size-md;
      color: $color-gray3;
    }

    .order {
      .new-order, .old-order {
        position: relative;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .order-container {
          flex-grow: 1;
          overflow: auto;
        }

        footer {
          flex-shrink: 0;
        }
      }

      .block {
        border-bottom: solid 10px $color-gray4;

        .row {
          display: flex;
          padding: 15px;
          border-bottom: solid 1px $color-gray4;

          .title {
            flex-grow: 1;
            font-weight: bold;
          }

          .content {
            flex-shrink: 0;
          }

          &:last-child {
            border-bottom: none;
          }
        }
      }

      .status {
        padding: 15px;
        background-color: $color-gray4;
        color: $color-dark-gray;
        text-align: center;
        font-size: $font-size-md;
      }

      .item {
        display: flex;
        border-bottom: solid 1px $color-gray4;
        padding: 15px;

        &:last-child {
          border-bottom: none;
        }

        .cover {
          flex-shrink: 0;
          width: 120px;
          height: 120px;
          object-fit: cover;
          margin-right: 10px;
        }

        .detail {
          flex-grow: 1;
        }

        .title {
          color: $color-dark-gray;
          font-size: $font-size-lg;
          word-break: break-all;
          white-space: pre-wrap;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          margin-bottom: 5px;
        }

        .desc {
          color: $color-gray3;
          font-size: $font-size-sm;
          word-break: break-all;
          white-space: pre-wrap;
          line-height: 1.5em;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price-amount {
          display: flex;
          align-items: flex-end;

          .price-fee {
            flex-grow: 1;

            .fee {
              color: $color-danger;
              font-size: $font-size-lg;
            }

            .price {
              color: $color-gray3;
              font-size: $font-size-sm;
              text-decoration: line-through;
              padding-left: 5px;
            }
          }

          .amount {
            flex-shrink: 0;
            color: $color-gray3;
            font-size: $font-size-sm;
          }
        }
      }

      .no-record {
        justify-content: center;
        color: $color-gray3;
        font-size: $font-size-md;
      }

      .discount {
        .row {
          align-items: center;

          .discount-selector {
            color: $color-brand;
          }
        }
      }

      footer {
        height: 60px;
        display: flex;

        .fee {
          flex-grow: 1;
          background-color: rgb(37, 37, 37);
          line-height: 60px;
          padding: 0 20px;
          color: $color-w;
          font-size: $font-size-lg;
          font-weight: bold;
        }

        .button {
          border-radius: 0;
          height: 100%;
          padding: 0 20px;
          width: auto;
        }
      }

      .discount-popup {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: $color-w;
        box-shadow: 0 0 2px $color-gray3;
        transform: translateY(100%);
        transition: transform .3s;
        padding: 15px;

        &.show {
          transform: translateY(0);
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {Money} from '../../shared/utils/utils';
  import {getUserInfo, getUserInfoCache} from "../../shared/api/user.api";
  import {OrderObject, PostOrderObject, OrderFee, Discount, Order} from "../../shared/api/order.model";
  import {checkOrderFee, listDiscountCode, createOrder, getOrder} from '../../shared/api/order.api';
  import {pay} from '../../shared/utils/pay';
  import {showTips} from '../../store/tip';
  import {setPaymentNone} from '../../store/payment';
  import {ApiError} from '../../shared/api/xhr';
  import {ApiCode} from '../../shared/api/code-map.enum';
  import {showModal} from '../../store/modal';

  @Component
  export default class OrderComponent extends Vue {
    orderId = '';
    order: Order = new Order({});
    itemsQuery: PostOrderObject[] = [];
    orderFee: OrderFee = new OrderFee({});
    discountCodes: Discount[] = [];
    isInvalidOrder = false;
    isLoading = false;
    isError = false;
    isCheckingOrder = false;
    isPaying = false;
    isDiscountSelectorShow = false;

    created() {
      this.routeChange();
    }

    @Watch('$route.params.id')
    routeChange() {
      // TODO: handle pay result;

      const isValid = this.processParams();
      if (isValid) {
        this.initData();
      }
    }

    processParams() {
      this.orderId = this.$route.params['id'];

      if (!this.orderId) {
        const itemsQueryStr = this.$route.query['items'];
        const itemsQuery = this.parseItemsQuery(itemsQueryStr);
        if (itemsQuery.length === 0) {
          this.isInvalidOrder = true;
          return;
        }
        this.itemsQuery = itemsQuery;
      }

      return !!this.orderId || this.itemsQuery.length;
    }

    parseItemsQuery(itemsQueryStr: string): PostOrderObject[] {
      if (!itemsQueryStr) return [];

      let itemParsed;
      try {
        itemParsed = JSON.parse(decodeURIComponent(itemsQueryStr));
      } catch (e) {
        return [];
      }

      if (!Array.isArray(itemParsed)) return [];

      const itemQuery: PostOrderObject[] = [];
      itemParsed.forEach(item => {
        itemQuery.push(new PostOrderObject(item.objectId, item.objectType, item.nums));
      });

      return itemQuery;
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;

      try {
        if (this.orderId) {
          await this.prepareOldOrder();
        } else {
          await this.prepareNewOrder();
        }
      } catch (e) {
        if (e instanceof ApiError &&
          e.originError.response &&
          e.originError.response.data.code === ApiCode.ErrNotFound
        ) {
          this.isInvalidOrder = true;
        } else {
          this.isError = true;
        }
      } finally {
        this.isLoading = false;
      }
    }

    async prepareOldOrder() {
      this.order = await getOrder(this.orderId);
    }

    async prepareNewOrder() {
      await this.checkOrder();
      await this.checkDiscount();
    }

    async handleError(e: Error | ApiError) {
      if (e instanceof ApiError) {
        if (e.code === ApiCode.ErrOrderNeedProcessOthers) {
          const oid = e.originError.response && e.originError.response.data.data.orderNo;
          await showModal('您有其他订单未处理', '去处理', false);
          this.$router.push({path: `/order/${oid}`})
        }
      }
    }

    async checkOrder(discountCodes: string[] = []) {
      let orderFee: OrderFee;
      try {
        orderFee = await checkOrderFee(this.itemsQuery, discountCodes, true);
      } catch (e) {
        // TODO: error handler
        // TODO: 400105 need process other order, need a modal
        this.handleError(e);
        // TODO: items error
        // TODO: discount error
        throw e;
      }

      this.orderFee = orderFee;
    }

    async checkDiscount() {
      try {
        this.discountCodes = await listDiscountCode(this.itemsQuery);
      } catch (e) {
        // TODO: error handler
      }
    }

    isMemberOrder(): boolean {
      return this.orderId ? this.order.hasMemberItem : this.orderFee.hasMemberItem;
    }

    isEventOrder(): boolean {
      return this.orderId ? this.order.hasEventItem : this.orderFee.hasEventItem;
    }

    async processPayResult() {
      setPaymentNone();
      showTips('支付成功');

      if (this.isMemberOrder()) {
        await getUserInfo(false);
        this.$router.push({path: '/my/member'});
      } else if (this.isEventOrder) {
        this.$router.push({path: '/my/tickets'});
      } else {
        this.$router.push({path: '/my/orders'});
      }
    }

    pay() {
      if (this.orderId) {
        this.payOldOrder();
      } else {
        this.payNewOrder();
      }
    }

    async payOldOrder() {
      this.isPaying = true;

      try {
        await pay(this.orderId);
      } catch (e) {
        throw e;
        // TODO: error handler
      } finally {
        this.isPaying = false;
      }

      await this.processPayResult();
    }

    async payNewOrder() {
      this.isPaying = true;

      const discountCode = this.orderFee.discounts.map(discount => discount.code);

      try {
        const orderMeta = await createOrder(this.itemsQuery, discountCode);
        await pay(orderMeta.orderNo);
      } catch (e) {
        if (e === 'cancel') {
          showTips('订单未支付');
          this.$router.push({path: '/my/orders'});
        } else {

        }
        // TODO: error handler
        throw e;
      } finally {
        this.isPaying = false;
      }

      this.processPayResult();
    }

    popupDiscountSelector() {
      this.isDiscountSelectorShow = true;
    }

    closeDiscountSelector() {
      this.isDiscountSelectorShow = false;
    }

    addDiscount() {

    }

    deleteDiscount(deletingCode: string) {
      this.isCheckingOrder = true;

      try {
        const remainCodes = this.orderFee.discounts.map(discount => discount.code).filter(code => code !== deletingCode);
        this.checkOrder(remainCodes);
      } finally {
        this.isCheckingOrder = false;
      }
    }
  }
</script>
