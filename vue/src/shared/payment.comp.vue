<template>
  <!--pc扫码支付-->
  <div class="payment-backdrop" @click="close()" v-if="!isStatusNone">
    <div class="content" @click.stop>
      <div class="header">
        <div class="close" @click="close()"></div>
        <div class="tips" v-if="isStatusPaying">
          <div class="icon">
            <i class="bi bi-paid"></i>
          </div>
          <span v-if="qrcodeSrc">微信扫码进行支付</span>
          <span v-else>请在微信客户端进行支付</span>
        </div>
        <div class="tips" v-else-if="isStatusSuccess">
          <div class="icon">
            <i class="bi bi-paid"></i>
          </div>
          支付成功
        </div>
        <div class="tips" v-else-if="isStatusFailure">
          <div class="icon">
            <i class="bi bi-unpaid"></i>
          </div>
          支付失败
        </div>
      </div>
      <div class="body">
        <div v-if="isStatusPaying">
          <img class="qrcode-image" v-if="qrcodeSrc" :src="qrcodeSrc" alt="二维码">
          <i class="bi bi-wechat2" v-else></i>
        </div>
        <div class="success" v-else-if="isStatusSuccess">
          <button class="button button-primary" @click="gotoOrder()">查看我的订单</button>
          <button class="button button-outline" @click="close()">关闭</button>
        </div>
        <div class="fail" v-else-if="isStatusFailure">
          <i class="bi bi-failure-face"></i>
          <p class="result">{{message}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .payment-backdrop {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    justify-content: center;
    align-items: center;

    .content {
      border-radius: 4px;
      width: 260px;
      overflow: hidden;
      background-color: $color-w;

      .header {
        position: relative;
        overflow: hidden;
        background-color: $color-brand;
        text-align: center;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        .close {
          position: absolute;
          background-color: rgba(255, 255, 255, .5);
          width: 78px;
          height: 78px;
          border-radius: 50%;
          right: -39px;
          top: -39px;

          &:before, &:after {
            content: "";
            position: absolute;
            height: 22px;
            width: 1px;
            background-color: rgb(255, 255, 255);
            top: 44px;
            left: 24px;
          }

          &:before {
            transform: rotate(45deg);
          }

          &:after {
            transform: rotate(-45deg);
          }
        }

        .tips {
          margin: 40px 20px 20px;
          color: $color-w;
          word-break: break-all;
          font-size: 18px;

          .icon {
            display: flex;
            height: 40px;
            width: 40px;
            margin: auto;
            margin-bottom: 10px;
            background-color: rgb(255, 255, 255);
            border-radius: 50%;
          }

          .bi-paid {
            margin: auto;
            color: rgb(49, 181, 165);
          }

          .bi-unpaid {
            margin: auto;
            color: rgb(49, 181, 165);
          }
        }
      }

      .body {
        text-align: center;

        .qrcode-image {
          display: block;
          margin: 20px auto;
        }

        .bi-wechat2 {
          font-size: 100px;
          color: $color-gray2;
          margin: 40px 0;
        }

        .fail {
          .bi-failure-face {
            display: flex;
            margin: 40px auto 20px;
            font-size: 48px;
            color: $color-gray3;
          }

          .result {
            font-size: $font-size-14;
            color: $color-gray3;
            padding: 0 20px;
            word-break: break-all;
            text-align: center;
            margin-bottom: 40px;
          }
        }

        .success {
          .button {
            width: calc(100% - 40px);
            margin: 20px;
          }
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {PayStatus, setPaymentNone, paymentStore} from '../store/payment';
  import {yaqrcode} from 'yaqrcode';

  @Component
  export default class PaymentCompoent extends Vue {
    get qrcodeSrc(): string {
      if (paymentStore.state.qrcodeUrl) {
        return yaqrcode(paymentStore.state.qrcodeUrl, {size: 150});
      }

      return '';
    }

    get isStatusNone(): boolean {
      return paymentStore.state.payStatus === PayStatus.None;
    }

    get isStatusPaying(): boolean {
      return paymentStore.state.payStatus === PayStatus.Paying;
    }

    get isStatusSuccess(): boolean {
      return paymentStore.state.payStatus === PayStatus.Success;
    }

    get isStatusFailure(): boolean {
      return paymentStore.state.payStatus === PayStatus.Failure;
    }

    get message(): string {
      switch (paymentStore.state.message) {
        case 'weixin_js_bridge_not_found':
          return '微信支付初始化失败，请刷新页面重试';
        case 'timeout':
          return '支付超时，请重新支付';
        case 'closed':
          return '订单已关闭，请重新购买';
        case 'already paid':
          return '订单已支付';
        default:
          return '支付失败，请联系我们';
      }
    }

    close() {
      setPaymentNone();
    }

    gotoOrder() {
      this.$router.push({path: '/my/orders'});
      setPaymentNone();
    }
  }
</script>
