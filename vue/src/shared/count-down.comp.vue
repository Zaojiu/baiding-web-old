<template>
  <div class="countdown" v-if="countDownStatus && display && daysArr">
    距直播开始
    <div class="digital">
      <span v-for="day in daysArr">{{day}}</span>
    </div>
    天
    <div class="digital">
      <span>{{hrs1}}</span>
      <span>{{hrs2}}</span>
    </div>
    小时
    <div class="digital">
      <span>{{mins1}}</span>
      <span>{{mins2}}</span>
    </div>
    分
    <div class="digital">
      <span>{{secs1}}</span>
      <span>{{secs2}}</span>
    </div>
    秒
  </div>
</template>

<style lang="scss" scoped>
  .countdown {
    display: flex;
    justify-content: center;
    padding: 9px;
    font-size: $font-size-12;
    color: $color-w;
    background-color: rgba(51, 51, 51, .8);

    .digital {
      display: flex;
      align-items: center;
      margin: 0 6px;
      color: $color-brand2;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {now} from './utils/utils';

  @Component({
    props: [
      'expectStartAt',
      'countDownStatus',
    ],
  })

  export default class CountDownComponent extends Vue {
    liveId: string;
    expectStartAt: string;
    countDownStatus: boolean;
    timer: any;
    daysArr: string[];
    hrs1: string;
    hrs2: string;
    mins1: string;
    mins2: string;
    secs1: string;
    secs2: string;
    display = true;

    created() {
      let timeNow = now();
      this.countDownTime(timeNow);

      this.timer = setInterval(() => {
        timeNow++;
        this.countDownTime(timeNow);
      }, 1000);
    }

    destroyed() {
      clearInterval(this.timer);
    }

    countDownTime(timeNow: number) {
      let endTimeParsed = moment.unix(+moment(this.expectStartAt) / 1000);
      let durationSec = Math.round(endTimeParsed.diff(moment.unix(timeNow)) / 1000);

      if (durationSec < 0) {
        this.display = false;
        clearInterval(this.timer);
      }

      let oneDaySecs = 24 * 60 * 60;
      let days = Math.floor(durationSec / (oneDaySecs)).toString();
      let hrs = Math.floor(durationSec % (oneDaySecs) / (60 * 60)).toString();
      let mins = Math.floor(durationSec % (oneDaySecs) % (60 * 60) / 60).toString();
      let secs = Math.floor(durationSec % (oneDaySecs) % (60 * 60) % 60).toString();

      this.daysArr = days.split('');
      if (this.daysArr.length === 1) this.daysArr.unshift('0');

      if (+hrs < 10) hrs = '0' + hrs;
      if (+mins < 10) mins = '0' + mins;
      if (+secs < 10) secs = '0 ' + secs;

      this.hrs1 = hrs.substr(0, 1);
      this.hrs2 = hrs.substr(1, 2);
      this.mins1 = mins.substr(0, 1);
      this.mins2 = mins.substr(1, 2)
      this.secs1 = secs.substr(0, 1);
      this.secs2 = secs.substr(1, 2);
    }

  }

</script>
