<template>
  <article class="container">
    <transition name="slide-left" v-if="status===1">
      <div class="content" v-show="show">
        <header>NO.{{bookId}} 预约成功！</header>
        <div class="guest-tips">
          <div class="avatar">
            <div class="bg"><img :src="guest.cover"/></div>
          </div>
          <div class="description"><span>NO.{{bookId}}</span> 预约成功！你好我是 <span>{{guest.name}}</span>,期待跟你见面！</div>
        </div>
        <div class="guest-tips">
          <div class="avatar">
            <div class="bg"><img :src="guest.cover"/></div>
          </div>
          <div class="description">见面会开始时间是<span>2018年5月19日18:30</span>,不要忘了！</div>
        </div>
        <div class="guest-tips">
          <div class="avatar">
            <div class="bg"><img :src="guest.cover"/></div>
          </div>
          <div class="description">你需要<span>将此页面截图出示给工作人员</span>才能入场，好了，到时候见！</div>
        </div>
      </div>
    </transition>
    <div class="try" v-else-if="status===0" @click="back">
      点击返回重试
    </div>
    <div class="text-tip" v-else-if="status===2">
      <h3>嘉宾见面名额已约满</h3>
      <p>嘉宾见面名额已满，您的问题我们会发给嘉宾，嘉宾回答后将在公众号中公布</p>
      <p @click="back">点击返回</p>
    </div>
    <div class="text-tip" v-else="status===3">
      <h3>嘉宾提问名额已满</h3>
      <p>很遗憾，这个嘉宾的见面会太火爆了，你晚了一步，没有约到。快去试约一下其他嘉宾吧~</p>
      <p @click="back">点击返回</p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100vh;
    background-color: #000;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    position: absolute;
    top: 0;
    left: 0;

    .try {
      background-color: #000;
      width: 100%;
      height: 100vh;
      text-align: center;
      line-height: 100vh;
      color: rgb(166, 166, 166);
    }

    .text-tip {
      padding: 0 20px;
      text-align: center;

      h3 {
        margin: 48px 0 20px 0;
        color: rgb(0, 211, 193);
        font-size: 20px;
        line-height: 20px;
        letter-spacing: 0;
      }

      p {
        color: rgb(166, 166, 166);
        font-size: 14px;
        line-height: 22px;
      }
    }

    .content {
      background-color: #000;
      padding: 0 20px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition: all 1s cubic-bezier(0, 0, .2, 1);

      header {
        margin-top: 28px;
        width: 100%;
        letter-spacing: -0.5px;
        font-size: 20px;
        font-weight: 600;
        line-height: 22px;
        background-color: rgb(0, 211, 193);
        text-align: center;
        border-radius: 25px;
        padding: 10px 0;
        color: #fff;

      }

      .guest-tips {
        $avatarSize: 60px;
        margin-top: 43px;
        display: flex;
        font-size: 0;
        align-items: center;

        .avatar {
          height: $avatarSize;
          width: $avatarSize;
          padding: 3px;
          border-radius: 32px;
          background-color: rgb(166, 166, 166);
          font-size: 0;

          .bg {
            background-color: #9a783a;
            height: 100%;
            width: 100%;
            border-radius: 32px;
            overflow: hidden;

            img {
              width: 100%;
            }
          }
        }

        .description {
          margin-left: 14px;
          padding: 12px 14px 12px 23px;
          width: calc(100% - #{$avatarSize + 14px});
          font-size: 17px;
          line-height: 26px;
          letter-spacing: -0.5px;
          border-radius: 4px;
          font-weight: 700;
          color: #fff;
          background-color: #46ec50;

          span {
            color: rgb(0, 211, 193);
          }
        }
      }

    }

    .slide-left-enter {
      opacity: 0;
      transform: translate(30px, 0);
    }
    .slide-left-leave-active {
      opacity: 0;
      transform: translate(30px, 0);
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {isInWechat} from "../../../shared/utils/utils";
  import {host} from "../../../env/environment";
  import {setShareInfo} from '../../../shared/utils/share';
  import {bookGuestsMockData} from './reservation.api';
  import {showTips} from "../../../store/tip";

  @Component({
    props: ['bookNo']
  })
  export default class ReservationComponent extends Vue {
    bookGuests = bookGuestsMockData;
    ticketNo = '';
    chooseId = '';
    show = false;
    guest: any = {};
    bookId: number;
    maxMeet = 5;//嘉宾见面名额
    maxQuestion = 10;//问题名额
    status = -1;//0 错误，1在见面中，2不在见面中在提问中，3超出提问

    created() {
      this.share();
      this.init();
    }

    async share() {
      if (isInWechat) {
        setShareInfo(
          '预约嘉宾',
          `和嘉宾面对面交流`,
          'https://og9s6vxbs.qnssl.com/wiee/wiee-share.jpg',
          `${host.self}/wv/reservation`
        );
      }
    }

    async init() {
      this.bookId = parseInt(this.$props.bookNo);

      // 直接访问当前页面，渲染错误页面
      if (this.bookId < 0) {
        this.status = 0;
        return;
      }

      // 在见面名额中，渲染见面页面
      if (this.bookId >= 0 && this.bookId <= this.maxMeet) {
        let chooseId = this.$route.params['id'];
        let guest = this.findSpeaker(chooseId);
        if (guest.length > 0) {
          showTips('预约成功');
          this.guest = guest[0];
          this.status = 1;
        } else {
          this.status = 0;
        }
        return;
      }

      // 不见面名额中，在提问名额中，渲染只可提问页面
      if (this.bookId > this.maxMeet && this.bookId <= this.maxQuestion) {
        this.status = 2;
        return;
      }

      // 超出提问名额，渲染超出页面
      if (this.bookId > this.maxQuestion) {
        this.status = 3;
        return;
      }
    }

    findSpeaker(id: string): any {
      return this.bookGuests.filter((item) => {
        return item.id === id
      });
    }

    mounted() {
      setTimeout(() => {
        this.show = true;
      }, 10)
    }

    back() {
      this.$router.push({path: `/wv/reservation`})
    }

  }
</script>
