<template>
  <div class="container">
    <!--<bd-loading class="abs-center" v-if="isLoading"></bd-loading>-->

    <div class='item'>
      <div class='item-head'>
        <div class='img'>
          <img :src='orderCon.image' alt="商品图" />
        </div>
        <div class='info'>
          <p class='title'>{{orderCon.title}}</p>
          <p class='type'>{{orderCon.typeName}}</p>
        </div>
        <div class='moneyInfo'>
          <p class='newMoney'>￥ {{(orderCon.unitPrice)/100}}</p>
          <p class='oldMoney'>￥ {{(orderCon.oldPrice)/100}}</p>
          <p class='num'> x{{orderCon.num}}</p>
        </div>
      </div>
    </div>
    <div class="choose" @click="goProPrice">
      <span>选取优惠券</span>
      <!--<i v-if="isYouhui">-{{isYPrice}}元</i>-->
      <i v-if="isYouhui">已优惠</i>
    </div>

    <div class="footer">
      <div class="left">合计: <span>{{(orderCon.totalPrice)/100}}元</span></div>
      <div class="right" @click="createOrder()">立即付款</div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getEventList} from "../../../shared/api/event.api";
  import {EventModel} from "../../../shared/api/event.model";
  import {isInWechat,isAndroid} from "../../../shared/utils/utils";
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from "../../../shared/utils/share";
  import {host} from "../../../env/environment";
  import {showTips} from "../../../store/tip";
  import {getRelativePath,params} from "../../../shared/utils/utils";
  import {ApiErrorMessage} from "../../../shared/api/code-map.enum";
  import {setPaymentNone} from "../../../store/payment";
  import {crOrder} from "../../../shared/api/order.api";
  import {pay} from "../../../shared/api/pay.api";
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {UserInfoModel} from '../../../shared/api/user.model';
  import {initIOS, callHandler} from "../../../shared/utils/ios";
  @Component
  export default class EventListComponent extends Vue {
    userInfo: UserInfoModel | null = null;
    isYouhui=false;
    isYPrice=0;
    // isLoading = true;
    orderCon:any;//接收商品信息
    postData:any={'items':[{'subject':'','type':121,'objectId':'','fee':0,'price':0,'nums':0,'discountedFee':0}]};
    isAndroid=isAndroid;
    created() {
      this.userInfo = getUserInfoCache();
      this.initData();
    }

    initData(){
      let price:any = sessionStorage.getItem('favPrice');//是否有优惠券
      console.log(price);
      if(price!='null'){
        this.isYouhui=true;
        this.isYPrice = price;
      }
      let order:any = sessionStorage.getItem('order');//商品信息
      console.log(order);
      if(order!=null){
        console.log(JSON.parse(order));
        this.orderCon = JSON.parse(order);
        if(this.isYouhui){
          this.orderCon.totalPrice=0;
        }
      }else{

      }

    }

    //创建订单
   async createOrder(){

      this.postData.items[0].subject = this.orderCon.title;
      this.postData.items[0].objectId = this.orderCon.goodsId;
      this.postData.items[0].price = this.orderCon.totalPrice;
      console.log(this.postData);
      let create = await crOrder(this.postData);
      //安卓端购买跳转
      if (this.isAndroid) {
        initIOS();
        callHandler('payOrder', `${host.self}/orders?items=${encodeURIComponent(JSON.stringify([this.postData]))}`);
        return;
      }

    }
    goProPrice(){
      this.$router.push({path: '/app/order/card'});
    }



  }
</script>

<style lang="scss" scoped>
  .container {

    padding: 20px 20px 60px 20px;
    .item{

      .item-head{
        display: flex;
        height: 80px;
        background: rgb(247, 247, 247);
        margin-bottom: 32px;
        .img{
          width: 80px;
          margin-right: 8px;
          img{
            width: 80px;
            height: 80px;
            object-fit: cover;
          }
        }
        .info{
          flex: 1;
          .title{
            font-size: 14px;
            line-height: 20px;
            font-weight: 700;
            color: rgb(85, 85, 85);
            margin: 7px 0 8px 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .type{
            font-size: 14px;
            line-height: 14px;
            font-weight: 700;
            color: rgb(179, 179, 179);
          }

        }
        .moneyInfo{
          width: 57px;
          text-align: right;
          margin-right: 8px;
          .newMoney{
            font-size: 14px;
            line-height: 14px;
            font-weight: 700;
            color: rgb(85, 85, 85);
            margin: 10px 0 6px 0;
          }
          .oldMoney{
            font-size: 14px;
            line-height: 14px;
            color: rgb(179, 179, 179);
            text-decoration:line-through;
            margin-bottom: 6px;
          }
          .num{
            font-size: 14px;
            line-height: 14px;
            color: rgb(179, 179, 179);
          }
        }
      }
    }
    .choose{
      background: url("assets/enter-right.png") no-repeat center right;
      background-size: 20px;
      span{
        font-size: 16px;
        line-height: 22px;
        color: rgb(85,85,85);
        font-weight: 700;
      }
      i{
        font-size: 16px;
        color: $color-brand;
        font-weight:600 ;
        font-style: normal;
        float: right;
        padding-right: 20px;
      }
    }
    .footer{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      background-color: #fff;


      line-height: 50px;
      text-align: center;
      font-weight: 700;
      .left{
        float: left;
        width: 50%;
        font-size: 16px;
        color: rgb(85,85,85);
        border-top: 1px solid rgb(242,242,242);
        span{
          font-size: 16px;
          color: $color-brand;
          font-weight: 600;
        }
      }
      .right{
        background-color: $color-brand;
        float: right;
        width: 50%;
        font-size: 16px;
        color: #fff;
      }
    }


  }
</style>
