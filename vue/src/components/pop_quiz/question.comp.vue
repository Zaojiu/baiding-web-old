<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="question-main" v-else>
      <article class="question" v-if="!isOver">
        <div class="header">
          <div class="header-left">
            <div class="logo"><img :src="userInfo.avatar"/></div>
          </div>
          <div class="middle">
            <div class="round">
              <span v-if="time>0">{{time}}</span>
              <span v-if="time<=0" style="font-size: 20px">超时</span>
            </div>
          </div>
          <div class="header-right">{{Score}}</div>
        </div>
        <p class="content">{{question}}</p>
        <div class="choose">
          <span v-for="item in answerOptions">
            <button v-if="item.status===0||item.status === 1" @click="chooseAnswer(item)">{{item.title}}</button>
            <button v-if="item.status===2" class="error" @click="chooseAnswer(item)">{{item.title}}</button>
            <button v-if="item.status===3" class="success" @click="chooseAnswer(item)">{{item.title}}</button>
          </span>
        </div>
      </article>
      <article class="answer" v-else>
        <header class="answer-header">
          <div class="avatar">
            <div class="logo"><img :src="userInfo.avatar"/></div>
            {{userInfo.nick}}
          </div>
          <img v-if="Score<=100" src="https://og9s6vxbs.qnssl.com/question_prize/bg.png"/>
          <img src="https://og9s6vxbs.qnssl.com/question_prize/bg-s.png" v-else/>
        </header>
        <div class="middle">
          <h3><span class="num">{{Score}}</span>分</h3>
          <p v-if="Score>=100">已占领造就知识星球</p>
          <p v-else>造就知识星球等你探索</p>
        </div>
        <footer class="answer-footer">
          <button class="btn-all" @click="lifeCardAgain">{{answerBtnText}}</button>
          <button class="btn-half" @click="book">订阅抽奖通知</button>
          <div class="ranking"><span class="rank" @click="goToRank">查看排行榜</span><span @click="goToAnswerTip">答题提示</span>
          </div>
        </footer>
        <div v-if="giftAsideOpen" class="gift-aside">
          <div class="close" @click="giftAsideOpen = false"><i class="bi bi-qa-cancle"></i></div>
          <div v-if="!showGift" class="box">
            <div class="box-img">
              <img src="https://og9s6vxbs.qnssl.com/question_prize/qa-gift-text.png"/>
            </div>
            <button @click="showGiftFun">领取星际能量</button>
          </div>
          <div class="box gift-detail" v-else>
            <div class="gift-img">
              <img v-if="prizes[0]" :src="prizes[0].detail.cover||''"/>
            </div>
            <button @click="receiveGiftFun">立即领取</button>
          </div>
        </div>
      </article>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: absolute;
    z-index: 1;
    width: 100%;
    top: 0;
    background-color: rgb(22, 27, 60);
    height: 100vh;

    .question-main {
      .question {
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18px;
          div {
            display: inline-block;
          }
          .header-left {
            width: 30%;
            height: 50px;
            background-color: rgb(218, 91, 106);
            border-bottom-right-radius: 25px;
            border-top-right-radius: 25px;
            position: relative;
            .logo {
              position: absolute;
              background-color: #fff;
              width: 42px;
              height: 42px;
              border-radius: 21px;
              top: 4px;
              right: 4px;

              img {
                width: 100%;
              }
            }
          }
          .header-right {
            font-size: 28px;
            font-weight: bold;
            color: #fff;
            width: 30%;
            height: 50px;
            background-color: rgb(218, 91, 106);
            border-bottom-left-radius: 25px;
            border-top-left-radius: 25px;
            text-align: center;
            line-height: 50px;
          }
          .middle {
            width: 76px;
            border-radius: 38px;
            height: 76px;
            text-align: center;
            line-height: 76px;
            background-color: rgb(218, 91, 106);
            color: rgb(218, 91, 106);
            font-weight: bold;

            .round {
              margin: 10px auto 0 auto;
              width: 56px;
              height: 56px;
              border-radius: 28px;
              background-color: rgb(22, 27, 60);
              line-height: 56px;
              font-size: 30px;
            }
          }
        }
        .content {
          color: #fff;
          font-size: 20px;
          line-height: 30px;
          padding: 0 20px;
          text-align: center;
          margin-top: 36px;
          font-weight: bold;
        }
        .choose {
          padding: 0 38px;
          position: absolute;
          width: 100%;
          bottom: 36px;
          button {
            width: 100%;
            background-color: rgba(255, 255, 255, .9);
            height: 56px;
            border-radius: 28px;
            font-size: 18px;
            line-height: 18px;
            color: rgb(33, 33, 33);
            font-weight: bold;
            margin-top: 36px;
          }
          .error {
            background-color: rgba(224, 94, 109, .95);
            color: #fff;
          }
          .success {
            background-color: rgba(74, 206, 181, .95);
            color: #fff;
          }
        }
      }
      .answer {
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100vh;
        background-color: rgb(22, 27, 60);

        .answer-header {
          max-height: 600px;
          position: relative;

          .avatar {
            min-width: 100px;
            position: absolute;
            top: 23%;
            left: 58%;
            color: #fff;
            transform: rotate(38deg);

            .logo {
              background-color: #fff;
              width: 26px;
              height: 26px;
              border-radius: 13px;
              display: inline-block;
              vertical-align: middle;
              margin-right: 5px;
            }
          }

          img {
            width: 100%;
          }
        }

        .middle {
          text-align: center;
          color: rgb(253, 241, 126);
          h3 {
            font-size: 30px;
            margin: 0;
            padding: 0;
            line-height: 35px;
            font-family: My-Font, STHUPO, SimHei, sans-serif;

            .num {
              font-size: 56px;
            }
          }
          p {
            font-family: My-Font, STHUPO, SimHei, sans-serif;
            font-size: 24px;
            letter-spacing: 3px;
            margin-top: 8px;
          }
        }

        .answer-footer {
          position: absolute;
          bottom: 0;
          width: 100%;
          text-align: center;

          button {
            height: 50px;
            width: 250px;
            border-radius: 25px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            font-size: 18px;
          }

          .btn-all {
            background-color: rgb(253, 241, 126);
            color: rgb(22, 27, 62);
          }

          .btn-half {
            background-color: rgba(0, 0, 0, 0);
            color: rgb(253, 241, 126);
            border: 1px solid rgb(253, 241, 126);
            margin-top: 28px;
          }

          .ranking {
            margin-bottom: 28px;
            font-size: 14px;
            line-height: 16px;
            color: #fff;
            margin-top: 28px;
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

        .gift-aside {
          position: absolute;
          z-index: 4;
          width: 100%;
          background-color: rgba(22, 27, 60, 0.9);
          height: 100vh;
          top: 0;

          .close {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 24px;
            border-radius: 10px;
            padding: 1px;
            font-size: 26px;
            color: rgba(228, 230, 232, 0.5);
          }

          .box {
            text-align: center;
            position: absolute;
            width: calc(100vw - 40px);
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            .box-img {
              min-height: 180px;
              img {
                width: 100%;
              }
            }

            button {
              margin-top: 58px;
              width: 260px;
              height: 50px;
              border-radius: 25px;
              background-color: rgb(230, 203, 28);
              box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
              font-size: 18px;
              color: rgb(33, 33, 33);
            }
          }

          .gift-detail {
            text-align: center;
            .gift-img {
              width: calc(100vw - 200px);
              margin: auto;
              min-height: 265px;
              img {
                width: 100%;
              }
            }
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
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model'
  import {getCreateTestData, postTest, deleteTestData} from '../../shared/api/pop_quiz.api';
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';
  import {isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";

  @Component({})
  export default class Index extends Vue {
    isLoading = false;
    isError = false;
    question = '';
    answerOptions = [];
    id = '';
    Score = 0;
    userInfo: UserInfoModel;
    questionNumber = 1;
    time = 10;
    isOver = false;
    answerBtnText = '使用复活卡再来一局';
    lastAnswerData: any;
    isNeedSetTimeout = true;
    prizes = [];
    giftAsideOpen = false;
    showGift = false;

    created() {
      setTitle('第1题');
      this.isLoading = true;
      this.userInfo = getUserInfoCache(true);
      let testData = getCreateTestData();
      if (!testData) {
        this.$router.push({path: '/wv/pop_quiz'});
        return;
      } else {
        deleteTestData();
      }
      this.id = testData.id;
      this.question = testData.nextQuestion.subject;
      this.answerOptions = this.addOptionsType(testData.nextQuestion.options);
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
      this.isLoading = false;
      this.setTime();
    }

    addOptionsType(options: any): any {
      return options.map((item: any, index: number) => {
        return {
          title: item,
          status: 0,
          index: index + 1
        }
      })
    }

    //status 0 未作答，1作答，2错误，3正确
    changeOptionStatus(status: number, answer: number) {
      let newOptions: any = [];
      this.answerOptions.forEach((item: any) => {
        if (item.index === answer) {
          newOptions.push({
            title: item.title,
            status: status,
            index: item.index
          })
        } else {
          newOptions.push({
            title: item.title,
            status: 1,
            index: item.index
          });
        }
      });
      this.answerOptions = newOptions;
    }

    setTime() {
      this.time = 10;
      if (this.isNeedSetTimeout) {
        this.timeout();
      }
    }

    timeout() {
      this.isNeedSetTimeout = false;
      setTimeout(() => {
        this.time -= 1;
        if (this.time > 0) {
          this.timeout();
        } else {
          this.isNeedSetTimeout = true;
        }
      }, 1000)
    }

    async chooseAnswer(chooseItem: any) {
      if (chooseItem.status !== 0) {
        return;
      }
      let answer = chooseItem.index;
      try {
        let answerData = await postTest(this.id, answer);
        this.lastAnswerData = answerData;

        if (answerData.expired) {
          // 服务器超时结束
          this.answerOver();
        }

        if (answerData.right) {
          this.Score = answerData.roundScore;

          // 修改 状态为正确
          this.changeOptionStatus(3, answer);
          if (!answerData.finished) {
            // 刷新题目和答案选项
            setTimeout(() => {
              this.questionNumber++;
              setTitle(`第${this.questionNumber}题`);
              this.setTime();
              this.answerOptions = this.addOptionsType(answerData.nextQuestion.options);
              this.question = answerData.nextQuestion.subject;
            }, 600);
          }

          if (answerData.finished) {
            // 结束
            this.answerOver();
          }

        } else {
          // 修改 状态为回答错误
          this.changeOptionStatus(2, answer);
          //结束
          setTimeout(() => {
            this.answerOver();
          });

        }

      } catch (e) {
        // todo 出错
      }
    }

    answerOver() {
      //提取礼物信息
      this.prizes = this.lastAnswerData.prizes;
      if (this.prizes && this.prizes.length > 0) {
        this.giftAsideOpen = true;
      }
      setTimeout(() => {
        setTitle('');
        if (this.lastAnswerData.chance === 0) {
          this.answerBtnText = '分享获得复活卡';
        }
        this.isOver = true;
      }, 600);
    }

    lifeCardAgain() {
      /*if (this.lastAnswerData.chance === 0) {
        return;
      }*/
      this.$router.push({path: '/wv/pop_quiz'});
    }

    book() {
      //todo 订阅抽奖通知
    }

    goToRank() {
      this.$router.push({path: '/wv/pop_quiz/rank'});
    }

    goToAnswerTip() {
      window.location.href = 'https://assets.zaojiu.com/question/index.html';
    }

    showGiftFun() {
      this.showGift = true;
    }

    receiveGiftFun() {
      this.$router.push({path: '/wv/pop_quiz/my/gift'});
    }

  }
</script>

