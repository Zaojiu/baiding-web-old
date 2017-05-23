<script>// @flow
  import { Utils } from '../../../shared/utils/utils'
  import { POST_TALK_COMMENT } from '../../../store/talk'
  import form from '../../../shared/form'
  import beforeRouteEnter from '../../../shared/guard/before-route-enter'
  import userAuth from '../../../shared/guard/user-auth.guard'

  function square(n: number): number {
    return n * n;
  }
  square("2");

  export default {
    beforeRouteEnter (to, from, next) {
      const guards = beforeRouteEnter([userAuth(Utils.absUrl(to.fullPath))])
      guards(to, from, next)
    },
    directives: form,
    data () {
      const data = {
        id: this.$route.params.id,
        subject: decodeURIComponent(this.$route.query.title),
        replyId: '',
        replyNick: '',
        replyContent: '',
        isInApp: Utils.isInApp,
        isSubmitting: false,
        content: ''
      }
      const request = this.$route.query.request

      if (request) {
        const requestObj = JSON.parse(decodeURIComponent(request))
        data.replyId = requestObj.id
        data.replyNick = requestObj.nick
        data.replyContent = requestObj.content
      }

      return data
    },
    methods: {
      backToTalk () {
        this.$router.push({ path: `/talks/${this.id}` })
      },
      async submit () {
        this.$validator.validateAll()
        if (this.errors.count()) return

        this.isSubmitting = true
        await this.$store.dispatch(POST_TALK_COMMENT, { id: this.id, content: this.content, parentId: this.replyId })
        this.isSubmitting = false
        this.backToTalk()
      }
    }
  }
</script>

<template>
  <form name="postComment" class="post-comment" @submit.prevent="submit" v-focus-first-invalid>
    <header v-if="!isInApp"><i class="bi bi-close" @click="backToTalk()"></i></header>

    <section>
      <small>发表评论</small>
      {{subject}}
    </section>

    <div class="reply" v-if="replyId"><span class="nick">{{replyNick}}:</span>{{replyContent}}</div>

    <div class="main-form">
      <div class="form-group" v-bind:class="{'has-error': errors.has('content')}">
        <div class="input-group">
          <textarea
            id="content"
            class="content"
            name="content"
            rows="1"
            v-validate="'required'"
            v-autosize
            v-focus
            v-has-value
            v-model="content"
            data-vv-as="评论内容"
          ></textarea>
          <label class="required" for="content">评论内容</label>
        </div>
        <p class="helper error" v-show="errors.has('content')">{{ errors.first('content') }}</p>
      </div>
    </div>

    <div class="operation-area">
      <button class="btn" v-if="!isSubmitting">提交评论</button>
      <span class="btn disabled" v-if="isSubmitting">评论提交中...</span>
    </div>
  </form>
</template>

<style lang="scss">
  @import "../../../css/_variables";

  .post-comment {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    background-color: $color-w;
    display: flex;
    flex-direction: column;

    header {
      flex-shrink: 0;

      .bi-close {
        padding: 20px;
        font-size: 22px;
        color: $color-dark-gray;
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
      background-color: rgb(237, 237, 237);
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
