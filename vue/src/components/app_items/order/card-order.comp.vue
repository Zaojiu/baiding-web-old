<template>
  <div class="container">

    <div class="content">


      <div class="item_list" >
        <div class="topItem" @click="noActive">
          不使用优惠券
          <span class="icon" :class="{iconY:active==-1}" ></span>
        </div>
        <div class="item itemY" v-for="(item,index) in dataList" v-if="item.status==0" @click="activeCoupon(index,item.money)">
          <div class="text">
            <h3 class="txt_one">{{item.title}}</h3>
            <time class="txt_one">有效期：{{item.expiredat}}-{{item.startat}}</time>
            <address class="txt_one">限造就现场使用</address>
          </div>
          <span class="icon " :class="{iconY:active==index}"></span>
        </div>

      </div>

    </div>
    <div v-if="isCard" class="noList">暂无优惠券</div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {listCourses,listCourses2} from '../../../shared/api/course.api';
  import {Course} from '../../../shared/api/course.model';
  import {host} from "../../../env/environment";
  import axios from 'axios';
  import jquery from 'jquery';
  import {crReady} from "../../../shared/api/order.api";
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {UserInfoModel} from '../../../shared/api/user.model';
  @Component
  export default class EventListComponent extends Vue {

    dataList=[];
    active=-1;
    isCard=false;//暂无优惠券
    created() {
      sessionStorage.setItem('favPrice','null');
      this.initData();
    }
    initData(){
      //获取优惠券信息
      axios.get(`${host.io}/api/wallet/discountList`).then(res => {
        this.dataList =res.data.results;
        if(this.dataList.length<1){
          this.isCard=true;
        }
      })
    }
    //选中优惠
    activeCoupon(index:any,money:any){
      this.active = index;
      sessionStorage.setItem('favPrice',money);

    }
    //不优惠
    noActive(){
      this.active = -1;
      sessionStorage.setItem('favPrice','null');

    }


  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    padding: 10px 16px;

    ::-webkit-scrollbar {
      display: none;
    }
    .noList{
      position: fixed;
      top: 50%;
      left: 0;
      width: 100%; text-align: center;
      color: rgb(179,179,179);
      font-weight: 700;
      font-size: 16px;
      height: 50px;
      line-height: 50px;
      margin-top: -25px;
    }
    .content{
      .items_tab{
        width: 100%;
        overflow: auto;

      .tabs {
        width: 100%;
        margin-bottom: 16px;
        .tab {
          font-size: 12px;
          padding: 6px 12px;
          margin-right: 20px;
          display: inline-block;
          color: rgb(178, 178, 178);
          font-weight: 500;
          font-style: normal;
        }
        .active {
          color: rgb(85, 85, 85);
          background-color: rgb(239, 239, 239);
          border-radius: 14px;
        }
      }
      }
    }
    .item_list{
      .topItem{
        height: 40px;
        border-radius: 4px;
        background-color: #fff;
        border-left: 4px solid $color-brand;
        line-height: 40px;
        margin-bottom: 20px;
        font-size: 16px;
        padding-left: 20px;

        margin-left: 2px;
        font-weight: 700;
        position: relative;
        box-shadow: 0 1px 2px 2px rgba(0,0,0,0.03);


      }
      .item{
        position: relative;

        margin: 0 0 20px 0;
        height: 88px;
        /*border: 1px solid #eee;*/
       display: flex;
          border-radius: 4px;
        padding: 10px 16px;

        .text{
         flex: 1;
          overflow: hidden;
          padding-left: 10px;
          h3{
            font-size: 16px;
            line-height: 18px;
            color: rgb(85,85,85);
            margin-top: 5px;
            font-weight: 600;
          }
          time{
            font-size: 12px;
            line-height: 12px;
            color: rgb(179,179,179);
            margin: 8px 0 6px 0;
            display: block;
            font-weight: 600;
          }
          address{
            font-size: 12px;
            line-height: 12px;
            color: rgb(179,179,179);
            font-weight: 700;
            font-style: normal;
          }
          .txt_one{
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
          }
        }
        .give{
         width: 50px;

          text-align: center;
          img{
            width: 44px;
            height: 44px;
          }
          .friend{
            font-size: 12px;
            color: #fff;
            background-color: $color-brand;
            width: 48px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            border-radius: 2px;
            font-weight: 600;

            span{
              font-size:15px;
              -webkit-transform-origin-x: 0;
              -webkit-transform: scale(0.66);
              display: block;
              text-align: center;
              padding-left: 13px;
              width: 60px;
            }
          }
          .yesFriend{
            background-color: rgb(239,239,239);
            color: rgb(179,179,179);
          }
        }
      }
      .itemY{
        background: url('/assets/cardY.png') no-repeat center;
        background-size: 100% 88px;
      }


    }
    .fixed{
      position: fixed;
      width: 100%;
      height: 100vh;
      background-color: rgba(0,0,0,0.6);

      top: 0;
      left: 0;
      right: 0;
      .qrCode{
        width: 220px;
        height: 220px;
        padding: 10px;
        margin: 200px auto;
        background-color: #fff;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .icon{
      position: absolute;
      display: inline-block;
      width: 28px;
      height: 28px;
      top: 50%;
      margin-top: -14px;
      right: 20px;

      background: url("assets/noIcon.png") no-repeat center;
      background-size: 28px;
    }
    .iconY{
      background: url("assets/yesIcon.png") no-repeat center;
      background-size: 28px;
    }

  }
</style>
