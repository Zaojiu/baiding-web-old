<template>
  <div class="container">
    <app-download-tips
      class="app-download-tips"
      v-if="isAppDownloadTipsShow"
      @close="isAppDownloadTipsShow = false"
    ></app-download-tips>
    <img class="img" :src="eventList.image" style="height: 200px;" alt="">
    <div class="content">
      <h1 class="subject">{{eventList.title}}</h1>
      <div class="dec" v-html="eventList.text">

      </div>
    </div>
    <div class="footer" @click="goOrder()">
      {{btnTxt}}
    </div>
  </div>

</template>

<style lang="scss" scoped>
  .dec >>> img{

    max-width: 100%;
    height: auto;
  }
  .container{
    .img{
      display: block;
      width: 100%;
      height: auto;
      object-fit: cover;
    }
    .content{
      box-shadow: 0 2px 2px #ececec;
      margin-bottom: 12px;
      background-color: #fff;
      overflow: hidden;
      padding-bottom: 60px;
      .subject{
        margin: 24px 20px 16px 20px;
        font-size: 20px;
        color: #555;
        line-height: 28px;
        word-break: break-all;
      }
      .dec{
        margin: 0 20px;
        font-size: 14px;
        line-height: 28px;
        color: #a6a6a6;
        overflow: hidden;
      }
    }
    .footer{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      line-height: 50px;
      font-weight: 700;
      font-size: 18px;
      text-align: center;
      background-color: $color-brand;
      color: #fff;
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getEventDetail} from "../../../shared/api/event.api";
  import {EventModel, EventTicketModel} from "../../../shared/api/event.model";
  import {Money, isInWechat, isAndroid, isInApp, isInWeiBo} from "../../../shared/utils/utils";
  import {TicketModel} from "../../../shared/api/ticket.model";
  import {checkOrderFee} from "../../../shared/api/order.api";
  import {initWechat} from "../../../shared/utils/wechat";
  import {PostOrderObject, OrderObjectType} from "../../../shared/api/order.model";
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {UserInfoModel} from "../../../shared/api/user.model";
  import {showTips} from '../../../store/tip';
  import {setShareInfo} from '../../../shared/utils/share';
  import {host} from "../../../env/environment";
  import {ApiError} from '../../../shared/api/xhr';
  import {ApiCode} from '../../../shared/api/code-map.enum';
  import {initIOS, callHandler} from "../../../shared/utils/ios";
  import appDownloadTips from '../../../shared/app-download-tips.comp.vue';
  import {showImageStall} from '../../../store/image-stall';
  import MySwiperComponent from '../../../shared/my-swiper.comp.vue';
  import {Store} from "../../../shared/utils/store";
  import axios from 'axios';
  import jquery from 'jquery';
  declare const wx: any;
  declare const unescape: any;

  @Component({
    components: {
      appDownloadTips: appDownloadTips,
      mySwiperComponent: MySwiperComponent
    }
  })
  export default class EventTicketComponent extends Vue {
    userInfo: UserInfoModel | null = null;
    btnTxt='购买门票';
    eventList:any=[];
    status:number;
    shareTitle='';
    isInApp = isInApp;
    userName='';
    isAppDownloadTipsShow = false;

    created(){
      if (!isInApp) {
        this.isAppDownloadTipsShow = true;
      }
      this.initData();

    }
    initData(){

      axios.get(`${host.io}/api/zj/event/eventList/${this.$route.params['id']}`).then(res => {
        this.eventList=res.data.results;
        this.status=this.eventList.status;
        this.shareTitle = res.data.results.title;
        if(this.eventList.status==0){
          this.btnTxt='购买门票';
        }else if(this.eventList.status==1){
          this.btnTxt='已结束售票';
        }else if(this.eventList.status==2){
          this.btnTxt='已结束售票';
        }
        this.share();
      })
    }
    async share() {
      // console.log(this.shareTitle);
      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/app/events/${this.$route.params['id']}/tickets`;
        let title = this.shareTitle;

        setShareInfo(
          title,
          'www.zaojiu.com',
          'https://baiding-pub.zaojiu.com/zaojiuUNI@3x.png',
          url
        );
      }
    }
    mounted() {
        // this.userInfo = getUserInfoCache(false);
        // console.log(1);
    }
    async goOrder(){
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
        if(this.isInApp){
          showTips('请登录');
          initIOS();
          callHandler('login');
          return;
        }
      } finally {
      }
      if(this.status==0){
          this.$router.push({path: `/app/events/${this.$route.params['id']}/tickets/purchase`})
      }else{
        console.log('已结束售票');
      }
    }
  }
</script>
