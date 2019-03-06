<template>
  <div class="container">


    <div class="orders">

      <div class="items_tab">
        <div class="tabs" id="tab">
          <i
            v-for="(item,index) in tabs" class="tab"
            :class="{active:index == num}"
            @click="tab(index)">{{item}}</i>
        </div>
      </div>
      <div class="order" v-for="(item,index) in orders">
        <div class="block" @click="goOrderDetail(item.goodsorderid)">
          <div class="_itemT">
          <div class="item clearfix">
            <img class="cover" :src="item.goodsimage" alt="商品图片">
            <div class="detail">
              <div class="title">{{item.goodsname}}</div>
              <div class="desc">{{item.goodspaytype}}</div>
              <div class="price-amount">
                <div class="fee">￥{{(item.totaldiscountedfee)/100}}</div>
                <div class="price" >￥{{(item.totalfee)/100}}</div>

                <div class="amount">×{{(item.goodsnumber)/100}}</div>
              </div>
            </div>
          </div>
            <div class="soMoney">
              <span>共{{item.goodsnumber}}件商品 &nbsp;&nbsp;</span><span> 合计:<i>{{(item.totalprice)/100}}</i></span>
            </div>
          </div>

        </div>

        <div class="footer">
          <button class="button button-outline" v-if="item.status==0 || item.status==-1">取消订单</button>
          <!--<button class="button button-outline" @click.stop="detail(order.order.orderNo)">详情</button>-->
          <button class="button button-primary" v-if="item.status==0 || item.status==-1" >去支付</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    .orders {
      overflow: auto;
      height: 100vh;
      .items_tab{
        width: 100%;

        overflow: auto;
        .tabs{
          width: 100%;
          margin: 20px 0 1px 0;
          padding: 0 15px;
          .tab{
            font-size: 12px;
            padding: 6px 12px;
            margin-right: 20px;
            display: inline-block;
            color: rgb(178,178,178);
            font-weight: 500;
            font-style: normal;
          }
          .active{
            color: rgb(85,85,85);
            background-color: rgb(239,239,239);
            border-radius: 14px;
          }
        }
      }
      .top-nav + .order {
        border-top: solid 10px $color-gray4;
      }

      .order {

        overflow: hidden;
        .header {
          display: flex;
          flex-wrap: wrap;
          padding: 15px;
          border-bottom: solid 1px $color-gray4;

          .order-no {
            flex-grow: 1;
            font-size: $font-size-14;
            color: $color-dark-gray;
            white-space: nowrap;
          }

          .order-status {
            flex-shrink: 0;
            font-size: $font-size-14;
            color: $color-gray3;

            &.success {
              color: #32a534;
            }
          }
        }

        .item {

          border-bottom: solid 1px $color-gray4;
          margin: 15px 15px 8px 15px;

          background-color: rgb(247,247,247);

          .cover {

            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 10px;
            float: left;
          }

          .detail {
            margin: 0 0px 0 88px;
            position: relative;
            padding: 8px 75px 0 0;
          }

          .title {
            color: $color-dark-gray;
            font-size: $font-size-14;
            word-break: break-all;
            white-space: pre-wrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 5px;
            font-weight: 700;
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
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            font-weight: 700;
          }

          .price-amount {
            position: absolute;
            right: 8px;
            top: 8px;

            text-align: right;


              .fee {
                  font-size: 14px;
                color: rgb(85,85,85);
                font-weight: 700;
              }

              .price {
                font-size: 14px;
                color: rgb(179,179,179);
                text-decoration:line-through;
                margin: 6px 0;
                line-height: 14px;
              }


            .amount {
              font-size: 14px;
              color: rgb(179,179,179);
            }
          }

          }
        .soMoney{
          text-align: right;
          padding: 0 15px;
          line-height: 16px;
          span{
            font-size: 12px;
            i{
              font-style: normal;
              font-size: 16px;
              font-weight: 700;
            }
          }

        }

        .footer {

          padding: 16px;
          float: right;

          .fee {
            flex-grow: 1;
          }

          .button {
            flex-shrink: 0;
            line-height: 1em;
            width: auto;
            height: auto;
            padding: 6px 12px;
            margin-right: 8px;
            float: left;
            background-color: rgb(239,239,239);
            font-size: 13px;
            font-weight: 700;
            border:none;
            &.button-primary {
              padding: 6px 12px;
              background-color: $color-brand;
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

      .no-record {
        padding: 20px;
        text-align: center;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {scrollView} from '../../../shared/scroll-view/scroll-view.directive';
  import {Order, OrderStatus} from '../../../shared/api/order.model';
  import {listOrders, getOrder, closeOrder,orderList} from '../../../shared/api/order.api';
  import {showTips} from '../../../store/tip';
  import {pay} from '../../../shared/api/pay.api';
  import {setPaymentNone} from '../../../store/payment';
  import {UserInfoModel} from "../../../shared/api/user.model";
  import {getUserInfoCache} from '../../../shared/api/user.api';
  import {appConfig} from '../../../env/environment';
  import {showQrcode} from '../../../store/qrcode';
  import {host} from "../../../env/environment";

  @Component({



  })

  export default class OrderComponent extends Vue {
    tabs=["全部","待支付", "已支付"];
    num=0;
    orders:any=[];


    created() {

       this.initData();
    }
    @Watch('$route')
    routeChange() {
     console.log('1234');
    }
    tab(index:any) {
      this.num = index;
      console.log(this.num);
      this.initData();
    }

    async initData() {
      //订单集合
      let result:any = await orderList();
      let _this=this;
        if(_this.num==0){//全部
          _this.orders=result;
        }else if(_this.num==1){//待付款
          _this.orders=[];
          for (let i=0;i<result.length;i++){
              if(result[i].status==0 || result[i].status==-1){
                _this.orders.push(result[i]);
              }
          }
          console.log(_this.orders);
        }else if(_this.num==2) {//已付款
          _this.orders = [];
          for (let i = 0; i < result.length; i++) {
            if (result[i].status == 1 || result[i].status == 2) {
              _this.orders.push(result[i]);
            }
          }
        }

    }
    goOrderDetail(id:any){
      this.$router.push({path: '/app/my/orders/'+id})
    }

  }
</script>
