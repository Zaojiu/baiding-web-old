<template>
  <div class="container" @click="closeDiscountSelector()">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <div class="invalid-order abs-center" v-else-if="isInvalidOrder">无效订单</div>
    <error class="abs-center" @retry="initData()" v-else-if="isError"></error>
    <div class="order" v-else>
      <top-nav class="top-nav"></top-nav>

      <div class="old-order" v-if="orderId">
        <div class="order-container">
          <div class="status">
            <div v-if="order.isPending">
              剩余支付时间：<strong>{{order.order.remainDuration.format('mm:ss', {trim: false})}}</strong>
            </div>
            <div v-if="order.isClosed"><strong>订单已关闭</strong></div>
            <div class="status-success" v-if="order.isSuccess"><strong>支付成功</strong></div>
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
              <span class="title">{{$t('m.order.price')}}</span>
              <span class="content">{{order.order.totalPrice.toYuan()}}</span>
            </div>
            <div class="row" v-if="order.order.totalDiscountAmount.value">
              <span class="title">{{$t('m.order.dicountPrice')}}</span>
              <span class="content">{{order.order.totalDiscountAmount.toYuan()}}</span>
            </div>
            <div class="row" v-if="!order.isPending">
              <span class="title">{{$t('m.order.totalPrice')}}</span>
              <span class="content">{{order.order.totalDiscountedFee.toYuan()}}</span>
            </div>
          </div>

          <div class="time block">
            <div class="row">
              <span class="title title-small">订单编号</span>
              <span class="content">{{order.order.orderNo}}</span>
            </div>
            <div class="row">
              <span class="title title-small">创建时间</span>
              <span class="content">{{order.order.createdAt.format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div class="row" v-if="order.isSuccess">
              <span class="title title-small">付款时间</span>
              <span class="content">{{order.order.finishedAt.format('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
          </div>
        </div>

        <footer v-if="order.isSuccess && order.hasEventItem">
          <button class="button button-primary button-block" @click="gotoMyTicket()">查看票券</button>
        </footer>

        <footer v-if="order.isPending">
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

          <div class="discount block" v-if="discountCodes.length">
            <div class="row">
              <span class="title">优惠</span>
              <a class="discount-selector" href="" @click.prevent.stop="popupDiscountSelector()">选取优惠</a>
            </div>
            <div class="row" v-for="discount in orderFee.discounts">
              <span class="title">{{discount.title}}</span>
              <span class="content"><a href="" :class="{disabled: isDiscountDeleting[discount.code]}"
                                       @click.prevent="deleteSelectedDiscount(discount)">移除</a></span>
            </div>
            <div class="row no-record" v-if="!orderFee.discounts.length">请选取优惠</div>
          </div>

          <div class="amount block">
            <div class="row">
              <span class="title">{{$t('m.order.price')}}</span>
              <span class="content">{{orderFee.totalPrice.toYuan()}}</span>
            </div>
            <div class="row" v-if="orderFee.totalDiscountAmount.value">
              <span class="title">{{$t('m.order.discountPrice')}}</span>
              <span class="content">{{orderFee.totalDiscountAmount.toYuan()}}</span>
            </div>
          </div>
        </div>

        <footer>
          <div class="fee">{{$t('m.order.totalPrice')}}: {{orderFee.totalDiscountedFee.toYuan()}}</div>
          <button class="button button-primary" @click="pay()" :disabled="isPaying">{{$t('m.order.submit')}}</button>
        </footer>

        <div class="discount-popup" :class="{'show': isDiscountSelectorShow}" @click.stop>
          <div class="header"><i class="bi bi-close" @click="closeDiscountSelector()"></i></div>
          <div class="wrapper">
            <div class="row" v-for="discount in discountCodes">
              <input type="checkbox" v-model="selectedDiscount" :id="discount.code" :value="discount"
                     :disabled="!discount.canUse">
              <label :for="discount.code" class="discount-title">{{discount.title}}</label>
            </div>
          </div>
          <div class="row no-discounts" v-if="!discountCodes.length">暂无可用优惠</div>
          <button class="button button-primary" :disabled="isApplyingDiscount" @click="useDiscount()">使用优惠</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    .invalid-order {
      font-size: $font-size-16;
      color: $color-gray3;
    }

    .order {
      display: flex;
      flex-direction: column;
      height: 100vh;

      .top-nav {
        flex-shrink: 0;
      }

      .new-order, .old-order {
        position: relative;
        flex-grow: 1;
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

            &.title-small {
              font-size: $font-size-14;
            }
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
        font-size: $font-size-16;

        .status-success {
          color: #3da838;
        }
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
          font-size: $font-size-18;
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
          font-size: $font-size-14;
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
              font-size: $font-size-18;
            }

            .price {
              color: $color-gray3;
              font-size: $font-size-14;
              text-decoration: line-through;
              padding-left: 5px;
            }
          }

          .amount {
            flex-shrink: 0;
            color: $color-gray3;
            font-size: $font-size-14;
          }
        }
      }

      .no-record {
        justify-content: center;
        color: $color-gray3;
        font-size: $font-size-16;
      }

      .discount {
        .row {
          align-items: center;

          .discount-selector, a {
            color: $color-brand;

            &.disabled {
              opacity: .5;
            }
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
          font-size: $font-size-18;
          font-weight: bold;
        }

        .button {
          border-radius: 0;
          height: 100%;
          padding: 0 20px;
          width: auto;

          &.button-block {
            width: 100%;
          }
        }
      }

      .discount-popup {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: $color-w;
        box-shadow: 0 0 2px $color-gray3;
        transform: translateY(101%);
        transition: transform .3s;
        padding: 15px;

        &.show {
          transform: translateY(0);
        }

        .header {
          text-align: right;
        }

        .wrapper {
          max-height: 50vh;
          overflow-y: auto;
        }

        .row {
          display: flex;
          align-items: center;
          font-size: $font-size-16;
          color: $color-dark-gray;
          padding: 10px 0;
          border-bottom: solid 1px $color-gray4;

          .discount-title {
            flex-grow: 1;
          }

          &.no-discounts {
            justify-content: center;
            color: $color-gray3;
          }

          input {
            margin-right: 10px;
          }
        }

        .button-primary {
          margin-top: 15px;
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {Money, parseUrl} from '../../shared/utils/utils';
  import {refreshUserInfo, getUserInfoCache} from "../../shared/api/user.api";
  import {OrderObject, PostOrderObject, OrderFee, Discount, Order, OrderMeta} from "../../shared/api/order.model";
  import {checkOrderFee, listDiscountCode, createOrder, getOrder} from '../../shared/api/order.api';
  import {pay} from '../../shared/api/pay.api';
  import {showTips} from '../../store/tip';
  import {setPaymentNone} from '../../store/payment';
  import {ApiError} from '../../shared/api/xhr';
  import {ApiCode} from '../../shared/api/code-map.enum';
  import {showModal} from '../../store/modal';
  import {UserInfoModel} from "../../shared/api/user.model";
  import {showQrcode} from '../../store/qrcode';
  import {appConfig} from '../../env/environment';

  @Component
  export default class OrderComponent extends Vue {
    orderId = '';
    order: Order = new Order({});
    itemsQuery: PostOrderObject[] = [];
    orderFee: OrderFee = new OrderFee({});
    discountCodes: Discount[] = [];//折扣列表
    isInvalidOrder = false;
    isLoading = false;
    isError = false;
    isPaying = false;
    isDiscountSelectorShow = false;//控制优惠活动面板的显示
    selectedDiscount: Discount[] = [];//选择的优惠
    isApplyingDiscount = false;//控制是否正在使用优惠，控制'使用优惠'按钮状态
    isDiscountDeleting: { [key: string]: boolean } = {};
    lang = 'zh';

    created() {
      this.lang = this.$route.query['lang'];
      const isContinue = this.handlePayResultForRedirect();
      if (isContinue) this.routeChange();
    }

    @Watch('$route')
    routeChange() {
      const isValid = this.processParams();
      if (isValid) {
        this.initData();
      }
    }

    @Watch('lang')
    changeLocale(val: string) {
      if (val === 'en' && this.$i18n.locale !== val) {
        this.$i18n.locale = val;
      }
    }

    async handlePayResultForRedirect() {
      const id = this.$route.params['id'];
      const query = this.$route.query;
      const payResult = query['payResult'];
      const orderType = query['orderType'];

      if (!payResult) return true;

      if (payResult === 'success') {
        if (orderType === 'member') {
          await refreshUserInfo();
          this.$router.replace({path: '/new-member/action'});
        } else if (orderType === 'event') {
          this.$router.replace({path: '/my/tickets'});
        } else {
          this.$router.replace({path: '/my/orders'});
        }
        this.checkSubscription();
        showTips('支付成功');
      } else if (payResult === 'cancel') {
        if (id) {
          this.$router.replace({path: `/orders/${id}`});
        } else {
          this.$router.replace({path: '/my/orders'});
        }
        showTips('订单未支付');
      } else {
        if (id) {
          this.$router.replace({path: `/orders/${id}`});
        } else {
          this.$router.replace({path: '/my/orders'});
        }
        showTips('支付失败，请重试');
        console.error(decodeURIComponent(payResult));
      }

      return false;
    }

    checkSubscription() {
      const userInfo = getUserInfoCache();
      if (!userInfo.isSubscribed) {
        showQrcode(appConfig.wechatLink, '<p>扫码关注公众号</p><p>获取最新活动信息</p>');
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
        itemQuery.push(new PostOrderObject(item.objectId, item.objectType, item.nums, item.discount));
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
      if (this.itemsQuery[0].objectType !== 5 && this.itemsQuery[0].discount !== 1) {
        await this.checkDiscount();
      }
    }

    async handleOtherOrder(e: Error | ApiError) {
      if (e instanceof ApiError) {
        if (e.code === ApiCode.ErrOrderNeedProcessOthers) {
          const oid = e.originError.response && e.originError.response.data.data.orderNo;
          await showModal('您有其他订单未处理', '去处理', false);
          this.$router.push({path: `/orders/${oid}`})
        }
      }
    }

    async checkOrder(discountCodes: string[] = [], needHandleError = true) {
      let orderFee: OrderFee;
      try {
        orderFee = await checkOrderFee(this.itemsQuery, discountCodes, true, needHandleError);
      } catch (e) {
        this.handleOtherOrder(e);
        // TODO: error handler
        // TODO: items error
        // TODO: discount error
        throw e;
      }

      this.orderFee = orderFee;
    }

    async checkDiscount() {
      //获取当前有的优惠活动
      this.discountCodes = await listDiscountCode(this.itemsQuery);
      //如果有优惠活动，则默认选中第一条优惠
      if (this.discountCodes.length > 0) {
        this.selectedDiscount.push(this.discountCodes[0]);
        this.useDiscountFirst();
      }
    }

    getOrderType(): string {
      if (this.orderId ? this.order.hasMemberItem : this.orderFee.hasMemberItem) {
        return 'member'
      } else if (this.orderId ? this.order.hasEventItem : this.orderFee.hasEventItem) {
        return 'event';
      }

      return '';
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
        await pay(this.orderId, this.getBackToUrl());
      } catch (e) {
        if (e === 'cancel') {
          showTips('订单未支付');
          this.$router.push({path: '/my/orders'});
        } else {
          this.handleOtherOrder(e);
        }
        throw e;
      } finally {
        this.isPaying = false;
      }

      const payResult = 'success';
      const orderType = this.getOrderType();
      this.$router.push({path: `/orders/${this.orderId}`, query: {payResult, orderType}});
    }

    async payNewOrder() {
      this.isPaying = true;

      const discountCode = this.orderFee.discounts.map(discount => discount.code);

      let orderMeta: OrderMeta;
      try {
        orderMeta = await createOrder(this.itemsQuery, discountCode);
        await pay(orderMeta.orderNo, this.getBackToUrl());
      } catch (e) {
        if (e === 'cancel') {
          showTips('订单未支付');
          this.$router.push({path: '/my/orders'});
        } else {
          this.handleOtherOrder(e);
        }
        throw e;
      } finally {
        this.isPaying = false;
      }

      const payResult = 'success';
      const orderType = this.getOrderType();
      this.$router.push({path: `/orders/${orderMeta.orderNo}`, query: {payResult, orderType}});
    }

    getBackToUrl(): string {
      const urlObj = parseUrl(location.href);
      urlObj.search['orderType'] = this.getOrderType();
      return urlObj.toString();
    }

    popupDiscountSelector() {
      this.isDiscountSelectorShow = true;
    }

    closeDiscountSelector() {
      this.isDiscountSelectorShow = false;
    }

    //选择第一个优惠
    async useDiscountFirst() {
      this.isApplyingDiscount = true;

      const discountCodes = this.selectedDiscount.map(discount => discount.code);

      try {
        await this.checkOrder(discountCodes);
      } finally {
        this.isApplyingDiscount = false;
      }
    }

    //选择优惠
    async useDiscount() {
      this.isApplyingDiscount = true;

      const discountCodes = this.selectedDiscount.map(discount => discount.code);

      try {
        await this.checkOrder(discountCodes);
      } finally {
        this.isApplyingDiscount = false;
      }

      this.closeDiscountSelector();
    }

    //判断该优惠是否已经使用
    isDiscountSelected(discount: Discount): boolean {
      return !!this.selectedDiscount.find((selectedDiscount) => selectedDiscount.code === discount.code);
    }

    checkDiscountCompatity() {
      this.discountCodes.forEach((discount) => {
        let sameId = 0;

        this.selectedDiscount.forEach((selectedDiscount) => {
          if (selectedDiscount.code !== discount.code && selectedDiscount.discountId === discount.discountId) sameId++;
        });

        const overlaid = !!discount.discount.canOverlay && discount.discount.canOverlay <= sameId;
        const hasExclusiveDiscount = !this.isDiscountSelected(discount) && !!this.selectedDiscount.filter((selectedDiscount) => !selectedDiscount.discount.allowOther).length && !discount.discount.allowOther;

        discount.canUse = !overlaid && !hasExclusiveDiscount && discount.canUseFromApi;
      });
    }

    @Watch('selectedDiscount')
    onSelectedDiscountChanged(val: Discount[]) {
      this.checkDiscountCompatity();
    }

    async deleteSelectedDiscount(discount: Discount) {
      if (this.isDiscountDeleting[discount.code]) return;

      const discountCode = discount.code;
      const remainCodes = this.orderFee.discounts.map(_discount => _discount.code).filter(code => code !== discountCode);

      this.isDiscountDeleting[discount.code] = true;

      try {
        await this.checkOrder(remainCodes);
      } finally {
        this.isDiscountDeleting[discount.code] = false;
      }

      const index = this.selectedDiscount.findIndex(selectedDiscount => selectedDiscount.code === discount.code);
      if (index !== -1) this.selectedDiscount.splice(index, 1);
    }

    gotoMyTicket() {
      this.$router.push({path: '/my/tickets'});
    }
  }
</script>
