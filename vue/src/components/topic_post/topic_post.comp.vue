<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="home-main" v-else v-show="!isChildActived()">
      <top-nav></top-nav>
      <app-download-tips
        class="app-download-tips"
        v-if="isAppDownloadTipsShow"
        @close="isAppDownloadTipsShow = false"
      >
      </app-download-tips>

      <div class="tab-content-container">
        <div class="tab-content-inner"
             :class="{'tab-one-active': tabIndex === 0, 'tab-two-active': tabIndex === 1}">
          <div class="tab-content">
            <div class="img-cover">
              <img class="long-img"
                   alt="封面图"
                   :src="coverUrl"
                   @error="coverUrl = defaultCoverUrl"/>
              />
            </div>

            <section class="talk-info" ref="content">
              <div class="categories" v-if="formatedCategories">{{formatedCategories}}</div>
              <h1>{{talkInfo.subject}}</h1>
              <time>{{talkInfo.publishAtParsed.format('YYYY年MM月DD日')}}</time>
            </section>
            <section class="article article-content" v-html="talkInfo.content" v-once></section>

            <section id="comments" class="comments">
              <h2>评论</h2>

              <div v-if="comments">
                <div class="comment" v-for="comment in comments" :key="comment.id">
                  <div class="header" v-once>
                    <div class="author-info" v-if="comment.user">
                      <img class="avatar avatar-round avatar-25" :src="comment.user.avatar" alt="用户头像">
                      <span class="nick">{{comment.user.nick}}</span>
                      <time>{{comment.createdAtParsed.format('MM月DD日 HH:mm')}}</time>
                    </div>
                    <span class="reply" @click="gotoComment(comment.id, comment.user.nick, comment.content)"> <i
                      class="bi bi-reply-comment"></i>回复</span>
                  </div>
                  <!-- 不要换行，避免出现换行符 -->
                  <div class="content" v-once>
                    <div class="quote" v-if="comment.parent"><span class="nick">{{comment.parent.user.nick}}:</span>{{comment.parent.content}}
                    </div>
                    {{comment.content}}
                  </div>
                </div>
              </div>

              <bd-loading class="comment-loading" v-if="isCommentLoading"></bd-loading>
              <error class="comment-error" v-else-if="isCommentError" @retry="fetchComments()"></error>
              <div class="no-comments" v-else-if="!comments.length"><i class="bi bi-no-comment"></i> 暂无评论</div>
              <div class="no-more-comments" v-else-if="isCommentOnLatest">到底咯~</div>
              <div class="more-comments" v-else @click="fetchComments()">加载更多评论</div>
            </section>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  .home-main {
    position: relative;
    overflow: hidden;

    .app-download-tips {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .img-cover {
      position: relative;
      font-size: 0;
      width: 100%;
      padding-top: 137.5%;

      .long-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
      }
    }

    .tab-content-container {
      overflow: hidden;

      .tab-content-inner {
        white-space: nowrap;
        transition: transform .3s;

        &.tab-one-active {
          transform: translateX(0);
        }

        &.tab-two-active {
          transform: translateX(-100%);
        }
      }
    }

    .talk-info {
      padding: 20px;

      .categories {
        margin-bottom: 15px;
        font-size: 14px;
        color: rgb(80, 227, 194);
        font-weight: 400;
      }

      h1 {
        font-size: 24px;
        font-weight: bold;
        line-height: 1.36em;
        color: $color-dark-gray2;
        margin-bottom: 8px;
        white-space: normal;
      }

      time {
        display: block;
        font-size: $font-size-12;
        color: $color-gray6;
        line-height: 1em;
      }
    }

    .article {
      margin: 0 20px 20px 20px;
    }

    .sub-content {
      background: rgb(245, 245, 250);
      max-width: 450px;
      margin: 0 auto 24px auto;
      .sub-content-cover {
        position: relative;
        font-size: 0;
        > .footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 8px 16px;
          font-size: 12px;
          line-height: 16px;
          color: rgb(242, 242, 242);
          background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .4));
          > .tags {
            float: left;
          }
          > .duration {
            float: right;
          }
        }
        > a {
          > img {
            width: 100%;
          }
        }

        .bi-play-fill {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          color: $color-w;
          pointer-events: none;
          background-color: rgba(0, 0, 0, 0.7);
          border: solid 2px $color-w;
          border-radius: 50%;
          height: 60px;
          width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0;

          &:before {
            font-size: 20px;
            transform: translateX(3px);
          }
        }

      }
      .sub-content-desc {
        padding: 12px 16px 24px 16px;

        .sub-content-title {
          font-size: 20px;
          line-height: 26px;
          font-weight: bold;
          white-space: normal;
        }

        .sub-content-author-title {
          margin-top: 8px;
          font-size: 16px;
          line-height: 16px;
          color: rgb(166, 166, 166);
          white-space: normal;
        }

      }
    }
    .article-content {
      p {
        margin: 0;
        margin-bottom: 24px;
      }
      figure {
        margin-bottom: 24px;
        .p1 {
          font-size: 14px;
          color: rgb(128, 128, 128);
          text-align: center;
          padding-top: 16px;
        }
      }
    }
    .comments {
      margin-top: 50px;
      padding: 0 15px;

      h2 {
        font-size: 18px;
        line-height: 1em;
        color: $color-dark-gray;
        font-weight: normal;
      }

      .comment {
        margin-top: 20px;

        .header {
          display: flex;
          align-items: center;
          overflow: hidden;
          margin-bottom: 6px;

          .author-info {
            flex-grow: 1;
            display: flex;
            align-items: center;
            overflow: hidden;

            .avatar {
              flex-shrink: 0;
              margin-right: 6px;
            }

            .nick {
              font-size: 14px;
              color: $color-dark-gray;
              line-height: 1em;
              font-weight: bold;
            }

            time {
              margin-left: 8px;
              flex-shrink: 0;
              font-size: 12px;
              color: rgb(144, 144, 144);
              line-height: 1em;
            }
          }

          .reply {
            line-height: 1em;
            padding: 5px;
            font-size: 12px;
            color: $color-gray;

            .bi-reply-comment {
              margin-right: 5px;
            }
          }
        }

        .content {
          margin-left: 31px;
          font-size: 14px;
          color: $color-dark-gray;
          line-height: 1.57em;
          white-space: pre-wrap;
          word-break: break-all;

          .quote {
            background-color: rgb(237, 237, 237);
            padding: 10px;
            margin-bottom: 6px;
            white-space: pre-wrap;
            word-break: break-all;

            .nick {
              font-weight: bold;
              margin-right: 6px;
            }
          }
        }
      }

      .no-comments, .more-comments, .comment-loading, .comment-error, .no-more-comments {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;

        .bi-no-comment {
          font-size: 16px;
          margin-right: 8px;
        }
      }

      .no-comments, .no-more-comments {
        color: $color-gray;
      }

      .no-comments {
        font-size: 16px;
      }

      .more-comments {
        color: $color-dark-gray;
        font-size: 14px;
      }
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {TalkInfoModel, TalkCommentModel, TalkEmphasisModel} from "../../shared/api/talk.model";
  import {setScrollPosition} from '../../shared/utils/utils';
  import {getTalkInfo, listTalkComments} from '../../shared/api/talk.api';
  import appDownloadTips from '../../shared/app-download-tips.comp.vue';
  import {setTitle} from '../../shared/utils/title';
  import {callHandler, initIOS} from "../../shared/utils/ios";
  import {isInApp} from '../../shared/utils/utils';

  const COMMENT_COUNT = 20;

  @Component({
    components: {
      appDownloadTips: appDownloadTips,
    }
  })
  export default class ContentComponent extends Vue {
    id = '';
    coverUrl = '';
    defaultCoverUrl = '/assets/img/default-cover.jpg';
    tabIndex = 0;
    talkInfo = new TalkInfoModel({});
    isLoading = false;
    isError = false;
    isAppDownloadTipsShow = false;
    contentDom: any;
    isContentChange = false;
    comments: TalkCommentModel[] = [];
    isCommentLoading = false;
    isCommentError = false;
    isCommentOnLatest = false;
    isInApp: boolean;

    created() {
      this.id = this.$route.params['id'];
      this.isInApp = isInApp;
      this.initData();
      this.fetchComments();
    }

    mounted() {
      if (this.isInApp) {
        window.addEventListener('scroll', this.handelScroll);
      } else {
        this.isAppDownloadTipsShow = true;
      }
      this.$nextTick(() => {
        this.contentDom = (this.$refs as any);
      })
    }

    @Watch('$route.name')
    refreshComments() {
      if (this.$route.name === 'topic_post.main') {
        this.comments = [];
        this.fetchComments();
        setScrollPosition('#comments');
        setTitle(this.talkInfo.subject);
      }
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;

      try {
        this.talkInfo = await getTalkInfo(this.id);
      } catch (e) {
        this.isError = true;
        throw e;
      } finally {
        this.isLoading = false;
      }
      this.coverUrl = `${this.talkInfo.coverUrl}~8-11`;
      let image = new Image();
      image.src = this.coverUrl;
      if (!this.isChildActived()) setTitle(this.talkInfo.subject);
    }

    async fetchComments() {
      this.isCommentLoading = true;
      this.isCommentError = false;

      try {
        const lastMarker = this.comments.length ? `$lt${this.comments[this.comments.length - 1].createdAt}` : '';
        const comments = await listTalkComments(this.id, COMMENT_COUNT + 1, lastMarker);
        let isCommentOnLatest = true;
        if (comments.length === COMMENT_COUNT + 1) {
          isCommentOnLatest = false;
          comments.pop();
        }
        this.comments.push(...comments);
        this.isCommentOnLatest = isCommentOnLatest;
      } catch (e) {
        this.isCommentError = true;
        throw e;
      } finally {
        this.isCommentLoading = false;
      }
    }

    get formatedCategories(): string {
      return this.talkInfo.categories.length > 0 ? this.talkInfo.categories.join(' | ') : '';
    }

    isChildActived(): boolean {
      return this.$router.currentRoute.name !== 'topic_post.main';
    }

    visibleY() {
      let section = (this.contentDom.content as HTMLElement);
      let rect = section.getBoundingClientRect();
      let top = rect.top;
      return top <= 50
    };

    changeIosStatus = async (status: number, statusChange: boolean) => {
      await initIOS();
      callHandler('changeTop', status);
    };

    nativeToComment = async (query: string) => {
      await initIOS();
      callHandler('pushComment', query);
    };

    gotoComment(id: string, nick: string, content: string) {
      const query: { [key: string]: string } = {title: encodeURIComponent(this.talkInfo.subject)};
      if (id && nick && content) {
        query['request'] = encodeURIComponent(JSON.stringify({
          id: id,
          nick: nick,
          content: content
        }));
      }
      if (this.isInApp) {
        this.nativeToComment(JSON.stringify({
          title: this.talkInfo.subject,
          query: {
            id: id,
            nick: nick,
            content: content,
          }
        }));
      } else {
        this.$router.push({path: `/topic_post/${this.id}/post-comment`, query: query});
      }
    }

    handelScroll() {
      let statusChange = this.visibleY();
      if (statusChange !== this.isContentChange) {
        let status = statusChange ? 1 : 0;
        this.isContentChange = statusChange;
        this.changeIosStatus(status, statusChange);
      }
    }

  }
</script>
