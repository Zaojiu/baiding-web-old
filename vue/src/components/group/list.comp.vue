<template>
  <div class="container">

    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isNotFound">网络错误</error>
    <error class="abs-center" v-else-if="isNotPaid">购买课程，加入圈子</error>

    <div class="group" v-else>
      <div class="scroll" v-bind:style=" isPosting ? disscroll : doscroll ">
        <top-nav></top-nav>
        <div class="item" v-for="item in groupData" @click="toCommentPage(item.id)">
          <div class="top">
            <img class="avatar avatar-round avatar-45 top-avatar"
                 v-bind:src=" item.userInfo?  item.userInfo.avatar : defaultAvatar " alt="头像"/>
            <div class="top-right">
              <p class="nick">{{ (item.userInfo&&item.userInfo.nick)?item.userInfo.nick:'匿名用户' }}</p>
              <p class="created-at">{{ showMoment(item.createdAt) }}</p>
            </div>
          </div>
          <p class="content">{{ item.content }}</p>
        </div>
      </div>
      <div class="new-content" @click="toPostMsg()">发布内容</div>
    </div>

    <div class="pop-bg" v-if="isPosting"></div>
    <div class="container-post" v-show="isPosting">
      <div class="top">
        <i class="btn-x bi bi-close-b" @click="closePage()"></i>
        <span class="btn-post" @click="postMsg()">发布</span>
      </div>
      <p class="title">发布内容</p>
      <div class="bottom">
        <textarea class="textarea" autofocus v-model="content">{{ content }}</textarea>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import {host} from '../../env/environment';
  import Vue from 'vue';
  import moment from 'moment';
  import {Component} from 'vue-property-decorator';
  import {joinGroup} from '../../shared/api/course.api';
  import {getCourse, getGroup, listMessages, postTextMessage} from '../../shared/api/group.api';
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {UserInfoModel} from '../../shared/api/user.model';
  import {showTips} from '../../store/tip';

  @Component
  export default class GroupComponent extends Vue {
    id = 0;
    groupId = '';
    courseId = '';
    size = 100;
    createdAt = '';
    userInfo: UserInfoModel | null = null;
    isLoading = false;
    isError = false;
    isIntroCollape = true;
    isPaying = false;
    isNotFound = false;
    isNotPaid = true;

    doscroll = 'overflow: scroll';
    disscroll = 'overflow: hidden';
    defaultAvatar = '/assets/img/zaojiu-logo.jpg';

    isPosting = false;
    content = '';
    groupData = [];
    userData = {};


    created() {
      this.groupId = this.$route.params.groupId;
      this.courseId = this.$route.query.courseId;
      this.initData();
    }

    async initData() {
      try {
        this.isLoading = true;
        let course = await getCourse(this.courseId);
        if (course.current_user_info && course.current_user_info.isPaid) {
          //判断是否购买
          this.isNotPaid = false;

          let group = await getGroup(this.groupId);
          if (group.currentGroupUser) {
            //判断是否加入圈子

            try {
              let res = await listMessages(this.groupId, this.size, this.createdAt);
              this.groupData = res;
            } catch (e) {
              this.isNotFound = true;
              throw e;
            }

          } else {
            await joinGroup(this.groupId);
            try {
              let res = await listMessages(this.groupId, this.size, this.createdAt);
              this.groupData = res;
            } catch (e) {
              this.isNotFound = true;
              throw e;
            }
          }

        } else {
          this.isNotPaid = true;
        }

      } catch (e) {
        this.isNotFound = true;
        throw e;
      } finally {
        this.isLoading = false;
      }

    }

    async postMsg() {
      if (this.content) {
        this.closePage();
        await postTextMessage(this.groupId, this.content);
        await this.initData();
        this.content = '';
        return;
      } else {
        showTips('内容不能为空！');
        return;
      }
    }

    closePage() {
      this.isPosting = false;
    }


    showMoment(m: any) {
      return moment.unix(m.substring(0, 10)).format('YYYY-MM-DD HH:mm:ss');
    }

    toPostMsg() {
      this.isPosting = true;
    }

    toCommentPage (msgId: string) {
      location.href = `${ host.self }/group/${ this.groupId }/${ msgId }?courseId=${ this.courseId }`;
    }
  }

</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: relative;

    .group {
      height: 100%;
      width: 100%;

      .scroll {
        background-color: rgb(242, 242, 242);
        height: calc(100% - 50px);

        .item {
          background-color: white;
          margin-bottom: 8px;

          .top {
            color: #000;
            margin-left: 20px;
            padding-top: 16px;

            .top-avatar {
              height: 40px;
              width: 40px;
            }

            .top-right {
              display: inline-block;
              margin-left: 12px;
              vertical-align: top;

              .nick {
                font-weight: bold;
                display: block;
                margin-top: 5px;
                font-size: 15px;
                line-height: 15px;
              }

              .created-at {
                display: block;
                margin-top: 6px;
                font-size: 10px;
                line-height: 10px;
              }
            }
          }

          .content {
            color: #000;
            margin: 8px 20px 12px 20px;
            padding-bottom: 16px;
            font-size: 15px;
            line-height: 23px;
          }
        }
      }

      .new-content {
        height: 50px;
        color: white;
        font-size: 18px;
        line-height: 50px;
        text-align: center;
        width: 100%;
        background-color: rgb(0, 211, 193);
      }
    }
  }

  .pop-bg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9;
  }

  .container-post {
    position: absolute;
    z-index: 10;
    top: 120px;
    left: 20px;
    right: 20px;
    bottom: 120px;
    background-color: white;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn-x {
        height: 12px;
        width: 12px;
        margin-left: 20px;
      }
      .btn-post {
        color: rgb(0, 211, 193);
        font-size: 17px;
        line-height: 24px;
        margin: 12px 20px;
      }
    }

    .title {
      padding: 0 0 20px 20px;
      font-size: 28px;
      line-height: 28px;
      color: black;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      font-weight: bold;
    }

    .bottom {
      position: absolute;
      top: 92px;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 16px;

      .textarea {
        display: block;
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        resize: none;
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

</style>