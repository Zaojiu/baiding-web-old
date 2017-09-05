<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="orders" v-scroll-view="{onBottom: onBottom}" v-else>
      <div class="order" v-for="order in orders">
        <div class="header">
          <span class="order-no">订单编号: <strong>{{order.order.orderNo}}</strong></span>
          <span class="order-status" :class="{pending: order.order.isPending, closed: order.order.isClosed, success: order.order.isSuccess}">{{order.order.statusHumanize}}</span>
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

        <div class="footer">
          <span class="fee">合计: <strong>{{order.order.totalDiscountedFee.toYuan()}}</strong></span>
          <button class="button button-outline" v-if="order.isPending" @click="cancel(order.order.orderNo)" :disabled="isCanceling[order.order.orderNo]">取消</button>
          <button class="button button-outline" @click="detail(order.order.orderNo)">详情</button>
          <button class="button button-primary" v-if="order.isPending" @click="pay(order)" :disabled="isPaying[order.order.orderNo]">支付</button>
        </div>
      </div>
      <bd-loading class="footer-loading" v-if="isFooterLoading"></bd-loading>
      <div class="no-more-record" v-else-if="isOnLatest">到底啦~</div>
      <div class="no-record" v-if="orders.length === 0">暂无订单</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    .orders {
      height: 100vh;
      overflow: auto;

      .order {
        border-bottom: solid 10px $color-gray4;

        .header {
          display: flex;
          flex-wrap: wrap;
          padding: 15px;
          border-bottom: solid 1px $color-gray4;

          .order-no {
            flex-grow: 1;
            font-size: $font-size-sm;
            color: $color-dark-gray;
            white-space: nowrap;
          }

          .order-status {
            flex-shrink: 0;
            font-size: $font-size-sm;
            color: $color-gray3;
          }
        }

        .item {
          display: flex;
          border-bottom: solid 1px $color-gray4;
          padding: 15px;

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

        .footer {
          display: flex;
          align-items: center;
          padding: 15px;

          .fee {
            flex-grow: 1;
          }

          .button {
            flex-shrink: 0;
            line-height: 1em;
            width: auto;
            height: auto;
            padding: 9px;
            margin-right: 8px;

            &.button-primary {
              padding: 10px;
            }

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }

      .footer-loading, .no-more-record {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .footer-loading {
        padding: 15px;
      }

      .no-more-record {
        background-color: $color-gray4;
        padding: 5px 0 15px;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {scrollView} from '../../shared/scroll-view/scroll-view.directive';
  import {Order, OrderStatus} from '../../shared/api/order.model';
  import {listOrders, getOrder, closeOrder} from '../../shared/api/order.api';
  import {showTips} from '../../store/tip';
  import {pay} from '../../shared/utils/pay';
  import {setPaymentNone} from '../../store/payment';
  import {getUserInfo} from "../../shared/api/user.api";

  @Component({
    directives: {
      scrollView,
    }
  })
  export default class OrderComponent extends Vue {
    orders: Order[] = [];
    last = '';
    isLoading = false;
    isError = false;
    isOnLatest = false;
    isPaying: {[key: string]: boolean} = {};
    isCanceling: {[key: string]: boolean} = {};
    isFooterLoading = false;

    created() {
      this.initData();
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;

      try {
        const result = await listOrders();
        this.orders = result.orders;
        this.last = result.last;
      } catch (e) {
        this.isError = true;
        throw e;
      } finally {
        this.isLoading = false;
      }
    }

    async refreshOrder(orderNo: string) {
      let newOrder: Order;

      try {
        newOrder = await getOrder(orderNo);
      } catch (e) {
        location.reload(true);
        throw e;
      }

      let index = -1;
      this.orders.forEach((order, i) => {
        if (order.order.orderNo === orderNo) index = i;
      });

      if (index != -1) this.orders.splice(index, 1, newOrder);
    }

    async cancel(orderNo: string) {
      this.isCanceling[orderNo] = true;

      try {
        await closeOrder(orderNo);
      } finally {
        this.isCanceling[orderNo] = false;
      }

      showTips('取消订单成功');
      this.refreshOrder(orderNo);
    }

    async processPayResult(order: Order) {
      setPaymentNone();
      showTips('支付成功');
      this.refreshOrder(order.order.orderNo);
    }

    async pay(order: Order) {
      this.isPaying[order.order.orderNo] = true;

      try {
        await pay(order.order.orderNo);
      } catch (e) {
        throw e;
        // TODO: error handler
      } finally {
        this.isPaying[order.order.orderNo] = false;
      }

      await this.processPayResult(order);
    }

    detail(orderNo: string) {
      this.$router.push({path: `/orders/${orderNo}`});
    }

    async onBottom() {
      if (this.isOnLatest) return;

      this.isFooterLoading = true;

      try {
        const result = await listOrders(true, this.last);
        this.orders.push(...result.orders);
        if (!result.last) this.isOnLatest = true;
        this.last = result.last;
      } finally {
        this.isFooterLoading = false;
      }
    }
  }
</script>
