<template>
  <div class="container" :style=" isPosting ? disscroll : doscroll ">
    <div class="scroll">
      <div class="top">
        <img class="btn-x" src="assets/icon/back.svg" @click="backToGroup()"/>
        <span class="btn-post" @click=""> </span>
      </div>
      <p class="title">评论详情</p>

      <div class="bottom">
        <div class="main">
          <div class="top">
            <img class="avatar avatar-round avatar-45 top-avatar"
                 :src=" (msgData.userInfo && msgData.userInfo.avatar) ?  msgData.userInfo.avatar : defaultAvatar "
                 alt="头像"/>
            <div class="top-right">
              <p class="nick">{{ msgData.userInfo?msgData.userInfo.nick:'' }}</p>
              <p class="created-at">{{ showMoment(msgData.createdAt) }}</p>
            </div>
          </div>
          <p class="content">{{ msgData.content }}</p>
        </div>
        <div class="comments" v-for="item in commentData">
          <div class="top">
            <img class="avatar avatar-round avatar-45 top-avatar" name=""
                 :src=" item.userInfo?  item.userInfo.avatar : defaultAvatar " alt="头像"/>
            <div class="top-right">
              <p class="nick">{{ item.userInfo.nick }}</p>
              <p class="created-at">{{ showMoment(item.createdAt) }}</p>
            </div>
          </div>
          <p class="content">{{ item.content }}</p>
        </div>
      </div>
    </div>


    <div class="buttons" @click="readyToPost()">发布评论</div>

    <div class="pop-bg" v-if="isPosting"></div>
    <div class="pop" v-show="isPosting">
      <div class="top">
        <img class="btn-x" src="assets/icon/close-b.svg" @click="closePost()"/>
        <span class="btn-post" @click="postComments()">发布</span>
      </div>
      <p class="title">发布评论</p>
      <div class="bottom">
        <textarea class="textarea" autofocus v-model="content">{{ content }}</textarea>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import moment from 'moment';
  import {Component} from 'vue-property-decorator';
  import {getMessageDedail, getComments, postComment} from '../../shared/api/group.api';
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {showTips} from '../../store/tip';

  @Component
  export default class CommentComponent extends Vue {
    courseId = '';
    groupId = '';
    msgId = '';
    uid = '';
    createdAt = '';
    msgData = {
      userInfo: {
        avatar: '',
        nick: '',
      },
      content: '',
      createdAt: ''
    };
    commentData = [];
    doscroll = 'overflow: scroll';
    disscroll = 'overflow: hidden';
    defaultAvatar = '/assets/img/zaojiu-logo.jpg';
    isPosting = false;
    content = '';

    created() {
      this.groupId = this.$route.params['groupId'];
      this.msgId = this.$route.params['msg'];
      this.courseId = this.$route.query['courseId'];
      this.initData();
    }

    async initData() {
      this.msgData = await getMessageDedail(this.groupId, this.msgId);
      this.commentData = await getComments(this.groupId, this.msgId, 100, this.createdAt);
    }

    readyToPost() {
      this.isPosting = true;
    }

    async postComments() {
      if (this.content) {
        this.closePost();
        await postComment(this.groupId, this.msgId, this.content);
        this.content = '';
        await this.initData();

        return;
      } else {
        showTips('内容不能为空！');
        return;
      }
    }

    closePost() {
      this.isPosting = false;
    }

    showMoment(m: any) {
      return moment.unix(m.substring(0, 10)).format('YYYY-MM-DD HH:mm:ss');
    }

    backToGroup() {
      this.$router.go(-1);
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    background-color: rgb(242, 242, 242);

    .scroll {
      overflow: auto;

      .top {
        height: 46px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;

        .btn-x {
          height: 12px;
          width: 12px;
          margin-left: 20px;
          transform: rotate(-45deg);
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
        margin-bottom: 4px;
        background-color: white;
      }

      .bottom {
        padding-bottom: 48px;

        .main {
          background-color: white;
          padding-top: 16px;
          margin-bottom: 8px;

          .top {
            display: block;
            color: #000;
            margin-left: 20px;

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
            margin: 8px 20px 8px 20px;
            padding-bottom: 8px;
            font-size: 15px;
            line-height: 23px;
          }
        }

        .comments {
          background-color: white;
          padding-top: 16px;

          .top {
            display: block;
            color: #000;
            margin-left: 20px;

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
            padding: 0 20px 8px 71px;
            font-size: 14px;
            line-height: 21px;
          }
        }
      }
    }

    .buttons {
      position: fixed;
      z-index: 8;
      bottom: 0;
      left: 0;
      right: 0;
      color: white;
      line-height: 47px;
      font-size: 18px;
      background-color: rgb(0, 211, 193);
      text-align: center;
    }

    .pop-bg {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 9;
    }

    .pop {
      position: fixed;
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
          transform: none;
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
  }
</style>
