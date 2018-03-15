<template>
  <form name="postComment" class="post-comment" @submit.prevent="submit" v-focus-first-invalid>
    <header v-if="!isInApp"><i class="bi bi-close" @click="backToColumnItem()"></i>
      <div class="header_title"></div>
    </header>

    <section><small>发表评论</small>{{subject}}</section>

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
          ></textarea>
          <label class="required">评论内容</label>
        </div>
      </div>
    </div>
    <footer class="operation-area">
      <button :disabled="isSubmitting" class="btn">{{replyId ? '回复' : '发表'}}评论</button>
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
      background-color: #ededed;
      padding: 10px;
      margin-top: 20px;
      margin-left: 15px;
      margin-right: 15px;
      margin-bottom: 20px;
      white-space: pre-wrap;

      .nick {
        font-weight: bold;
        margin-right: 6px;
      }
    }

    .main-form {
      flex-grow: 1;
      overflow: auto;

      .form-group {

        .input-group {
          position: relative;
          padding-top: 14px;

          .content {
            border-bottom: none;
            overflow: hidden;
            word-wrap: break-word;
            height: 18px;
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            border-bottom: 1px solid #dadada;
            background: transparent;
            color: #4b4b4b;
            font-size: 16px;
            box-sizing: content-box;
            padding: 7px 0;
            border-radius: 0;
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
  import {postComment} from '../../shared/api/column.api';

  @Component({
    directives: form
  })
  export default class PostCommentComponent extends Vue {
    id = '';
    columnId = '';
    subject = '';
    replyId = '';
    replyNick = '';
    replyContent = '';
    isInApp = isInApp;
    isSubmitting = false;
    content = '';
    errors: ErrorBag;

    created() {
      this.id = this.$route.params['itemId'];
      this.columnId = this.$route.params['id'];
      this.subject = decodeURIComponent(this.$route.query['title']);

      const request = this.$route.query['request'];

      if (request) {
        const requestObj = JSON.parse(decodeURIComponent(request));
        this.replyId = requestObj.id;
        this.replyNick = requestObj.nick;
        this.replyContent = requestObj.content;
      }
    }

    backToColumnItem () {
      this.$router.push({path: `/columns/${this.columnId}/items/${this.id}`});
    }

    async submit () {
      this.$validator.validateAll();
      if (this.errors.count()) return;

      this.isSubmitting = true;

      try {
        await postComment(this.id, this.content, this.replyId);
      } finally {
        this.isSubmitting = false;
      }

      await showTips('评论成功');
      this.backToColumnItem();
    }
  };
</script>
