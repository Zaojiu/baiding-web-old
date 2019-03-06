<template>
  <div class="container">
    <app-download-tips
      class="app-download-tips"
      v-if="isAppDownloadTipsShow"
      @close="isAppDownloadTipsShow = false"
    ></app-download-tips>
    <div class="event" v-for="event in eventList" @click="gotoTicket(event.id)">
      <p class="status"
         v-bind:style="event.status==0? 'background-color: rgba(208, 2, 27,0.8); color: white' : 'background-color: rgb(217, 217, 217); color: rgb(128, 128, 128)'">
        {{ event.status==0 ? ' 报名中' : '已结束' }}</p>
      <img class="top-cover" v-bind:src="event.image">
      <div class="bottom-info">
        <p class="bottom-info-sub">{{event.title}}</p>
        <p class="bottom-info-desc">{{event.eventDate}} · {{event.address}}</p>
      </div>
    </div>
    <div class="nullList" v-if="isDataNull">
      ~~到底了~~
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {isInWechat,isInApp} from "../../../shared/utils/utils";
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from "../../../shared/utils/share";
  import {host} from "../../../env/environment";
  import axios from 'axios';
  import appDownloadTips from '../../../shared/app-download-tips.comp.vue';
  import jquery from 'jquery';
  @Component({
    components: {
      appDownloadTips: appDownloadTips
    }
  })
  export default class EventListComponent extends Vue {

    isLoading = true;
    eventList = [];
    pageNum=0;
    pageSize=80;
    dataLength=1;
    isDataNull=false;
    isAppDownloadTipsShow = false;
    created() {
      if (!isInApp) {
        this.isAppDownloadTipsShow = true;
      }
      this.share();
      // this.initData();
      this.initEventList(this.pageNum);

      let _this = this;
      $(document).scroll(
        function() {
          if ($(document).scrollTop() + window.innerHeight == $(document).height()) {

            if(_this.dataLength<_this.pageSize){
              _this.isDataNull=true;
              return;
            }else{
              _this.pageNum++;
              _this.initEventList(_this.pageNum);
            }

          }
        });
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        setShareInfo('现场活动列表',
          '',
          `${host.assets}/assets/img/zaojiu-logo.jpg`,
          `${host.self}/events`);
      }
    }
    initEventList(num:number) {
      axios.get(`${host.io}/api/zj/event/eventList?pageSize=${this.pageSize}&pageIndex=`+num).then(res=>{
        let data = res.data.results.items;
        let disList:any = this.eventList;
        for(let i=0;i<data.length;i++){
          disList.push(data[i]);
        }
        this.dataLength = data.length;

        this.eventList = disList;
        console.log(this.eventList);

      })
    }
    gotoTicket(id: string) {
      this.$router.push({path: `/app/events/${id}/tickets`});
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    background-color: rgb(251, 251, 251);
    padding: 10px 0;
.nullList{
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(178,178,178);
}
    .event {
      position: relative;
      margin: 0px 20px;
      font-size: 0px;
      .status {
        position: absolute;
        top: 12px;
        right: 0;
        width: auto;
        font-size: 12px;
        font-weight: bold;
        line-height: 20px;
        height: 20px;
        padding: 0 9px;
        border-radius: 28px 0 0 28px;

      }

      .top-cover {
        object-fit: cover;
        width: 100%;
        height: 188px;
        border-radius: 4px;

      }

      .bottom-info {
        max-width: 100%;
        font-size: 16px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;


        .bottom-info-sub {
          width: 100%;
          font-size: 18px;
          padding: 12px 0 0 0;
          line-height: 24px;
          overflow: hidden;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .bottom-info-desc {
          width: 100%;
          line-height: 20px;
          font-size: 14px;
          overflow: hidden;
          padding: 8px 0 28px 0;
          color: rgb(204, 204, 204);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          font-weight: 600;
        }
      }
    }
  }
</style>
