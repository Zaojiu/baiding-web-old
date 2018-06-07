<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <div class="event" v-for="event in eventList" @click="gotoTicket(event.id)">
      <p class="status"
         v-bind:style="checkDate(event)? 'background-color: rgb(0, 211, 193); color: white' : 'background-color: rgb(217, 217, 217); color: rgb(128, 128, 128)'">
        {{ checkDate(event) ? ' 报名中' : '已结束' }}</p>
      <img class="top-cover" v-bind:src="event.coverUrl">
      <div class="bottom-info">
        <p class="bottom-info-sub">{{event.subject}}</p>
        <p class="bottom-info-desc">{{showMoment(event.meta.startAt)}} · {{event.meta.address}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getEventList} from "../../shared/api/event.api";
  import {EventModel} from "../../shared/api/event.model";
  import {isInWechat} from "../../shared/utils/utils";
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from "../../shared/utils/share";
  import {host} from "../../env/environment";

  @Component
  export default class EventListComponent extends Vue {

    isLoading = true;
    eventList: EventModel [] = [];

    created() {
      this.share();
      this.initData();
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

    async initData() {
      let data = await getEventList();
      if (data) {
        this.isLoading = false;
        this.eventList = data;
      }
    }

    checkDate(event: EventModel) {
      if (moment().isAfter(event.meta.applyEndAtParsed)) {
        return false;
      } else {
        return true;
      }
    }

    showMoment(m: any) {
      return moment(m).format('YYYY-MM-DD');
    }

    gotoTicket(id: string) {
      this.$router.push({path: `/events/${id}/tickets`});
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    background-color: rgb(251, 251, 251);
    padding: 10px 0;

    .event {
      position: relative;
      margin: 30px 20px;

      .status {
        position: absolute;
        top: 0;
        right: 0;
        width: auto;
        font-size: 12px;
        font-weight: bold;
        line-height: 20px;
        padding: 4px 7px;
        margin: 7px;
      }

      .top-cover {
        object-fit: cover;
        width: 100%;
        height: auto;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }

      .bottom-info {
        max-width: 100%;
        font-size: 16px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);

        .bottom-info-sub {
          width: 100%;
          font-size: inherit;
          padding: 12px 20px 0 20px;
          line-height: 16px;
          overflow: hidden;
          font-weight: bold;
        }

        .bottom-info-desc {
          width: 100%;
          height: 16px;
          font-size: inherit;
          overflow: hidden;
          padding: 8px 20px 24px 20px;
          color: rgb(166, 166, 166);
        }
      }
    }
  }
</style>
