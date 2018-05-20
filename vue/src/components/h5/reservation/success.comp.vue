<template>
  <article class="container">
    <transition name="slide-left" v-if="status===1">
      <div class="content" v-show="show">
        <header>NO.{{bookId}} 约问成功！</header>
        <div class="guest-tips">
          <div class="avatar">
            <div class="bg"><img src="https://og9s6vxbs.qnssl.com/reservation/zaojiu-logo.png"/></div>
          </div>
          <div class="description description-b">
            恭喜您，您是第<span>{{bookId}}</span>位约问题的观众。 我们将会把您的问题在嘉宾演讲结束后给到嘉宾。 您的问题将有机会在所有Talk环节结束后，得到嘉宾今天的现场回答。
          </div>
        </div>
        <!--<div class="guest-tips">
          <div class="avatar">
            <div class="bg"><img src="https://og9s6vxbs.qnssl.com/reservation/zaojiu-logo.png"/></div>
          </div>
          <div class="description description-s">Ta的Talk开始时间是<span>{{guest.meetTime}}</span>,不要忘了！</div>
        </div>-->
      </div>
    </transition>
    <div class="try" v-else-if="status===0">
      <h4>页面错误</h4>
      <div class="back" @click="back">返回首页</div>
    </div>
    <div class="text-tip" v-else-if="status===2">
      <h3>约问已满</h3>
      <p>真的很抱歉，由于时间原因，预约的现场问题回答名额已满，但是我们已经记住你的问题啦！我们会统一整理发给嘉宾，请关注造就微信公众号，一有回复我们会发出来哦！</p>
      <div class="qrcode">
        <img src="https://og9s6vxbs.qnssl.com/reservation/zaojiu-qrcode.jpg"/>
      </div>
      <div class="bottom">
        <button @click="back">约问其他嘉宾</button>
      </div>
    </div>
    <div class="text-tip" v-else="status===3">
      <h3>问题名额已满</h3>
      <p>很抱歉，这个嘉宾太火爆了，问题数量已爆满，你也可以向其他嘉宾提问哦！</p>
      <div class="bottom">
        <button @click="back">约问其他嘉宾</button>
      </div>
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
      color: rgb(166, 166, 166);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      h4 {
        font-size: 21px;
        line-height: 24px;
        text-align: center;
        color: rgb(166, 166, 166);
      }

      .back {
        margin-top: 12px;
        font-size: 14px;
        line-height: 14px;
        color: rgb(0, 211, 193);
      }
    }

    .text-tip {
      padding: 0 30px;
      text-align: center;

      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 15px;
        width: 100%;
        button {
          width: 100%;
          background-color: rgb(0, 211, 193);
          border-radius: 4px;
          font-size: 18px;
          line-height: 18px;
          padding: 11px 0;
          color: #fff;
          font-weight: 600;
        }
      }

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

      .qrcode {
        width: 40%;
        margin: 60px auto 0 auto;

        img {
          width: 100%;
        }
      }

      .back {
        margin-top: 12px;
        font-size: 14px;
        line-height: 14px;
        color: rgb(0, 211, 193);
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
        font-size: 18px;
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
        align-items: flex-start;

        .avatar {
          height: $avatarSize;
          width: $avatarSize;
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

          span {
            color: rgb(0, 211, 193);
          }
        }

        .description-b {
          background: url("https://og9s6vxbs.qnssl.com/reservation/text-l.png") no-repeat;
          background-size: 100% 100%;
        }
        .description-s {
          background: url("https://og9s6vxbs.qnssl.com/reservation/text-s.png") no-repeat;
          background-size: 100% 100%;
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
  import {bookGuestsMockData, maxMeet, maxQuestion, meetTime} from './reservation.api';
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
    maxMeet = maxMeet;//嘉宾见面名额
    maxQuestion = maxQuestion;//问题名额
    status = -1;//0 错误，1在见面中，2不在见面中在提问中，3超出提问
    meetTime = meetTime;

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
