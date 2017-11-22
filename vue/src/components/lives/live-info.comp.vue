<template>
  <div>
    <div class="live-info">
      <div class="content">
        <live-intro class="live-intro-component" :liveInfo="liveInfo"></live-intro>

        <div class="editors-container" v-if="liveInfo.invitees.length">
          <div class="title">嘉宾介绍</div>
          <div class="editors-scroller invisible-scrollbar">
            <div class="editors" v-for="invitee in liveInfo.invitees">
              <div class="avatar-wrapper">
                <img class="editor-avatar" v-if="invitee.avatar" :src="invitee.avatar">
                <i class="bi bi-people2" v-if="!invitee.avatar"></i>
              </div>
              <div class="words-wrapper">
                <div class="words-align-center">
                  <span class="editor-name">{{invitee.name}}</span>
                  <div class="editor-intro">{{invitee.title}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="people-container">
          <div class="people-count">
            <div class="title">
              <i class="bi bi-people"></i>
              {{liveInfo.totalUsers > 999 ? '999+' : liveInfo.totalUsers}}人观看
            </div>
            <img class="avatar" alt="" v-for="audience in liveInfo.latestUsers" :src="audience.avatar">
          </div>
        </div>

        <div class="share-star-entry" @click="gotoShareStar()" v-if="!inApp"><span class="share-star-title"><i class="bi bi-share-star"></i>分享榜</span><span class="share-star-content">快来分享吧<i class="bi bi-right-arrow"></i></span></div>
      </div>

      <div class="operation-area">
        <a class="btn notification" v-if="!liveInfo.booked && liveInfo.isCreated && !booking && isInWechat" @click="bookLive()"><i
          class="bi bi-clock"></i><span v-if="!hasPresent()">开播提醒</span></a>
        <a class="btn notification disabled" v-if="booking && isInWechat"><i
          class="bi bi-clock"></i><span v-if="!hasPresent()">{{liveInfo.booked ? '取消中...' : '订阅中...'}}</span></a>
        <a class="btn notification turn-on" v-if="liveInfo.booked && liveInfo.isCreated && !booking && isInWechat" @click="unbookLive()"><i
          class="bi bi-clock"></i><span v-if="!hasPresent()">已经开通</span></a>

        <button
          class="btn present"
          v-if="hasPresent()"
          @click="gotoPresent()"
        ><i class="bi bi-present"></i>请朋友看</button>

        <button
          class="button button-primary button-square enter-room"
          :disabled="isPaying"
          @click="go()"
        ><span class="origin-fee" v-if="originFee">{{originFee}}</span>{{btnText}}</button>
      </div>
    </div>

    <div class="qrcode-background" v-if="isQrcodeShown" @click="closeQrcode()">
      <div class="content" @click="$event.stopPropagation()">
        <div class="header">
          <div class="close" @click="closeQrcode()"></div>
          <div class="live-title">{{liveInfo.subject}}</div>
          <count-down class="count-down" :expectStartAt="liveInfo.expectStartAt" :countDownStatus="liveInfo.isCreated"></count-down>
        </div>
        <div class="qrcode">
          <div class="qrcode-block">
            <img v-if="!isSubscribeLinkLoading && !isSubscribeLinkError" class="qrcode-image" :src="qrcode" alt="订阅二维码">
            <div v-if="isSubscribeLinkLoading">二维码加载中...</div>
            <div v-if="isSubscribeLinkError">二维码加载失败，请<a class="retry-link" href="" @click="getSubscribeLink(); $event.preventDefault();">重试</a></div>
          </div>
          <p v-if="isInWechat">长按二维码订阅话题间</p>
          <p v-if="!isInWechat">使用微信扫描二维码订阅话题间</p>
          <p>开播会通知你</p>
        </div>
      </div>
    </div>

    <div
      class="payment-background"
      v-if="payStatus===payEnums.Failure"
      @click="closePayment()"
    >
      <div class="content" @click="$event.stopPropagation()">
        <div class="header">
          <div class="close" @click="closePayment()"></div>
          <div class="live-title">
            <div class="paid-tick">
              <i class="bi bi-unpaid"></i>
            </div>
            支付失败
          </div>
        </div>
        <div class="failure-reason-wrapper">
          <p>失败原因</p>
          <div class="failure-reason">
            <i class="bi bi-failure-face"></i>
          </div>
          <p>{{paidResult}}</p>
        </div>
      </div>
    </div>

    <div
      class="payment-background"
      v-if="payStatus===payEnums.Success"
      @click="closePayment()"
    >
      <div class="content" @click="$event.stopPropagation()">
        <div class="header">
          <div class="close" @click="closePayment()"></div>
          <div class="live-title">
            <div class="paid-tick">
              <i class="bi bi-paid"></i>
            </div>
            支付成功
          </div>
        </div>
        <div class="paid-review" v-if="!liveInfo.isCreated || !isInWechat" @click="gotoLive()">
          <p>进入话题间 观看视频</p>
          <i class="bi bi-paid-review"></i>
        </div>
        <div class="success-wrapper" v-if="liveInfo.isCreated && isInWechat && !liveInfo.booked">
          <p>请点击底部开播提醒按钮</p>
          <div class="failure-reason">
            <i class="bi bi-paid-bell"></i>
          </div>
        </div>
        <div class="success-wrapper" v-if="liveInfo.isCreated && isInWechat && liveInfo.booked">
          <p>开播提醒已开通</p>
          <i class="bi bi-paid-bell"></i>
          <p>开播提醒已经开通</p>
          <p>点击底部开播按钮，即可取消</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .live-info {
    height: 100vh;
    background-color: $color-w;
    display: flex;
    flex-direction: column;

    .content {
      flex-grow: 1;
      overflow: auto;

      .live-intro-component {
        display: block;
        position: relative;
      }

      .people-container {
        margin: 15px 12px 20px;

        .people-count {
          display: flex;
          flex-wrap: wrap;

          .title, .avatar {
            margin-top: 5px;
          }

          .title {
            margin-right: 10px;
            color: $color-gray;
            display: flex;
            align-items: center;
            font-size: 16px;
            line-height: 1em;

            .bi {
              margin-right: 5px;
              margin-left: 5px;
            }
          }

          .avatar {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            margin-right: -5px;

            &:first-child {
              margin-left: 0;
            }
          }
        }
      }

      .editors-container {
        background: rgb(247, 247, 247);

        .title {
          font-size: 18px;
          color: $color-dark-gray;
          padding: 20px 20px 0 20px;
        }

        .editors-scroller {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: scroll;
          overflow-y: hidden;

          .editors {
            display: flex;
            padding: 20px 10px;
            flex-shrink: 0;

            &:first-child {
              padding-left: 20px;
            }

            &:last-child {
              padding-right: 20px;
            }

            .avatar-wrapper {
              display: flex;

              .editor-avatar {
                margin: auto;
                height: 80px;
                width: 80px;
                border-radius: 80px;
                object-fit: cover;
              }

              .bi-people2 {
                height: 80px;
                width: 80px;
                font-size: 60px;
              }
            }

            .words-wrapper {
              display: flex;
              flex-shrink: 0;

              .words-align-center {
                margin: auto;
                margin-left: 10px;
                word-wrap: break-word;
                max-width: 150px;

                .editor-name {
                  font-size: 16px;
                  color: $color-dark-gray;
                  line-height: 14px;
                }

                .editor-intro {
                  margin-top: 5px;
                  font-size: 14px;
                  color: $color-gray;
                  line-height: 18px;
                }
              }
            }
          }
        }
      }

      .share-star-entry {
        position: relative;
        padding: 20px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 1em;

        &:before {
          position: absolute;
          top: 0;
          left: 15px;
          right: 15px;
          content: '';
          height: 1px;
          background-color: rgba(225, 225, 225, .5);
        }

        .share-star-title, .share-star-content {
          display: flex;
          align-items: center;
        }

        .share-star-title {
          font-size: $font-size-14;

          .bi-share-star {
            margin-right: 6px;
          }
        }

        .share-star-content {
          font-size: $font-size-12;
          color: $color-gray3;

          .bi-right-arrow {
            margin-left: 10px;
            color: rgb(199, 199, 204);
          }
        }
      }
    }

    .operation-area {
      flex-shrink: 0;
      display: flex;

      .btn, .button {
        text-align: center;
        height: 49px;
        line-height: 49px;
        font-size: 17px;
        color: $color-w;
        background-color: rgb(37, 37, 37);
        border-radius: 0;

        &.enter-room {
          flex-grow: 1;
          background-color: $color-brand;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: bold;

          .origin-fee {
            font-weight: normal;
            text-decoration: line-through;
            padding-right: 10px;
          }
        }

        &.present {
          flex-shrink: 0;
          padding: 0 15px;

          &:nth-child(2) {
            border-top: solid 1px $color-brand;
            border-bottom: solid 1px $color-brand;
            color: $color-brand;
            background-color: $color-w;
          }

          .bi-present {
            margin-top: -5px;
            margin-right: 5px;
            font-size: 18px;
          }
        }

        &.turn-on {
          color: $color-brand;
        }

        &.notification {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 40%;
          flex-shrink: 0;
          padding: 0 15px;

          .bi-clock {
            font-size: 20px;
          }

          span {
            margin-left: 5px;
          }

          &.disabled {
            color: rgba(255, 255, 255, .3);
          }
        }
      }
    }
  }

  .payment-background {
    .success-wrapper, .failure-reason-wrapper {
      text-align: center;

      .failure-reason {
        padding: 20px;
        color: $color-gray;
        font-size: 40px;
      }

      .bi-paid-bell {
        padding: 20px;
        color: $color-gray;
        font-size: 60px;
      }

      p {
        color: $color-gray;
        font-size: 16px;
        line-height: 1.5em;

        &:first-child {
          margin-top: 30px;
        }

        &:nth-child(3) {
          font-size: 12px;
          color: #9EA1A5;
          letter-spacing: 0px;
          line-height: 16px;
        }

        &:nth-child(4) {
          font-size: 12px;
          color: #9EA1A5;
          letter-spacing: 0px;
          line-height: 16px;
        }
        &:last-child {
          margin-bottom: 40px;
        }
      }

    }

    .paid-review {
      text-align: center;

      p {
        color: $color-gray;
        line-height: 1.5em;

        &:first-child {
          padding-top: 30px;
        }
        &:last-child {
          margin-bottom: 40px;
        }
      }

      .bi-paid-review {
        padding: 20px;
        color: $color-gray;
        font-size: 80px;
      }
    }
  }

  .qrcode-background {
    .qrcode {
      text-align: center;
      margin: 20px 0;

      .qrcode-block {
        height: 130px;
        display: flex;
        align-items: center;
        justify-content: center;

        .retry-link {
          color: $color-brand;
          text-decoration: none;
        }

        .qrcode-image {
          width: 130px;
          height: 130px;
        }
      }

      p {
        color: $color-gray;
        line-height: 1.5em;
      }
    }
  }

  .qrcode-background, .payment-background {
    position: absolute;
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

        .live-title {
          margin: 40px 20px 30px;
          color: $color-w;
          word-break: break-all;
          font-size: 18px;

          .paid-tick {
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

        .count-down {
          /deep/ {
            .info-status-wrapper-countdown {
              background-color: transparent;
            }
          }
        }

        .tips {
          color: $color-w;
          margin: 10px auto 20px;
          font-size: 14px;
        }
      }
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import liveIntro from '../../shared/live-intro.comp.vue';
  import {LiveInfoModel} from "../../shared/api/lives.model";
  import {bookLive, unbookLive, getLiveInfo, getSubscribeLink} from '../../shared/api/lives.api';
  import {UserInfoModel} from "../../shared/api/user.model";
  import {isInApp, isInWechat} from '../../shared/utils/utils';
  import {getUserInfoCache, getUserInfo} from '../../shared/api/user.api';
  import {setDefaultShareInfo} from '../../shared/utils/share';
  import {showTips} from '../../store/tip';
  import {createOrder} from '../../shared/api/order.api';
  import {OrderObjectType, PostOrderObject} from '../../shared/api/order.model';
  import {pay} from '../../shared/api/pay.api';
  import {ApiError} from '../../shared/api/xhr';
  import {PayStatus} from '../../store/payment';
  import {ApiCode, ApiErrorMessage} from '../../shared/api/code-map.enum';
  import {Store} from "../../shared/utils/store";
  import {getRelativePath} from '../../shared/utils/utils';
  import {copyText} from '../../shared/utils/ios';
  import countDown from '../../shared/count-down.comp.vue';
  import {setPaymentNone} from '../../store/payment';

  @Component({
    components: {
      liveIntro,
      countDown,
    },
  })
  export default class LiveInfoComponent extends Vue {
    liveId: string;
    liveInfo: LiveInfoModel;
    userInfo: UserInfoModel;
    isQrcodeShown = false;
    qrcode: string;
    timer: any;
    isPaying = false;
    payResult = '';
    payStatus = PayStatus.None;
    payEnums = PayStatus;
    inApp = isInApp;
    isInWechat = isInWechat;
    isSubscribeLinkLoading = false;
    isSubscribeLinkError = false;
    booking = false;
    btnText = '进入话题间';
    originFee = '';

    created() {
      this.liveId = this.$route.params['id'];
      this.liveInfo = this.$route.meta['liveInfo'] as LiveInfoModel;

      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {}

      this.routeChange();
    }

    destroyed() {
      clearInterval(this.timer);
    }

    @Watch('$route')
    async routeChange() {
      const isFromPayment = await this.fromPaymentResult();

      if (!isFromPayment) {
        if (this.userInfo) this.initPaymentBtn();
//        this.getInviteePublicInfo();
        this.getSubscribeLink();
        this.setShareInfo();
      }
    }

    setShareInfo() {
      const shareTitle = `${this.userInfo ? this.userInfo.nick : '我'}邀请你参加#${this.liveInfo.subject}#直播分享`;
      const shareDesc = this.liveInfo.desc;
      const shareCover = this.liveInfo.coverThumbnailUrl;
      const shareLink = this.$router.resolve({path: `/lives/${this.liveId}/info`}).href;
      setDefaultShareInfo(shareTitle, shareDesc, shareCover, shareLink);
    }

    async fromPaymentResult() {
      const payResult = this.$route.query['payResult'];

      if (!payResult) return false;

      if (payResult === 'success') {
        setPaymentNone();
        this.payStatus = PayStatus.Success;
        this.liveInfo = await getLiveInfo(this.liveId);
        this.initPaymentBtn();
      } else if (payResult === 'cancel') {
        this.payStatus = PayStatus.None;
      } else {
        this.payStatus = PayStatus.Failure;

        switch (payResult) {
          case 'weixin_js_bridge_not_found':
            this.payResult = '微信支付初始化失败，请刷新页面重试';
            break;
          case 'timeout':
            this.payResult = '支付超时，请重新支付';
            break;
          case 'closed':
            this.payResult = '订单已超时，请重新购买';
            break;
          case 'already paid':
            this.liveInfo = await getLiveInfo(this.liveId);
            this.payResult = '您已购买本话题间，无须再次支付';
            break;
          case 'fail':
            this.payResult = '支付失败，请联系我们';
            break;
        }
        console.error(decodeURIComponent(payResult));
      }

      this.$router.back();

      return true;
    }

    initPaymentBtn() {
      this.originFee = '';

      if (
        this.liveInfo.isNeedPay &&
        !this.liveInfo.paid &&
        this.userInfo &&
        this.liveInfo.isAudience(this.userInfo.uid)
      ) {
        if (this.userInfo.isMember) {
          if (this.liveInfo.memberFee.value === 0) {
            this.btnText = `会员免费`;
          } else {
            this.btnText = `会员价: ${this.liveInfo.memberFee.toYuan()}`;
          }

          if (this.liveInfo.originFee.value && this.liveInfo.originFee.value !== this.liveInfo.memberFee.value) {
            this.originFee = this.liveInfo.originFee.toYuan();
          }
        } else {
          if (this.liveInfo.totalFee.value === 0) {
            this.btnText = `限时免费`;
          } else {
            this.btnText = `支付: ${this.liveInfo.totalFee.toYuan()}`;
          }

          if (this.liveInfo.originFee.value && this.liveInfo.originFee.value !== this.liveInfo.totalFee.value) {
            this.originFee = this.liveInfo.originFee.toYuan();
          }
        }
      } else {
        this.btnText = '进入话题间';
      }
    }

    async bookLive() {
      if (!this.checkLogin()) return;

      if (this.booking) return;

      this.booking = true;

      try {
        const result = await Promise.all<UserInfoModel, LiveInfoModel>([
          getUserInfo(false),
          bookLive(this.liveInfo.id),
        ]);

        this.userInfo = result[0];
        this.liveInfo = result[1];

        if (!this.userInfo.isSubscribed && !this.inApp) {
          this.showQrcode();
        } else if (!this.userInfo.isSubscribed && this.inApp) {
          this.showQrcode()
        } else if (this.userInfo.isSubscribed) {
          showTips('订阅成功');
        }
      } finally {
        this.booking = false;
      }
    }

    async unbookLive() {
      if (!this.checkLogin()) return;

      if (this.booking) return;

      this.booking = true;

      try {
        this.liveInfo = await unbookLive(this.liveInfo.id);
        showTips('您已取消订阅');
      } finally {
        this.booking = false;
      }
    }

    closePayment() {
      this.payStatus = PayStatus.None;
    }

    checkLogin() {
      if (!this.userInfo) {
        this.$router.push({path: '/signin', query: {redirectTo: `/lives/${this.liveId}/info`}});
        return false;
      }

      return true;
    }

    checkMobileBinded() {
      if (this.userInfo && this.userInfo.isMobileBinded) {
        return true;
      }

      this.$router.push({path: '/signup', query: {redirectTo: `/lives/${this.liveId}/info`}});
      return false;
    }

    async payLive() {
      if (!this.checkLogin()) return;

      if (!this.checkMobileBinded()) return;

      if (this.isPaying) return;

      this.isPaying = true;

      const orderQuery = new PostOrderObject(this.liveId, OrderObjectType.LiveStream, 1);

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
      this.$router.push({path: `/lives/${this.liveInfo.id}/info`, query: {payResult: 'success'}});
    }

    gotoLive() {
      this.$router.push({path: `/lives/${this.liveInfo.id}`});
    }

    showQrcode() {
      if (!this.checkLogin()) return;

      this.isQrcodeShown = true;

      // 轮询用户是否已订阅公众号
      this.timer = setInterval(async () => {
        const userInfo = await getUserInfo();
        if (userInfo.isSubscribed) {
          this.closeQrcode();
          showTips('订阅成功');
        }
        this.userInfo = userInfo;
      }, 3 * 1000);
    }

    closeQrcode() {
      this.isQrcodeShown = false;
      clearInterval(this.timer);
    }

    async copyToClipboard(text: string) {
      await copyText(text);
      showTips('复制成功');
      this.closeQrcode();
    }

    async getSubscribeLink(): Promise<void> {
      if (this.isSubscribeLinkLoading) return;

      this.isSubscribeLinkLoading = true;
      this.isSubscribeLinkError = false;

      try {
        this.qrcode = await getSubscribeLink(this.liveId);
      } catch (e) {
        this.isSubscribeLinkError = true;
        throw e;
      } finally {
        this.isSubscribeLinkLoading = false;
      }
    }

    gotoShareStar() {
      this.$router.push({path: `/lives/${this.liveInfo.id}/share-star`});
    }

    hasPresent(): boolean {
      return this.liveInfo.isNeedPay && this.liveInfo.paid && !this.liveInfo.isPayByPresent;
    }

    gotoPresent() {
      if (!this.checkLogin()) return;

      this.$router.push({path: `/lives/${this.liveInfo.id}/present`, query: {fromUid: `${this.userInfo.uid}`}});
    }

    go() {
      if (!this.checkLogin()) return;

      if (
        this.liveInfo.isNeedPay &&
        !this.liveInfo.paid &&
        this.liveInfo.isAudience(this.userInfo.uid)
      ) {
        this.payLive();
      } else {
        this.gotoLive();
      }
    }
  }
</script>
