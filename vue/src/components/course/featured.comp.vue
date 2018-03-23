<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div v-else>
      <div class="content">
        <div class="img-cover">
          <img src="https://og9s6vxbs.qnssl.com/course/cxg.jpg?t=1"/>
        </div>
      </div>
      <footer class="buy-btn">
        <div class="try" v-if="!courseInfo.paid">
          <button class="button" @click="audition()">
            <span>试听</span>
          </button>
        </div>
        <div class="buy">
          <button class="button button-primary" @click="go()" :disabled="isPaying">
            <span class="origin-fee" v-if="originFee && !courseInfo.currentUserInfo.paid">{{originFee}}</span>
            <span>{{btnText}}</span>
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .container {

    .content {
      height: calc(100vh - 50px);
      overflow: auto;
      background-color: #1a1a1a;

      .img-cover {
        font-size: 0;
        img {
          width: 100%;
        }
      }
    }
    .buy-btn {
      display: flex;
      align-items: center;
      color: #ffffff;
      font-weight: bold;
      text-align: center;

      .try {
        background-color: rgb(56, 56, 56);
        font-size: 18px;
        width: 35%;
      }

      .buy {
        flex-grow: 1;
      }

      .button {
        border-radius: 0;
        height: 50px;
        font-weight: bold;
        line-height: 50px;
        color:#fff;
      }

      .button-primary {
        flex-grow: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: bold;
        background-color: rgb(0,211,193);

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
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {getCourseInfo, joinGroup} from '../../shared/api/course.api';
  import {Course} from '../../shared/api/course.model';
  import {UserInfoModel} from '../../shared/api/user.model';
  import {setPaymentNone} from "../../store/payment";
  import {showTips} from '../../store/tip';
  import {ApiError} from '../../shared/api/xhr';
  import {ApiCode, ApiErrorMessage} from '../../shared/api/code-map.enum';
  import {pay} from '../../shared/api/pay.api';
  import {Store} from "../../shared/utils/store";
  import {PostOrderObject, OrderObjectType} from "../../shared/api/order.model";
  import {getRelativePath} from '../../shared/utils/utils';
  import {createOrder} from '../../shared/api/order.api';
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';
  import {isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";

  @Component({})
  export default class CourseMall extends Vue {
    courseList: any[] = [];
    userInfo: UserInfoModel;
    courseInfo = new Course({});
    id = '5ab2071bbd4dcb0001f27828';
    isLoading = false;
    isError = false;
    isNotFound = false;
    isPaying = false;
    groupId = '';

    created() {
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
        this.courseInfo = await getCourseInfo(this.id);
        this.groupId = this.courseInfo.groupId;
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
      setShareInfo('课程',
        `「造就」精品课程,期待你的加入`,
        `${host.assets}/assets/img/zaojiu-logo.jpg`,
        `${host.self}${this.$route.fullPath}`);
    }

    get originFee(): string {
      if (this.courseInfo.originFee.value && this.courseInfo.originFee.value !== this.courseInfo.totalFee.value) {
        return this.courseInfo.originFee.toYuan();
      }

      return '';
    }

    get btnText(): string {

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
          return '进入专栏';

        }
      } else {
        return '进入专栏';
      }
    }

    fromPaymentResult() {
      const payResult = this.$route.query['payResult'];

      if (!payResult) return false;

      if (payResult === 'success') {
        showTips('支付成功');
        joinGroup(this.groupId);
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

    async actionImgCover(item: any) {
      // 在线课程跳转到课程
      this.$router.push({path: `/course/${item.courseId}/cover`});
    };

    go() {
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
      if (this.courseInfo.paid) {
        let to = `/course/${this.id}/cover`;
        if (checkLogin(to)) this.$router.push({path: to, query: {groupId: this.courseInfo.groupId}});
      } else {
        if (checkLogin(this.$route.fullPath) && checkMobileBinded(this.$route.fullPath)) {
          this.createOrder();
        }
      }
    }

    async createOrder() {
      if (this.isPaying) return;

      this.isPaying = true;
      const orderQuery = new PostOrderObject(this.id, OrderObjectType.Course, 1);

      try {
        const orderMeta = await createOrder([orderQuery], [], false);
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

    audition() {
      this.$router.push({path: `/course/${this.id}/cover`});
    }

  }
</script>

