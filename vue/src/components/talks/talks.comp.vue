<template>
  <div>
    <bd-loading class="loading" v-if="isLoading"></bd-loading>
    <div class="main" v-else-if="talkInfo" @touchstart="touchStart" @touchmove="touchMove">
      <header v-bind:class="{sticky: !isVideoCoverShown && !isOnScreen}">
        <!--<video-player-->
        <!--v-if="videoInfo"-->
        <!--class="video-player"-->
        <!--[videoInfo]="videoInfo"-->
        <!--[option]="videoOption"-->
        <!--(onEvents)="onVideoEvent($event)"-->
        <!--&gt;</video-player>-->

        <div class="live-cover" v-if="isVideoCoverShown">
          <div class="cover-thumbnail-wrapper">
            <div class="cover-thumnail" v-bind:style="{backgroundImage: `url(${talkInfo.coverThumbnailUrl})`}"></div>
          </div>
          <img
            class="cover-image"
            alt="话题间封面"
            v-bind:class="{fadein: coverLoaded}"
            v-bind:src="talkInfo.coverUrl"
            @load="coverLoaded = true"
            @error="resetDefaultBackground()"
          >

          <div class="mask"></div>

          <i class="bi bi-play-fill" v-if="videoInfo && videoInfo.hasVideo"></i>

          <div class="talk-info">
            <div class="publisher-info">
              <img
                class="avatar avatar-round avatar-medium"
                v-if="talkInfo.userInfo"
                v-bind:src="talkInfo.userInfo.avatar"
                alt="发布人头像"
              >
              <span class="nick" v-if="talkInfo.userInfo">{{talkInfo.userInfo.nick}}</span>
            </div>

            <time>{{talkInfo.publishAt.format('YYYY年MM月DD日')}}</time>
          </div>

          <h1>{{talkInfo.subject}}</h1>
        </div>
      </header>

      <section class="article talk-article" v-html="talkInfo.content" v-once></section>

      <section class="info">
        <ul v-for="catalogArr in talkInfo.categories">
          <li v-for="catalog in catalogArr">{{catalog.title}}</li>
        </ul>

        <div class="tags">
          <small v-for="tag in talkInfo.tags">{{tag}}</small>
        </div>
      </section>

      <section class="comments">
        <h2>评论</h2>

        <div v-if="comments">
          <div class="comment" v-for="comment in comments.data" v-bind:key="comment.id">
            <div class="header" v-once>
              <div class="author-info">
                <img class="avatar avatar-round avatar-small" v-bind:src="comment.user.avatar" alt="用户头像">
                <span class="nick">{{comment.user.nick}}</span>
                <time>{{comment.createdAt.format('YYYY年MM月DD日 HH:mm')}}</time>
              </div>
              <span class="reply" @click="gotoComment(comment.id, comment.user.nick, comment.content)">回复</span>
            </div>
            <!-- 不要换行，避免出现换行符 -->
            <div class="content" v-once><div class="quote" v-if="comment.parent"><span class="nick">{{comment.parent.user.nick}}:</span>{{comment.parent.content}}</div>{{comment.content}}</div>
          </div>
        </div>

        <bd-loading class="comment-loading" v-if="isCommentLoading"></bd-loading>
        <div class="no-comments" v-else-if="!comments.data.length">暂无评论</div>
        <div class="no-more-comments" v-else-if="!comments.hasMore">到底咯~</div>
        <div class="more-comments" v-else @click="fetchComments">加载更多评论</div>
      </section>

      <footer ref="toolBar">
        <div class="icon view"><i class="bi bi-eye"></i>{{talkInfo.totalUsers}}</div>
        <div class="icon" @click="togglePraise">
          <i class="bi" v-bind:class="{'bi-thumbsup': !talkInfo.isPraised, 'bi-thumbsup-fill': talkInfo.isPraised}"></i>{{talkInfo.praiseTotal}}
        </div>
        <div class="icon" @click="toggleFavorite">
          <i class="bi" v-bind:class="{'bi-heart': !talkInfo.isFavorited, 'bi-heart-fill': talkInfo.isFavorited}"></i>
        </div>
        <div class="icon" @click="gotoComment"><i class="bi bi-comment"></i>{{talkInfo.commentTotal}}</div>
      </footer>
    </div>
    <div class="no-content" v-else>无效内容</div>

    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @import "../../css/_variables";

  .main {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;

    header {
      position: relative;

      &.sticky {
        position: sticky;
        top: 0;
      }

      &:before {
        content: "";
        display: block;
        height: 100vw;
      }

      @media (max-width: 1022px) and (orientation: landscape) {
        .video-container {
          .video {
            &:before {
              height: 100vh;
            }
          }
        }
      }

      .video-player {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }

      .live-cover {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column-reverse;
        pointer-events: none;

        .mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, .4);
        }

        .cover-thumbnail-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: $color-w;
          overflow: hidden;

          .cover-thumnail {
            position: absolute;
            top: -10px;
            left: -10px;
            width: calc(100% + 20px);
            height: calc(100% + 20px);
            background-position: center;
            background-size: cover;
            filter: blur(10px);
          }
        }

        .cover-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          text-indent: -10000px;
          transition: opacity 2.5s;
          opacity: 0;

          &.fadein {
            opacity: 1;
          }
        }

        h1 {
          position: relative;
          font-size: 26px;
          line-height: 1.3em;
          color: $color-w;
          padding-left: 24px;
          padding-right: 24px;
          padding-bottom: 15px;
          font-weight: normal;
        }

        .talk-info {
          position: relative;
          display: flex;
          padding-left: 24px;
          padding-right: 24px;
          padding-bottom: 24px;
          align-items: center;
          overflow: hidden;

          .publisher-info {
            flex-grow: 1;
            overflow: hidden;
            display: flex;
            align-items: center;

            .avatar {
              flex-shrink: 0;
              margin-right: 6px;
            }

            .nick {
              flex-grow: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 16px;
              color: $color-w;
              line-height: 1em;
            }
          }

          time {
            font-size: 12px;
            color: $color-w;
            line-height: 1em;
          }
        }

        .bi-play-fill {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          font-size: 30px;
          color: $color-w;
          pointer-events: none;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          height: 70px;
          width: 70px;
          display: flex;
          justify-content: center;
          align-items: center;

          &:before {
            transform: translateX(3px);
          }
        }
      }
    }

    .article {
      padding: 15px;
      text-align: justify;

      &.talk-article {
        font-size: $font-size-content;
        line-height: 1.75;
        color: $color-dark-gray;

        i {
          font-weight: inherit;
        }

        p {
          padding-bottom: 9px;
          padding-top: 10px;
          margin-bottom: 0;
          white-space: pre-wrap;
        }

        h1, h2, h3, h4, h5, h6 {
          padding-bottom: 20px;
          padding-top: 40px;
          margin-top: 0px;
          margin-bottom: 0;
        }

        b, strong {
          font-weight: bold;
        }

        img {
          max-width: 100%;
          height: auto;
        }
      }
    }

    .info {
      margin-top: 42px;
      padding: 12px;

      ul {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        li {
          display: flex;
          align-items: center;
          font-size: 17px;
          line-height: 1em;
          color: $color-dark-gray;

          &:last-child {
            &:after {
              display: none;
            }
          }

          &:after {
            margin-left: 6px;
            margin-right: 6px;
            content: ">";
            font-size: 20px;
          }
        }
      }

      .tags {
        display: flex;

        small {
          flex-shrink: 0;
          min-width: 48px;
          padding: 5px 15px;
          margin-right: 10px;
          font-size: 12px;
          background-color: $color-brand;
          color: $color-w;
          line-height: 1em;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .comments {
      margin-top: 42px;
      padding: 12px;

      h2 {
        font-size: 26px;
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
            color: $color-brand;
          }
        }

        .content {
          margin-left: 31px;
          font-size: 14px;
          color: $color-dark-gray;
          line-height: 1.57em;
          white-space: pre-wrap;

          .quote {
            background-color: rgb(237, 237, 237);
            padding: 10px;
            margin-bottom: 6px;
            white-space: pre-wrap;

            .nick {
              font-weight: bold;
              margin-right: 6px;
            }
          }
        }
      }

      .no-comments, .more-comments, .comment-loading, .no-more-comments {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .no-comments, .no-more-comments {
        color: $color-gray;
        font-size: 14px;
      }

      .more-comments {
        color: $color-dark-gray;
        font-size: 14px;
      }
    }

    footer {
      display: flex;
      height: 46px;
      background-color: rgb(137, 137, 137);
      max-width: 1022px;
      width: 100%;

      .icon {
        color: $color-w;
        line-height: 1em;
        font-size: 12px;
        display: flex;
        align-items: center;
        padding-left: 15px;

        &:first-child {
          padding-left: 24px;
        }

        &:last-child {
          padding-right: 24px;
        }

        .bi {
          font-size: 21px;
          margin-right: 4px;
        }

        .bi-heart-fill {
          color: red;
        }
      }

      .view {
        flex-grow: 1;

        .bi {
          font-size: 16px;
        }
      }
    }
  }

  .loading, .no-content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-content {
    font-size: 16px;
    color: $color-gray;
    line-height: 1em;
  }

</style>

<script>
  import BdLoading from '../../shared/bd-loading.comp.vue'
  import {FETCH_TALK, FETCH_TALK_COMMENT, TOGGLE_TALK_PRAISE, TOGGLE_TALK_FAVORITE} from '../../store/talk'
  import {Utils} from '../../shared/utils/utils'

  export default {
    data() {
      return {
        id: this.$route.params.id,
        originY: 0,
        isToolbarShow: true,
        isOnScreen: Utils.isOnLargeScreen,
        isVideoCoverShown: true,
        coverLoaded: false,
        isCommentLoading: true
      }
    },
    components: {
      BdLoading
    },
    computed: {
      talkInfo() {
        if (this.$store.state.talks.info[this.id] === undefined) {
          this.$store.dispatch(FETCH_TALK, this.id)
        }
        return this.$store.state.talks.info[this.id]
      },
      comments() {
        if (this.$store.state.talks.comments[this.id] === undefined) {
          this.fetchComments()
        }
        return this.$store.state.talks.comments[this.id]
      },
      isLoading() {
        return this.talkInfo === undefined
      }
    },
    methods: {
      resetDefaultBackground() {
        this.talkInfo.coverUrl = '/assets/img/default-cover.jpg';
        this.talkInfo.coverSmallUrl = '/assets/img/default-cover.jpg';
        this.talkInfo.coverThumbnailUrl = '/assets/img/default-cover.jpg';
      },
      async fetchComments() {
        this.isCommentLoading = true;

        await this.$store.dispatch(FETCH_TALK_COMMENT, this.id);

        this.isCommentLoading = false;
      },
      gotoComment(id, nick, content) {
        let query = {title: encodeURIComponent(this.talkInfo.subject)};

        if (id && nick && content) {
          query.request = encodeURIComponent(JSON.stringify({id: id, nick: nick, content: content}));
        }

        this.$router.push({path: `/talks/${this.id}/post-comment`, query: query});
      },
      touchStart(e) {
        if (!this.$refs.toolBar) return

        this.originY = e.touches[0].clientY
      },
      touchMove(e) {
        if (!this.$refs.toolBar) return

        if (this.originY - e.touches[0].clientY > 10 && this.isToolbarShow) {
          this.isToolbarShow = false
        } else if (e.touches[0].clientY - this.originY > 10 && !this.isToolbarShow) {
          this.isToolbarShow = true
        }
      },
      togglePraise() {
        this.$store.dispatch(TOGGLE_TALK_PRAISE, this.id);
      },
      toggleFavorite() {
        this.$store.dispatch(TOGGLE_TALK_FAVORITE, this.id);
      }
    }
  };
</script>
