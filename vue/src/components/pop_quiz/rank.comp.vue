<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else>
      <article>
        <img src="https://baiding-pub.zaojiu.com/question_prize/bg.png"/>
        <div class="content">
          <div class="rank-list">
            <div class="rank-head">
              <span>世界排名</span>
            </div>
            <ul>
              <li v-for="(item,index) in rankList">
                <span class="user">
                  <span class="num">{{index+1}}</span>
                  <span class="img"><img :src="item.avatar"/></span>
                  <span class="nick">{{item.nick}}</span>
                </span>
                <span class="dot">{{item.score}}</span>
              </li>
            </ul>
          </div>
          <div class="footer" @click="again">再来一局</div>
        </div>
      </article>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: absolute;
    z-index: 2;
    width: 100%;
    top: 0;
    background-color: rgb(22, 27, 60);
    height: 100vh;

    img {
      width: 100%;
    }

    .content {
      position: absolute;
      width: 100%;
      bottom: 0;

      .rank-list {
        height: 70vh;
        width: calc(100% - 60px);
        margin: auto;
        border: 1px solid rgba(255, 255, 255, .3);
        background-color: rgba(0, 0, 0, .8);

        .rank-head {
          padding: 5px 0;
          border-bottom: 2px solid rgba(255, 255, 255, .2);
          text-align: center;
          > span {
            color: rgb(255, 255, 255);
            width: 50%;
            display: inline-block;
            text-align: center;
            line-height: 32px;
            /*&:nth-child(1) {
              border-right: 2px solid rgba(255, 255, 255, .2);
            }*/

          }
        }

        ul {
          li {
            color: #fff;
            height: 8vh;
            &:nth-child(2n) {
              background-color: rgba(255, 255, 255, .1);
            }

            &:nth-child(1) {
              .num {
                color: rgb(250, 126, 0);
              }
            }
            &:nth-child(2) {
              .num {
                color: rgb(253, 191, 30);
              }
            }
            &:nth-child(3) {
              .num {
                color: rgb(251, 212, 19);
              }
            }

            display: flex;
            align-items: center;
            justify-content: space-between;
            .user {
              > span {
                display: inline-block;
                vertical-align: middle;
                font-size: 14px;
              }
              .num {
                padding: 0 15px;
                font-size: 18px;
                font-weight: bold;
              }
              .img {
                width: 40px;
                height: 40px;
                margin-right: 8px;
              }
            }

            .dot {
              padding-right: 20px;
              font-size: 20px;
              font-weight: bold;
            }

          }
        }

      }

      .footer {
        text-align: center;
        color: #fff;
        padding: 38px 0 45px 0;
      }

    }

  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {setTitle} from '../../shared/utils/title';
  import {getWordRank} from '../../shared/api/pop_quiz.api'
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model'
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';
  import {isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";

  @Component({})
  export default class Index extends Vue {
    isLoading = false;
    isError = false;
    userInfo: UserInfoModel;
    rankList = [];
    lifeCardImg = 'assets/img/qa-life-card.png';
    giftImg = 'assets/img/qa-gift.png';
    startImg = 'assets/img/qa-start.png';

    created() {
      this.userInfo = getUserInfoCache(true);
      this.initData();
    }


    async initData() {
      setTitle('排行榜');

      if (isInWechat) {
        await initWechat();
        setShareInfo('造就题先生',
          '星球登陆战，答题赢大奖，等你来战！',
          '',
          `${host.self}/wv/pop_quiz?uid=${this.userInfo.uid}`);
      }

      try {
        this.rankList = await getWordRank();
      } catch (e) {
        // todo 报错
      }
    }

    again(){
      this.$router.push({path: '/wv/pop_quiz'});
    }

  }
</script>

