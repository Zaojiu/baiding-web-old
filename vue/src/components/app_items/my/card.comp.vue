<template>
  <div class="container">

    <div class="content">
      <div class="items_tab">
        <div class="tabs" id="tab">
          <i
            v-for="(item,index) in tabs" class="tab"
            :class="{active:index == num}"
            @click="tab(index)">{{item}}</i>

        </div>
      </div>
      <div class="item_list" v-show=" num == 0">
        <div v-for="(item,index) in ticketsList">
          <div class="item itemY" >
            <div class="text ">
              <h3 class="txt_one">{{item.title}}</h3>
              <time class="txt_one">{{upTime(item.expireDate)}}</time>
              <address class="txt_one">{{item.address}}</address>
            </div>
            <!--<div class="give">-->
              <!--<img src="https://og9s6vxbs.qnssl.com/app-down/android-down.png" alt="">-->
              <!--<div class="friend" v-if="compareTime(item.expireDate)" @click="gerErCode()">-->
                <!--<span >送朋友</span>-->

              <!--</div>-->
              <!--<div class="friend yesFriend" v-if="!compareTime(item.expireDate)" >-->
                <!--<span >已结束</span>-->
              <!--</div>-->
            <!--</div>-->
          </div>
        </div>



      </div>
      <div class="noList" v-show="yesTicNull">
        暂无活动票
      </div>
      <div class="item_list" v-show=" num == 1">


        <div class="item itemY" v-for="(item,index) in discountList">
          <div class="text">
            <h3 class="txt_one">{{item.title}}</h3>
            <time class="txt_one">有效期：{{upTime(item.expiryDateStart)}}-{{upTime(item.expiryDateStop)}}</time>
            <address class="txt_one">限造就现场使用</address>
          </div>

        </div>

      </div>
      <div class="noList" v-show="yesDicNull">
        暂无优惠券
      </div>
      <div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getEventList} from "../../../shared/api/event.api";
  import {EventModel} from "../../../shared/api/event.model";
  import {isInWechat} from "../../../shared/utils/utils";
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from "../../../shared/utils/share";
  import {Course} from '../../../shared/api/course.model';
  import axios from 'axios';
  import {host} from "../../../env/environment";
  import jquery from 'jquery'
  @Component
  export default class EventListComponent extends Vue {
    tabs=["活动票","优惠券"];
    num=0;
    isHidden=false;
    follow=false;//是否关注
    followTxt='关注';

    isErCode=false;
    discountList=[];//优惠券
    ticketsList=[];//活动票
    yesTicNull=false;
    yesDicNull=false;
    created() {
      axios.defaults.withCredentials = true; //让ajax携带cookie
      this.initDataTic();
    }
    //优惠券
    initDataDis(){
      ///api/wallet/discountList
      //this.$route.params['id']
      axios.get(`${host.io}/api/wallet/discountList`).then(res=>{
        let data = res.data.results;
        let disList:any = this.discountList;
        // for(let i=0;i<data.length;i++){
        //   disList.push(data[i]);
        // }

        this.discountList = res.data.results;
        console.log(data.length);
        if(data.length==undefined && this.num==1){
          this.yesDicNull=true;
          this.yesTicNull=false;
        }
        console.log(this.discountList);
      })


    }
    //活动
    initDataTic(){
      axios.get(`${host.io}/api/wallet/ticketsList`).then(res=>{
        let data = res.data.results;
        let ticList:any = this.ticketsList;
        // for(let i=0;i<data.length;i++){
        //   ticList.push(data[i]);
        // }

        if(data.length==undefined && this.num==0){
          this.yesTicNull=true;
          this.yesDicNull=false;

        }
        this.ticketsList = res.data.results;

      })
    }
    mounted() {
      this.setWidth('#tab');

    }
    tab(index:any) {
      this.num = index;
      if(index==0){
        this.initDataTic();
      }else if(index==1){
        this.initDataDis();
      }

    }
    //送朋友->二维码
    gerErCode(){

      this.isErCode = !this.isErCode;
    }
    //时间转化
    upTime(time:any){
      return moment(time).format('YYYY.MM.DD hh:ss');
    }
    //时间比较
    compareTime(time1:any){
      var time:any = new Date();
      var timestamp1 =Date.parse(time);
      if(time1>timestamp1){
        return true;
      }else{
        return false;
      }
    }
    //滚动宽度
    setWidth(lab:any){
      var _$ = $(lab);
      let len:any=0;
      for (var i=0;i<_$.find('i').length;i++){
        len+=_$.find('i').eq(i).outerWidth(true)
      }
      let $width:any=_$.width();
      if($width<=len){
        _$.width(len)
      }

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
    .content{
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

      .item{


        margin: 0 0 20px 0;
        height: 88px;
        /*border: 1px solid #eee;*/
       display: flex;
          border-radius: 4px;
        padding: 10px 16px;

        .text{
         flex: 1;
          overflow: hidden;
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
      .itemN{
        background: url('/assets/cardN.png') no-repeat center;
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

  }
</style>
