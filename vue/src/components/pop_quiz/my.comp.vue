<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else>
      <article class="my-content git-content" v-if="id==='gift'&&this.prizes.length === 0">
        <img class="img-banner" :src="giftImg">
        <h3>你还未获得奖品</h3>
        <p>再接再厉，大奖一定属于你</p>
        <button @click="start">立即答题得奖品</button>
      </article>
      <article class="prizes-list" v-if="id==='gift'&&this.prizes.length > 0">
        <div v-for="item in prizes" class="prizes-item">
          <div @click="receivePrizes(item)">
            <img :src="item.detail.cover"/>
            <p class="text">{{item.detail.subject}}</p>
          </div>
        </div>
      </article>
      <article class="my-content card-content" v-if="id==='card'">
        <img class="img-banner" :src="lifeCardImg">
        <h3>你有 {{chance}} 张复活卡</h3>
        <p>复活卡可换取重新答题的机会</p>
        <button @click="shareGetCard">分享获得更多复活卡</button>
      </article>
      <article class="tips-group" v-if="id==='answertip'">

      </article>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .container {
    position: absolute;
    width: 100%;
    z-index: 1;
    background-color: rgb(22, 27, 60);
    height: 100vh;
    top: 0;

    .prizes-list {
      position: absolute;
      width: 100%;
      top: 0;
      height: 100vh;
      overflow: auto;
      padding-bottom: 30px;
      padding-left: 14vw;

      .prizes-item {
        display: inline-block;
        width: 30vw;
        margin: 30px 15% 0 0;
        text-align: center;
        img {
          width: 100%;
        }
        .text {
          text-align: center;
          height: 14px;
          line-height: 14px;
          color: rgba(255, 255, 255, .9);
          padding-top: 8px;
        }
      }
    }

    .my-content {
      position: absolute;
      width: 100%;
      top: 100px;
      text-align: center;
      img {
        width: 198px;
        height: 108px;
      }
      h3 {
        margin-top: 20px;
        font-size: 20px;
        line-height: 20px;
        color: rgb(230, 203, 28);
      }
      p {
        margin-top: 8px;
        font-size: 16px;
        line-height: 16px;
        color: rgb(230, 203, 28);
      }
      button {
        font-size: 18px;
        width: 250px;
        height: 50px;
        border-radius: 25px;
        background-color: rgb(255, 213, 30);
        margin-top: 81px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
      }
    }

    .card-content {
      img {
        width: 150px;
        height: 158px;
      }
      h3 {
        color: rgb(218, 91, 106);
      }
      p {
        color: rgb(166, 70, 81);
      }
      button {
        background-color: rgb(218, 91, 106);
        color: #fff
      }
    }

    .tips-group {

      .content {
        padding: 0 20px 0 20px;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        overflow: auto;
        color: rgb(253, 241, 126);

        header {
          text-align: center;
          h2 {
            font-size: 60px;
            letter-spacing: 6px;
          }
          h1 {
            font-size: 70px;
            letter-spacing: 7px;
            line-height: 70px;
          }
          .cycle {

          }
        }
      }
    }

  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {setTitle} from '../../shared/utils/title';
  import {getCardNum, getPrizesNum, createTest} from '../../shared/api/pop_quiz.api'
  import {params} from "../../shared/utils/utils";
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';
  import {isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";

  @Component({})
  export default class Index extends Vue {
    isLoading = false;
    isError = false;
    lifeCardImg = 'https://og9s6vxbs.qnssl.com/question_prize/qa-life-card-b.png';
    giftImg = 'https://og9s6vxbs.qnssl.com/question_prize/qa-gift-b.png';
    id = '';
    chance = 0;
    prizes = [];
    userInfo: UserInfoModel;

    created() {
      this.userInfo = getUserInfoCache(true);
      this.id = this.$route.params['id'];
      this.initData();
    }

    async initData() {
      if (isInWechat) {
        await initWechat();
        setShareInfo('造就题先生',
          '星球登陆战，答题赢大奖，等你来战！',
          '',
          `${host.self}/wv/pop_quiz?uid=${this.userInfo.uid}`);
      }
      switch (this.id) {
        case 'card':
          setTitle('我的复活卡');
          await this.getChance();
          break;
        case 'gift':
          setTitle('我的奖品');
          this.getPrizes();
          break;
        case 'answertip':
          setTitle('答案提示');
          break;
        default:
      }
    }

    async start() {
      await createTest();
      this.$router.push({path: '/wv/pop_quiz/question'});
    }

    async getChance() {
      try {
        let response = await getCardNum();
        this.chance = response.today_chance;
      } catch (e) {
        // todo 错误
      }
    }

    async getPrizes() {
      try {
        let response = await getPrizesNum();
        this.prizes = response;
      } catch (e) {
        // todo 错误
      }
    }

    shareGetCard() {
      //todo 分享更多
    }

    receivePrizes(item: any) {
      if (!item) {
        return;
      }
      switch (item.type) {
        case 1:
          this.$router.push({path: `/wv/pop_quiz/receive/member?${params({memberNo: item.detail.id})}`});
          break;
        case 2:
          break;
        case 3:
          this.$router.push({path: '/wv/pop_quiz/receive/info'});
          break;
      }
    }

  }
</script>
