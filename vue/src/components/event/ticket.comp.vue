<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="event" v-else @click="isPaymentPopup = false">
      <img class="cover" :src="event.coverUrl" alt="头图">
      <div class="block">
        <h1 class="subject">{{event.subject}}</h1>
        <div class="desc article-content" v-html="event.desc"></div>
      </div>
      <div class="speaker block" v-for="speaker in event.meta.speakers">
        <img class="avatar avatar-round" :src="speaker.coverUrl" alt="嘉宾头像">
        <h2 class="nick">{{speaker.subject}}</h2>
        <div class="title" v-html="speaker.title" v-if="speaker.title"></div>
        <div class="desc" v-html="speaker.desc" v-if="speaker.desc"></div>
      </div>
      <div class="location block" v-if="event.meta.startAt || event.meta.address">
        <p v-if="event.meta.startAt">
          时间：<span>{{event.meta.startAtParsed.format('YYYY-MM-DD HH:mm:ss')}}</span><span v-if="event.meta.endAt"> - {{event.meta.endAtParsed.format('YYYY-MM-DD HH:mm:ss').replace(event.meta.startAtParsed.format('YYYY-MM-DD'), '')}}</span>
        </p>
        <p class="address" v-if="event.meta.address">
          地点：<span v-if="event.meta.city">{{event.meta.city}} </span>{{event.meta.address}}
        </p>
      </div>
    </div>

    <footer v-if="!isLoading && event && event.meta.tickets.length">
      <button class="button button-primary" @click="buy()" :disabled="isPaymentDisabled">{{btnText}}</button>
    </footer>

    <div class="payment-popup" v-if="!isLoading && event" :class="{'show': isPaymentPopup}">
      <div class="header">
        <div class="subject">{{event.subject}}</div>
        <i class="bi bi-close" @click="isPaymentPopup = false"></i>
      </div>
      <div class="detail">
        <div class="item-name">
      <span
        class="ticket"
        :class="{'active': ticket.id === ticketSelected.id, 'disabled': !ticket.leftTotal}"
        v-for="ticket in event.meta.tickets"
        @click="ticket.leftTotal && chooseTicket(ticket)"
      >{{ticket.name}}</span>
        </div>
        <div class="item-count">
          <div class="adjuster">
            <span class="decrease" @click="ticketCount > 1 ? ticketCount=ticketCount-1 : true"></span>
            <input class="count-input" type="number" placeholder="数量" step="1" min="1" :max="ticketSelected.leftTotal" v-model.number="ticketCount">
            <span class="increase" @click="ticketSelected.leftTotal > ticketCount ? ticketCount=ticketCount+1 : true"></span>
          </div>
          <p class="error" v-if="isTicketCountError">输入数量错误，请输入大于0的整数</p>
        </div>
      </div>
      <div class="amount">
        <bd-loading v-if="isAmoutLoading"></bd-loading>
        <span v-if="!isAmoutLoading">{{amount.toYuan()}}</span>
      </div>
      <button class="button button-primary" @click="gotoOrder()">立即购买</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: relative;
    height: 100vh;
    overflow: hidden;
    background-color: rgb(251, 251, 251);

    .event {
      height: calc(100vh - 60px);
      overflow: auto;

      .block {
        box-shadow: 0 2px 2px rgb(236, 236, 236);
        margin-bottom: 12px;
        background-color: $color-w;
        overflow: hidden;
      }

      .cover {
        display: block;
        width: 100%;
        height: auto;
        object-fit: cover;
      }

      .subject {
        margin: 20px;
        font-size: $font-size-xlg;
        color: $color-b;
        font-weight: normal;
        line-height: 1.25em;
        word-break: break-all;
      }

      .desc {
        margin: 20px;
        font-size: $font-size-sm;
        color: $color-dark-gray;
        line-height: 1.71em;
      }

      .speaker {
        text-align: center;
        padding: 40px 0;

        .avatar {
          margin: 0 0 15px;
          width: 147px;
          height: 147px;
          object-fit: cover;
        }

        .nick {
          font-size: $font-size-lg;
          font-weight: normal;
          color: $color-dark-gray;
          margin-bottom: 5px;
        }

        .title {
          font-size: $font-size-sm;
          color: $color-gray3;
          line-height: 1.5em;
          word-break: break-all;
          white-space: pre-wrap;
        }

        .desc {
          max-width: 600px;
          margin: 0 auto;
          text-align: left;
          padding: 20px;
          font-size: $font-size-sm;
          color: $color-dark-gray;
          line-height: 1.7em;
          word-break: break-all;
          white-space: pre-wrap;
          margin-top: 10px;
        }
      }

      .location {
        text-align: center;
        padding: 20px;
        font-size: $font-size-sm;
        color: $color-dark-gray;
        box-shadow: none;
        margin-bottom: 0;

        .address {
          margin-top: 10px;
        }
      }
    }

    footer {
      height: 60px;
      border-top: solid 1px rgb(239, 239, 239);
      background-color: $color-w;
      display: flex;
      align-items: center;
      justify-content: center;

      .button {
        margin: 10px;
      }
    }

    .payment-popup, .continue-popup {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: $color-w;
      box-shadow: 0 0 2px $color-gray3;
      transform: translateY(100%);
      transition: transform .3s;
      padding: 20px;

      &.show {
        transform: translateY(0);
      }
    }

    .payment-popup {
      .header {
        display: flex;
        align-items: center;

        .subject {
          flex-grow: 1;
          font-size: $font-size-sm;
          color: $color-b;
          word-break: break-all;
          line-height: 1.5em;
        }

        .bi-close {
          flex-shrink: 0;
          font-size: 14px;
          color: $color-b;
          padding: 10px;
          transform: translateX(10px) translateY(-6px);
        }
      }

      .detail {
        display: flex;
        flex-direction: column;

        .item-name {
          .ticket {
            display: inline-block;
            font-size: $font-size-sm;
            color: $color-dark-gray;
            border: solid 1px $color-gray3;
            border-radius: 3px;
            padding: 5px 8px;
            margin-right: 15px;
            margin-top: 15px;
            cursor: pointer;
            transition: all .3s;

            &.active {
              background-color: $color-brand;
              border-color: $color-brand;
              color: $color-w;
            }

            &.disabled {
              opacity: .5;
              cursor: default;
            }
          }
        }

        .item-count {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-top: 10px;

          .adjuster {
            display: flex;
            align-items: center;
            transform: translateX(10px);

            .increase, .decrease {
              position: relative;
              width: 33px;
              height: 33px;
              padding: 10px;

              &:before {
                position: absolute;
                left: 10px;
                top: 50%;
                content: '';
                width: 13px;
                height: 1px;
                background-color: $color-gray3;
              }
            }

            .increase {
              &:after {
                position: absolute;
                left: 10px;
                top: 50%;
                content: '';
                width: 13px;
                height: 1px;
                background-color: $color-gray3;
                transform: rotate(90deg);
              }
            }

            input {
              width: 60px;
              border: solid 1px $color-gray3;
              border-radius: 3px;
              font-size: $font-size-lg;
              color: $color-dark-gray;
              padding: 5px;
            }
          }

          .error {
            font-size: 12px;
            margin-top: 6px;
            color: $color-danger;
          }
        }
      }

      .amount {
        height: 28px;
        margin-top: 23px;
        margin-bottom: 27px;
        font-size: $font-size-xlg;
        text-align: right;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Watch } from 'vue-property-decorator';
  import {getEvent} from "../../shared/api/event.api";
  import {EventModel, EventTicketModel} from "../../shared/api/event.model";
  import {Money} from "../../shared/utils/utils";
  import {TicketModel} from "../../shared/api/ticket.model";
  import {checkOrderFee} from "../../shared/api/order.api";
  import {PostOrderObject, OrderObjectType} from "../../shared/api/order.model";
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from "../../shared/api/user.model";
  import {showTips} from '../../store/tip';

  @Component
  export default class EventTicketComponent extends Vue {
    id = '';
    event = new EventModel({});
    isLoading = false;
    isError = false;
    btnText = '购买门票';
    isPaymentDisabled = false;
    isPaymentPopup = false;
    ticketCount = 0;
    isTicketCountError = false;
    amount = new Money(0);
    isAmoutLoading = false;
    debounceTimer = 0;
    ticketSelected = new EventTicketModel({});

    @Watch('ticketCount')
    onTicketCountChanged(val: number, oldVal: number) {
      this.checkTicketCount();
      this.checkFee(val);
    }

    @Watch('$route.name')
    refreshData() {
      this.id = this.$route.params['id'];
      this.initData();
    }

    created() {
      this.id = this.$route.params['id'];
      this.initData();
    }

    checkTicketCount() {
      if (this.ticketCount > this.ticketSelected.leftTotal) {
        this.ticketCount = this.ticketSelected.leftTotal;
      }
    }

    checkFee(count: number) {
      if (Number.isInteger(count) && count > 0) {
        this.isTicketCountError = false;
      } else {
        this.isTicketCountError = true;
        return;
      }

      if (this.debounceTimer) clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(async () => {
        this.isAmoutLoading = true;

        const query = new PostOrderObject(`${this.id}-${this.ticketSelected.id}`, OrderObjectType.Event, count);

        try {
          const orderFee = await checkOrderFee([query]);
          this.amount = orderFee.totalDiscountedFee;
        } finally {
          this.isAmoutLoading = false;
        }
      }, 500);
    }

    checkDate(event: EventModel, timer = 0) {
      if (moment().isBefore(event.meta.applyStartAtParsed)) {
        this.isPaymentDisabled = true;
        this.btnText = '未开始售票';
      } else {
        this.isPaymentDisabled = false;
        this.btnText = '购买门票';
      }

      if (moment().isAfter(event.meta.applyEndAtParsed)) {
        this.isPaymentDisabled = true;
        this.btnText = '已结束售票';
        this.isPaymentPopup = false;
        clearInterval(timer);
      }
    }

    canBuy(): boolean {
      let userInfo: UserInfoModel;

      try {
        userInfo = getUserInfoCache(false);
      } catch (e) {
        return false;
      }

      return !!userInfo.mobile.number;
    }

    buy() {
      let userInfo: UserInfoModel;

      try {
        userInfo = getUserInfoCache(false);
      } catch (e) {
        this.$router.push({path: '/signin', query: {redirectTo: this.$route.fullPath}});
        return;
      }

      if (!userInfo.mobile.number) {
        this.$router.push({path: '/mobile-bind', query: {redirectTo: this.$route.fullPath}});
        return;
      }

      this.isPaymentPopup = true;
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;

      try {
        this.event = await getEvent(this.id);
      } catch (e) {
        this.isError = true;
        throw e;
      } finally {
        this.isLoading = false;
      }

      if (this.event.meta.tickets.length && this.canBuy()) {
        this.ticketSelected = this.event.meta.tickets[0];
        this.ticketCount = 1;

        this.checkDate(this.event);
        const timer = setInterval(() => {
          this.checkDate(this.event, timer);
        }, 3000);
      }
    }

    gotoOrder() {
      if (!this.ticketSelected || !this.ticketSelected.id) {
        showTips('请选择购票类型');
        return;
      } else if (this.ticketCount < 1) {
        showTips('购票数量错误');
        return;
      }

      const query = new PostOrderObject(`${this.id}-${this.ticketSelected.id}`, OrderObjectType.Event, this.ticketCount);
      this.$router.push({path: '/orders', query: {items: encodeURIComponent(JSON.stringify([query]))}});
    }

    chooseTicket(ticket: EventTicketModel) {
      this.ticketSelected = ticket;
      this.checkTicketCount();
      this.checkFee(this.ticketCount);
    }
  }
</script>
