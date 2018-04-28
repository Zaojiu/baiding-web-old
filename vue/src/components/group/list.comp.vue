<template>
  <div class="container">

    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isNotFound">网络错误</error>
    <error class="abs-center" v-else-if="isNotPaid">购买课程，加入圈子</error>

    <div class="group" v-else>
      <div class="scroll" :style=" isPosting ? disscroll : doscroll ">
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
          <div class="img-cover" v-if="item.type === 'image'">
            <img :src="item.images[0]?item.images[0].link:''"/>
          </div>
        </div>
      </div>
      <div class="new-content" @click="showPublishChoose()">发布内容</div>
    </div>

    <div class="pop-bg" v-if="isPosting"></div>
    <aside class="choose-type" v-show="isPosting">
      <div class="type-title">选择内容类型</div>
      <div class="type-item" @click="toPublish('text')">文字</div>
      <div class="type-item" @click="toPublish('image')">图片</div>
      <div class="type-cancel" @click="hidePublishChoose">取消</div>
    </aside>
  </div>
</template>

<script lang="ts">
  import {host} from '../../env/environment';
  import Vue from 'vue';
  import moment from 'moment';
  import {Component} from 'vue-property-decorator';
  import {joinGroup} from '../../shared/api/course.api';
  import {getCourse, getGroup, listMessages} from '../../shared/api/group.api';
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {UserInfoModel} from '../../shared/api/user.model';

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
      this.groupId = this.$route.params['groupId'];
      this.courseId = this.$route.query['courseId'];
      this.initData();
    }

    async initData() {
      try {
        this.isLoading = true;
        let course = await getCourse(this.courseId);

        //判断是否购买
        if (course.current_user_info && course.current_user_info.isPaid) {
          this.isNotPaid = false;
          let group = await getGroup(this.groupId);

          //判断是否加入圈子
          if (!group.currentGroupUser) {
            await joinGroup(this.groupId);
          }
          let res = await listMessages(this.groupId, this.size, this.createdAt);
          this.groupData = res;
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


    showMoment(m: any) {
      return moment.unix(m.substring(0, 10)).format('YYYY-MM-DD HH:mm:ss');
    }

    showPublishChoose() {
      this.isPosting = true;
    }

    hidePublishChoose() {
      this.isPosting = false;
    }

    toCommentPage(msgId: string) {
      this.$router.push({path: `${msgId}`, query: {courseId: this.courseId}});
    }

    toPublish(type: string) {
      this.$router.push({path: 'publish', query: {type: type}});
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
          padding-bottom: 12px;

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
            font-size: 15px;
            line-height: 23px;
          }

          .img-cover {
            padding: 0 20px;

            img {
              width: 100%;
            }
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

  .choose-type {
    position: absolute;
    z-index: 10;
    width: 90%;
    bottom: 10px;
    left: 5%;

    div {
      background-color: #fff;
      text-align: center;
      font-size: 18px;
      line-height: 18px;
      padding: 15px 0;
      color: #1067ec;
    }

    .type-title {
      font-size: 14px;
      line-height: 14px;
      padding: 19px 0;
      color: #8d8d8d;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .type-item {
      &:nth-child(3) {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }

    .type-cancel {
      margin-top: 10px;
      font-weight: bold;
      border-radius: 8px;
    }
  }

</style>
