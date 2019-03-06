<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else>
      <article>
        <img class="bg" src="https://baiding-pub.zaojiu.com/question_prize/home.gif"/>
        <header>
          <div class="life-card" @click="goToMy('card')"><img :src="lifeCardImg"/><span>复活卡×{{chance}}</span></div>
          <div class="life-gift" @click="goToMy('gift')"><img :src="giftImg"/><span>奖品</span></div>
        </header>
        <div class="header">
          <h1>造就题先生</h1>
          <h4>星球登陆战 获得星际能量</h4>
        </div>
        <div class="footer">
          <button class="start" @click="start"><img :src="startImg"/>开始答题</button>
          <div class="ranking"><span class="rank" @click="goToRank">查看排行榜</span><span @click="goToAnswerTip">答题提示</span>
          </div>
        </div>
      </article>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>

  .container {
    background-color: rgb(22, 27, 60);
    height: 100vh;

    .bg {
      width: 100%;
      margin-top: 176px;
    }

    header {
      position: absolute;
      width: 100%;
      top: 21px;
      div {
        display: inline-block;
        color: #fff;
        vertical-align: middle;
        border-radius: 15px;
        padding: 5px 10px;
        background-color: rgba(255, 255, 255, .1);
      }
      .life-card {
        margin-left: 21px;
      }
      .life-gift {
        margin-left: 12px;
        img {
          width: 30px;
        }
      }
      img {
        height: 20px;
        width: 20px;
        margin-right: 7px;
        vertical-align: middle;
      }
    }
    .header {
      position: absolute;
      top: 96px;
      text-align: center;
      width: 100%;
      color: rgb(253, 241, 126);
      h1 {
        font-size: 56px;
        letter-spacing: 2px;
        line-height: 56px;
        font-family: My-Font, STHUPO, SimHei, sans-serif;
        font-weight: 100;
        margin-bottom: 10px;
      }
      h4 {
        font-size: 20px;
        letter-spacing: 6px;
        line-height: 25px;
        font-family: My-Font, STHUPO, SimHei, sans-serif;
        font-weight: 100;
      }
    }
    .footer {
      position: absolute;
      bottom: 25px;
      width: 100%;
      text-align: center;
      .start {
        height: 50px;
        width: 250px;
        border-radius: 25px;
        background: rgb(255, 255, 255);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        font-size: 18px;
        color: rgb(22, 27, 62);

        img {
          height: 20px;
          width: 20px;
          vertical-align: sub;
          margin-right: 12px;
        }
      }
      .ranking {
        font-size: 14px;
        line-height: 16px;
        color: #fff;
        margin-top: 30px;
        .rank {
          display: inline-block;
          padding: 0 12px 0 0;
          border-right: 1px solid #fff;
        }
        span {
          &:nth-child(2) {
            padding-left: 12px;
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
  import {createTest, getCardNum, openShare} from '../../shared/api/pop_quiz.api'
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model'
  import {showTips} from '../../store/tip';
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';
  import {isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";

  @Component({})
  export default class Index extends Vue {
    isLoading = false;
    isError = false;
    userInfo: UserInfoModel;
    chance = 0;
    shareUid = '';
    lifeCardImg = 'https://baiding-pub.zaojiu.com/question_prize/qa-life-card.png';
    giftImg = 'https://baiding-pub.zaojiu.com/question_prize/qa-gift.png';
    startImg = 'https://baiding-pub.zaojiu.com/question_prize/qa-start.png';

    @Watch('$route.name')
    setNavIndex() {
      if (this.$route.name === 'pop_quiz.main') {
        this.userInfo = getUserInfoCache(true);
        this.initData();
      }
    }

    created() {
      this.userInfo = getUserInfoCache(true);
      this.shareUid = decodeURIComponent(this.$route.query['uid']);
      if (this.shareUid) {
        if (!isNaN(Number(this.shareUid)))
          openShare(Number(this.shareUid));
      }
      this.initData();
    }

    async start() {
      if (this.chance === 0) {
        showTips('您今天答题机会已经用完');
        return;
      }
      try {
        await createTest();
        this.$router.push({path: '/wv/pop_quiz/question'});
      } catch (e) {
        showTips('网络错误');
      }
    }

    async initData() {
      setTitle('');
      if (isInWechat) {
        await initWechat();
        setShareInfo('造就题先生',
          '星球登陆战，答题赢大奖，等你来战！',
          '',
          `${host.self}${this.$route.fullPath}?uid=${this.userInfo.uid}`);
      }
      try {
        let response = await getCardNum();
        this.chance = response.today_chance;
      } catch (e) {
        showTips('网络错误');
      }
    }

    goToMy(type: string) {
      this.$router.push({path: `/wv/pop_quiz/my/${type}`});
    }

    async goToAppStore() {
    }

    goToRank() {
      this.$router.push({path: '/wv/pop_quiz/rank'});
    }

    goToAnswerTip() {
      window.location.href = 'https://assets.zaojiu.com/question/index.html';
    }

  }
</script>

