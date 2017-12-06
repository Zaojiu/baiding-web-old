<template>
  <form name="postComment" class="post-comment" @submit.prevent="submit" v-focus-first-invalid>
    <header v-if="!isInApp"><i class="bi bi-close" @click="backToTalk()"></i>
      <div class="header_title"></div>
      <button class="header_reply" :disabled="isSubmitting">{{replyId ? '回复' : '发表'}}</button>
    </header>

    <div class="reply" v-if="replyId">
      <div class="nick">回复{{replyNick}}</div>
      <div class="reply-content">{{replyContent}}</div>
    </div>

    <div class="main-form">
      <div class="form-group">
        <div class="input-group">
          <textarea
            class="content"
            name="content"
            rows="1"
            v-validate="'required'"
            v-autosize
            v-focus
            v-has-value
            v-model="content"
            :placeholder="replyId ? '回复你此刻的想法' : '关于这篇文章你有什么想法？'"
          ></textarea>
        </div>
      </div>
    </div>

    <footer>
      <button @click="submit()">提交</button>
    </footer>

  </form>
</template>

<style lang="scss" scoped>
  .post-comment {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    z-index: $z-index-page-lv2;
    background-color: $color-w;
    display: flex;
    flex-direction: column;

    header {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      text-align: center;

      .bi-close {
        padding: 20px;
        font-size: 22px;
        color: $color-dark-gray;
      }

      .header_title {
        flex-grow: 1;
        font-size: 20px;
        color: $color-gray;
      }

      .header_reply {
        padding: 15px;
        font-size: 17px;
        color: $color-brand;
      }

    }

    section {
      padding-left: 15px;
      padding-right: 15px;
      color: $color-dark-gray;
      font-size: 14px;
      line-height: 1em;
      flex-shrink: 0;

      &:first-child {
        padding-top: 20px;
      }

      small {
        display: block;
        color: $color-gray;
        font-size: 12px;
        line-height: 1em;
        margin-bottom: 10px;
      }
    }

    .reply {
      flex-shrink: 0;
      font-size: 14px;
      color: rgb(144, 144, 144);
      background-color: rgb(237, 237, 237);
      padding: 20px 15px;
      margin-bottom: 15px;

      .nick {
        margin-right: 6px;
      }

      .reply-content {
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }

    .main-form {
      flex-grow: 1;
      overflow: auto;

      .form-group {
        margin-top: 0;

        .input-group {
          padding-top: 0;

          .content {
            padding: 0;
            border-bottom: none;
          }
        }
      }
    }

    .operation-area {
      flex-shrink: 0;

      .btn {
        display: block;
        width: 100%;
        text-align: center;
        height: 49px;
        line-height: 49px;
        font-size: 17px;
        color: $color-w;
        background-color: $color-brand;

        &.disabled {
          background-color: change_color($color-brand, $alpha: .5);
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {isInApp} from '../../shared/utils/utils';
  import {form} from '../../shared/form';
  import {showTips} from '../../store/tip';
  import {ErrorBag} from "vee-validate";
  import {postTalkComment} from '../../shared/api/talk.api';

  @Component({
    directives: form
  })
  export default class PostCommentComponent extends Vue {
    id = '';
    subject = '';
    replyId = '';
    replyNick = '';
    replyContent = '';
    isInApp = isInApp;
    isSubmitting = false;
    content = '';
    errors: ErrorBag;

    created() {
      this.id = this.$route.params['id'];
      this.subject = decodeURIComponent(this.$route.query['title']);

      const request = this.$route.query['request'];

      if (request) {
        const requestObj = JSON.parse(decodeURIComponent(request));
        this.replyId = requestObj.id;
        this.replyNick = requestObj.nick;
        this.replyContent = requestObj.content;
      }
    }

    backToTalk () {
      this.$router.push({path: `/talks/${this.id}`});
    }

    async submit () {
      this.$validator.validateAll();
      if (this.errors.count()) return;

      this.isSubmitting = true;

      try {
        await postTalkComment(this.id, this.content, this.replyId);
      } finally {
        this.isSubmitting = false;
      }

      await showTips('评论成功');
      this.backToTalk();
    }
  };
</script>
