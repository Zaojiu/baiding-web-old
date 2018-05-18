<template>
  <article class="container">
    <transition name="slide-left">
      <div class="content" v-show="show">
        <div class="banner">
          <div class="bg"><img src="https://og9s6vxbs.qnssl.com/reservation/banner.jpg?t=1"/></div>
          <div class="text">
            <div class="text-content">
              <p>留下一个你想向嘉宾提的问题，前{{maxMeet}}名有机会在Talk环节后获得嘉宾的现场解答哦！</p>
            </div>
          </div>
        </div>
        <div class="guest-list">
          <section class="guest-item" v-for="item in bookGuests">
            <div class="avatar">
              <img :src="item.cover"/>
            </div>
            <div class="desc">
              <h3 class="name">{{item.name}}</h3>
              <p class="description">{{item.desc[0]}}</p>
            </div>
            <div class="action">
              <button @click="bookItem(item.id, item.name)">约问</button>
            </div>
          </section>
        </div>
      </div>
    </transition>
    <div class="aside" v-if="showSide && chooseId.length>0">
      <div class="aside-main">
        <h2 class="aside-title">
          你的问题
          <img @click="closeSide" class="close" src="https://og9s6vxbs.qnssl.com/wiee/close.png"/>
        </h2>
        <div class="aside-content">
          <form class="main-form" name="form" @submit.prevent="validateAndSubmit()" v-focus-first-invalid>
            <section class="form-section">

              <div class="form-group-new"
                   :class="{'has-error': errors.has('name')}">
                <div class="input-group">
                  <input
                    name="name"
                    v-model="name"
                    v-validate="{rules: {required: true}}"
                    v-has-value
                    placeholder="姓名"
                  >
                </div>
                <p class="helper error" v-if="errors.first('name:required')">请填写姓名</p>
              </div>

              <div class="form-group-new"
                   :class="{'has-error': errors.has('mobile')}">
                <div class="input-group">
                  <input
                    name="mobile"
                    v-model="mobile"
                    v-validate="{rules: {required: true}}"
                    v-has-value
                    placeholder="手机号"
                  >
                </div>
                <p class="helper error" v-if="errors.first('mobile:required')">请填写手机号</p>
              </div>

              <div class="form-group-new"
                   :class="{'has-error': errors.has('question')}">
                <div class="input-group">
                  <input
                    name="question"
                    v-model="question"
                    v-validate="{rules: {required: true}}"
                    v-has-value
                    placeholder="问题"
                  >
                </div>
                <p class="helper error" v-if="errors.first('question:required')">请填写问题</p>
              </div>
            </section>
          </form>
          <div class="btn">
            <button @click="validateAndSubmit" :disabled="isSubmitting">{{!isSubmitting ? '立即提问' : '提问中...'}}</button>
          </div>
        </div>
      </div>
    </div>
    <router-view :bookNo="bookNo"></router-view>
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

    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #000;
      transition: all 1s cubic-bezier(0, 0, .2, 1);

      .banner {
        position: relative;
        font-size: 0;
        padding-top: 73.56%;

        .bg {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;

          img {
            width: 100%;
          }
        }

        .text {
          font-size: 0;
          width: calc(100% - 40px);
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          padding-top: 24.03%;
          background: url("https://og9s6vxbs.qnssl.com/reservation/text-t.png") no-repeat;
          background-size: 100% 100%;

          .text-content {
            position: absolute;
            bottom:5px;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            p{
              padding: 0 13px;
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              line-height: 21px;
              letter-spacing: 1.4px;
              color: rgb(242, 242, 242);
            }
          }
        }
      }

      .guest-list {
        $avatarSize: 64px;
        $actionWidth: 69px;
        padding: 0 20px;
        .guest-item {
          display: flex;
          align-items: center;
          margin-top: 28px;
          font-size: 0;

          .avatar {
            height: $avatarSize;
            width: $avatarSize;
            border-radius: 32px;
            background-color: rgb(166, 166, 166);
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          .desc {
            margin-left: 8px;
            width: calc(100% - #{$actionWidth + $actionWidth});
            padding: 0 10px 0 8px;

            .name {
              color: rgb(244, 244, 244);
              font-size: 16px;
              line-height: 16px;
              margin-bottom: 4px;
            }
            .description {
              font-size: 12px;
              line-height: 17px;
              color: rgb(204, 204, 204);
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }

          .action {
            button {
              width: 69px;
              height: 30px;
              text-align: center;
              color: #fff;
              border-radius: 15px;
              font-size: 12px;
              background: url("https://og9s6vxbs.qnssl.com/reservation/btn-s.png") no-repeat;
              background-size: 100% 100%;
            }
          }
        }
      }

    }

    .form-group-new .input-group input:focus {
      border-bottom: 1px solid #00d3c1;
    }

    .aside {
      position: absolute;
      height: 100%;
      background-color: rgba(0, 0, 0, .6);
      width: 100%;
      top: 0;

      .aside-main {
        border: 1px solid rgb(38, 38, 38);
        position: absolute;
        overflow: hidden;
        width: 80%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #000;
        border-radius: 4px;

        .aside-title {
          width: 100%;
          position: relative;
          color: rgb(0, 211, 193);
          font-size: 20px;
          line-height: 20px;
          text-align: center;
          padding: 16px 0;

          .close {
            position: absolute;
            top: 0;
            right: 0;
            width: 28px;
            height: 28px;
          }
        }

        .aside-content {
          padding: 4px 20px 28px 20px;
          overflow-y: auto;

          .btn {
            button {
              margin: 65px 0 0 0;
              width: 100%;
              background-color: rgb(0, 211, 193);
              color: #fff;
              font-size: 18px;
              padding: 11px 0;
              border-radius: 4px;
              font-weight: bold;
            }
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
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {UserInfoModel} from '../../../shared/api/user.model'
  import {isInWechat} from "../../../shared/utils/utils";
  import {host} from "../../../env/environment";
  import {setShareInfo} from '../../../shared/utils/share';
  import {initWechat} from '../../../shared/utils/wechat';
  import {bookGuestsMockData, maxMeet, postQuestion} from './reservation.api';
  import {form} from '../../../shared/form/index';
  import {showTips} from "../../../store/tip";

  @Component({
    directives: form,
  })
  export default class ReservationComponent extends Vue {
    userInfo: UserInfoModel;
    show = false;
    bookGuests = bookGuestsMockData;
    showSide = true;
    name = '';
    mobile = '';
    question = '';
    chooseId = '';
    isSubmitting = false;
    bookNo = -1;
    chooseName = '';
    maxMeet = maxMeet;

    created() {
      this.share();
      this.init();
    }

    mounted() {
      setTimeout(() => {
        this.show = true;
      }, 10)
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        setShareInfo(
          '预约嘉宾',
          `和嘉宾面对面交流`,
          'https://og9s6vxbs.qnssl.com/wiee/wiee-share.jpg',
          `${host.self}${this.$route.fullPath}`
        );
      }
    }

    async init() {
      if (isInWechat) {
        getUserInfoCache(true);
      }
    }

    closeSide() {
      this.showSide = false;
      this.chooseId = '';
      this.name = '';
      this.mobile = '';
      this.question = '';
    }

    bookItem(id: string, name: string) {
      this.showSide = true;
      this.chooseId = id;
      this.chooseName = name;
    }

    validateAndSubmit() {
      this.$validator.validateScopes();

      if (this.$validator.errors.any()) return;

      this.submit();
    }

    async submit() {

      if (!this.chooseId) {
        showTips('未选择嘉宾...');
        return;
      }

      this.isSubmitting = true;
      showTips('提问中...');
      try {
        let res = await postQuestion(this.chooseName, this.name, this.mobile, this.question);
        this.bookNo = res.no;
        this.$router.push({path: `/wv/reservation/${this.chooseId}`});
        this.closeSide();
      } catch (e) {
        showTips('提问失败');
        throw e;
      } finally {
        this.isSubmitting = false;
      }
    }
  }
</script>
