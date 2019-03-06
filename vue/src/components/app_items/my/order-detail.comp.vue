<template>
  <div class="order-container">
    <div class="status" v-if="orderDetail.status==1 || orderDetail.status==2" >
      支付成功
    </div>
    <div class="status" v-if="orderDetail.status==0 ">
      暂未支付
    </div>
    <div class="status" v-if="orderDetail.status==-1 " style="color: red;">
      支付失败
    </div>
    <div class="block">
      <div class="item">
        <img :src="orderDetail.goodsimage" class="cover" alt="商品图片">
        <div class="detail">
          <div class="title">{{orderDetail.goodsname}}</div>
          <div class="desc"></div>
          <div class="price-amount">
            <div class="price-fee">
              <div class="fee">￥{{orderDetail.totaldiscountedfee}}</div>
            </div>
            <div class="amount">x{{orderDetail.goodsnumber}}</div>
          </div>
        </div>
      </div>
    </div>
  <div class="amount_block">
    <div class="row">
      <span class="title">商品金额</span>
      <span>￥{{orderDetail.totaldiscountedfee}}</span>
    </div>
    <div class="row">
      <span class="title">合计</span>
      <span class="content">￥{{orderDetail.totalprice}}</span>
    </div>
  </div>
    <div class="amount_block">
      <div class="row">
        <span class="title">订单编号</span>
        <span>{{orderDetail.goodsorderid}}</span>
      </div>
      <div class="row">
        <span class="title">创建时间</span>
        <span class="content">{{showMoment(orderDetail.createtime)}}</span>
      </div>
      <div class="row">
        <span class="title">付款时间</span>
        <span class="content">{{showMoment(orderDetail.updatetime)}}</span>
      </div>
    </div>
<!--<footer>-->
  <!--<button  class="button button-primary button-block">查看票券</button>-->
<!--</footer>-->
  </div>
</template>

<style lang="scss" scoped>
  .order-container {
    padding-bottom: 80px;
    .status{
      padding: 15px;
      background-color: #f0f0f0;
      color: #4b4b4b;
      text-align: center;
      font-size: 16px;
    }
    .block{
      border-bottom: 10px solid #f0f0f0;
      .item{
        display: flex;
        border-bottom: 1px solid #f0f0f0;
        padding: 15px;
        .cover{
          flex-shrink: 0;
          width: 120px;
          height: 120px;
          -o-object-fit: cover;
          object-fit: cover;
          margin-right: 10px;
        }
        .detail{
          -webkit-box-flex: 1;
          -ms-flex-positive: 1;
          flex-grow: 1;
          .title{
            word-break: break-all;
            white-space: pre-wrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          .desc{
            color: #909090;
            font-size: 14px;
            line-height: 1.5em;
            -webkit-line-clamp: 2;
            word-break: break-all;
            white-space: pre-wrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          .price-amount{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: end;
            -ms-flex-align: end;
            align-items: flex-end;
            .price-fee{
              -webkit-box-flex: 1;
              -ms-flex-positive: 1;
              flex-grow: 1;
              .fee{
                color: #e23131;
                font-size: 18px;
              }
            }
            .amount{
              flex-shrink: 0;
              color: #909090;
              font-size: 14px;
            }

          }
        }
      }
      
    }
    .amount_block{
      border-bottom: 10px solid #f0f0f0;
      .row{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
      }
      .title{
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        font-weight: 700;
      }
      .content{
        flex-shrink: 0;
      }
    }
    footer{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      .button{
        display: block;

        font-size: 17px;
        line-height: 41px;
        text-align: center;
        border-radius: 0;
        height: 100%;
        padding: 0 20px;
        width: 100%;

      }
      .button-primary{
        background-color: $color-brand;
        border: $color-brand;
        color: #fff;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {scrollView} from '../../../shared/scroll-view/scroll-view.directive';
  import {Order, OrderStatus} from '../../../shared/api/order.model';
  import {orderDetail} from '../../../shared/api/order.api';
  import {showTips} from '../../../store/tip';
  import {pay} from '../../../shared/api/pay.api';
  import {setPaymentNone} from '../../../store/payment';
  import {UserInfoModel} from "../../../shared/api/user.model";
  import {getUserInfoCache} from '../../../shared/api/user.api';
  import {appConfig} from '../../../env/environment';
  import {showQrcode} from '../../../store/qrcode';
  import {host} from "../../../env/environment";

  @Component
  export default class OrderComponent extends Vue {
    orderDetail:any='';
    created() {
      //初始化内容
      this.initData();
    }
    async initData() {
      //订单集合
      this.orderDetail = await orderDetail(this.$route.params['id']);
    }
    // 时间格式化
    showMoment(m: any) {
      return moment(m).format('YYYY-MM-DD HH:mm:ss');
    }



  }
</script>
