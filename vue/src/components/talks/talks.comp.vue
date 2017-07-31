<template>
  <div>
    <bd-loading class="loading" v-if="isLoading"></bd-loading>
    <div class="main" v-show="!isChildActived()" v-else-if="talkInfo" @touchstart="touchStart" @touchmove="touchMove">
      <header v-bind:class="{
        'sticky': isVideoPlayed && !isLandscape && !isOnScreen,
        'played': isVideoPlayed,
        'played-landscape': isVideoPlayed && isLandscape
      }">
        <div class="player" id="player" @click="isVideoPlayed = true;"></div>

        <div class="live-cover" v-if="!isVideoPlayed">
          <img
            class="cover-image"
            alt="话题间封面"
            v-bind:src="coverUrl"
            @error="coverUrl = defaultCoverUrl"
          >

          <div class="big-play" v-if="talkInfo.media.hasVideo">视频 {{talkInfo.media.duration.format('mm’ss’’')}}</div>
        </div>
      </header>

      <ul class="tab-nav"
          v-bind:class="{'stick-under-video': isVideoPlayed && !isLandscape && !isOnScreen}"
          v-show="!(isVideoPlayed && isLandscape)"
          v-if="emphasis && emphasis.length"
      >
        <li v-bind:class="{active: tabIndex === 0}" @click="tabIndex = 0">全文</li>
        <li v-bind:class="{active: tabIndex === 1}" @click="tabIndex = 1">划重点</li>
      </ul>

      <div class="tab-content-container" v-show="!(isVideoPlayed && isLandscape)">
        <div class="tab-content-inner" v-bind:class="{'tab-one-active': tabIndex === 0, 'tab-two-active': tabIndex === 1}">
          <div class="tab-content">
            <section class="title">
              <div class="categories" v-if="talkCategories">{{talkCategories}}</div>
              <h1>{{talkInfo.subject}}</h1>
              <div class="talk-info">
                <div class="publisher-info">
                  <img
                    class="avatar avatar-round avatar-sm"
                    v-if="talkInfo.userInfo"
                    v-bind:src="talkInfo.userInfo.avatar"
                    alt="发布人头像"
                  >
                  <img
                    class="avatar avatar-round avatar-sm"
                    src="/assets/img/zaojiu-logo.jpg"
                    alt="发布人头像"
                    v-else
                  >
                  <span class="nick" v-if="talkInfo.userInfo">{{talkInfo.userInfo.nick}}</span>
                  <span class="nick" v-else>造就</span>
                </div>

                <time>{{talkInfo.publishAt.format('YYYY年MM月DD日')}}</time>
              </div>
            </section>

            <section class="article talk-article"
                     v-html="talkInfo.content" v-once></section>

            <section class="info" v-if="talkInfo.tags && talkInfo.tags.length">
              <div class="tags">
                <small v-for="tag in talkInfo.tags">{{tag}}</small>
              </div>
            </section>

            <section id="comments" class="comments">
              <h2>评论</h2>

              <div v-if="comments">
                <div class="comment" v-for="comment in comments.data" v-bind:key="comment.id">
                  <div class="header" v-once>
                    <div class="author-info">
                      <img class="avatar avatar-round avatar-sm" v-bind:src="comment.user.avatar" alt="用户头像">
                      <span class="nick">{{comment.user.nick}}</span>
                      <time>{{comment.createdAt.format('MM月DD日 HH:mm')}}</time>
                    </div>
                    <span class="reply" @click="gotoComment(comment.id, comment.user.nick, comment.content)"> <i
                      class="bi bi-reply-comment"></i>回复</span>
                  </div>
                  <!-- 不要换行，避免出现换行符 -->
                  <div class="content" v-once><div class="quote" v-if="comment.parent"><span class="nick">{{comment.parent.user.nick}}:</span>{{comment.parent.content}}</div>{{comment.content}}</div>
                </div>
              </div>

              <bd-loading class="comment-loading" v-if="isCommentLoading"></bd-loading>
              <div class="no-comments" v-else-if="!comments.data.length"><i class="bi bi-no-comment"></i> 暂无评论</div>
              <div class="no-more-comments" v-else-if="!comments.hasMore">到底咯~</div>
              <div class="more-comments" v-else @click="fetchComments">加载更多评论</div>
            </section>
          </div>

          <div class="tab-content">
            <div class="emphasis" v-for="(item, index) in emphasis" v-bind:class="{active: emphasisActiveIndex === index}" @click="emphasisClicked(index);">
              <div class="start">{{item.startParsed.format('hh小时mm分ss秒', { forceLength: true })}}</div>
              <div class="text">{{item.text}}</div>
              <img class="cover" v-if="item.coverUrl" v-bind:src="item.coverUrl" alt="划重点配图">
            </div>
          </div>
        </div>
      </div>

      <footer v-show="!(isVideoPlayed && isLandscape)" ref="toolBar"
              v-bind:class="{'footer-show': isToolbarShow,'footer-hide': !isToolbarShow}">
        <div class="icon view">{{talkInfo.totalUsers}}人看过</div>
        <div class="icon" @click="togglePraise">
          <i class="bi" v-bind:class="{'bi-thumbsup': !talkInfo.isPraised, 'bi-thumbsup-fill': talkInfo.isPraised}"></i>{{talkInfo.praiseTotal}}
        </div>
        <div class="icon" @click="toggleFavorite">
          <i class="bi"
             v-bind:class="{'bi-bookmark': !talkInfo.isFavorited, 'bi-bookmark-fill': talkInfo.isFavorited}"></i>
        </div>
        <div class="icon" @click="gotoComment"><i class="bi bi-comment"></i>{{talkInfo.commentTotal}}</div>
      </footer>
    </div>
    <div class="no-content" v-else>无效文章</div>

    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  .main {
    header {
      position: relative;

      &.sticky {
        position: sticky;
        top: 0;
        z-index: $z-index-page-lv1;
      }

      &.played:before {
        height: 56.25vw;
      }

      &.played-landscape:before {
        height: 100vh;
      }

      &:before {
        content: "";
        display: block;
        height: 100vw;
        transition: height .5s;
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

      .player {
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
        }

        .big-play {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          background: url("/assets/icon/big-play.svg") center top no-repeat;
          pointer-events: none;
          min-width: 66px;
          padding-top: 74px;
          font-size: 14px;
          text-align: center;
          white-space: nowrap;
          color: $color-w;
          text-shadow: 0 0 2px $color-b;
        }
      }
    }

    .tab-nav {
      position: sticky;
      top: 0;
      z-index: $z-index-page-lv1;
      box-shadow: 0 2px 2px rgba(211, 211, 211, .5);
      display: flex;
      height: 44px;
      list-style: none;
      background-color: $color-w;

      &.stick-under-video {
        top: calc(56.25vw - 1px);
      }

      li {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $color-gray3;
        font-size: $font-size-md;

        &.active {
          color: $color-dark-gray;
          font-weight: bold;
        }
      }
    }

    .tab-content-container {
      overflow: hidden;

      .tab-content-inner {
        white-space: nowrap;
        transition: transform .3s;

        &.tab-one-active {
          transform: translateX(0);

          .tab-content:nth-child(1) {
            max-height: 1000000px;
          }
        }

        &.tab-two-active {
          transform: translateX(-100%);

          .tab-content:nth-child(2) {
            max-height: 1000000px;
          }
        }

        .tab-content {
          width: 100%;
          display: inline-block;
          vertical-align: top;
          max-height: 0;
          transition: max-height .3s 0s;
          white-space: normal;
        }
      }
    }

    .title {
      padding: 20px 15px 0px 15px;

      .categories {
        margin-bottom: 15px;
        font-size: 14px;
        color: rgb(80, 227, 194);
        font-weight: 400;
      }

      h1 {
        font-size: 24px;
        line-height: 1.3em;
        color: $color-b;
        padding-bottom: 15px;
        font-weight: 500;
        word-break: break-all;
      }

      .talk-info {
        display: flex;
        align-items: center;
        overflow: hidden;

        .publisher-info {
          flex-grow: 1;
          overflow: hidden;
          display: flex;
          align-items: center;

          .avatar {
            flex-shrink: 0;
            margin-right: 5px;
          }

          .nick {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            color: $color-dark-gray;
            line-height: 1em;
          }
        }

        time {
          font-size: 14px;
          color: rgb(144, 144, 144);
          line-height: 1em;
        }
      }
    }

    .article {
      padding: 0 20px;
      text-align: justify;
    }

    .info {
      margin-top: 14px;
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
        flex-wrap: wrap;

        small {
          flex-shrink: 0;
          min-width: 48px;
          padding: 9px 18px;
          margin-right: 10px;
          margin-top: 10px;
          border-radius: 4px;
          font-size: 12px;
          background-color: rgb(239, 239, 239);
          color: $color-dark-gray;
          line-height: 1em;

          &:last-child {
            margin-right: 0;
          }
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

    .emphasis {
      padding: 15px 20px;
      border-top: solid .5px transparent;
      border-bottom: solid .5px transparent;

      &.active {
        background-color: #f0f0f0;
        border-top: solid .5px rgba(188, 188, 188, .5);
        border-bottom: solid .5px rgba(188, 188, 188, .5);
      }

      .start {
        font-size: $font-size-sm;
        color: $color-gray3;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .text {
        font-size: $font-size-md;
        color: $color-gray3;
        word-break: break-all;
        white-space: pre-wrap;
        line-height: 1.75em;
      }

      .cover {
        display: block;
        margin: 15px auto 0;
        max-width: 100%;
        height: auto;
      }
    }

    .footer-show {
      bottom: 0;
      transition: bottom 0.3s ease;
    }

    .footer-hide {
      bottom: -46px;
      transition: bottom 0.3s ease;
    }

    footer {
      display: flex;
      height: 46px;
      background-color: rgb(10, 10, 23);
      max-width: 1022px;
      width: 100%;

      .icon {
        line-height: 1em;
        font-size: 14px;
        color: $color-w;
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

        .bi-bookmark-fill, .bi-thumbsup-fill, .bi-comment-fill {
          color: $color-brand;
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

<script lang="ts">
  import bdLoading from '../../shared/bd-loading.comp.vue'
  import {
    FETCH_TALK,
    FETCH_TALK_COMMENT,
    TOGGLE_TALK_PRAISE,
    TOGGLE_TALK_FAVORITE,
    FETCH_TALK_EMPHASIS,
    TalkCommentsStore
  } from '../../store/talk'
  import {isOnLargeScreen, isAndroid, isiOS} from '../../shared/utils/utils'
  import Vue from "vue";
  import {ComponentOptions} from "vue";
  import {TalkEmphasisModel, TalkInfoModel} from "../../shared/api/talk.model";
  import {Location} from "vue-router";
  import {ZaojiuPlayer, ZaojiuPlayerInstance, PlayerEvent} from "zaojiu-player";

  interface TalkComponent extends Vue {
    id: string;
    originY: number;
    isToolbarShow: boolean;
    isOnScreen: boolean;
    isVideoPlayed: boolean;
    isCommentLoading: boolean;
    talkInfo: TalkInfoModel;
    emphasis: TalkEmphasisModel[];
    comments: TalkCommentsStore;
    isLoading: boolean;
    talkCategories: string;
    tabIndex: number;
    emphasisActiveIndex: number;
//    liveInfo: LiveInfo
    isLandscape: boolean;
    coverUrl: string;
    defaultCoverUrl: string;
    player: ZaojiuPlayerInstance;
    seeking: boolean;

    fetchComments(): void;
    prepareVideo(): void;
    gotoComment(id: string, nick: string, content: string): void;
    touchStart(e: TouchEvent): void;
    touchMove(e: TouchEvent): void;
    togglePraise(): void;
    toggleFavorite(): void;
    emphasisClicked(): void;
    isChildrenActived(): boolean;
  }

  export default {
    data() {
      return {
        id: this.$route.params.id,
        originY: 0,
        isToolbarShow: false,
        isOnScreen: isOnLargeScreen,
        isVideoPlayed: false,
        isCommentLoading: true,
        isLandscape: false,
        coverUrl: '',
        defaultCoverUrl: '/assets/img/default-cover.jpg',
        player: null,
        tabIndex: 0,
        emphasisActiveIndex: -1,
        seeking: false,
      }
    },
    components: {
      bdLoading,
    },
    computed: {
      talkInfo() {
        if (!this.$store.state.talks.info[this.id]) this.$store.dispatch(FETCH_TALK, this.id);
        const talkInfo = this.$store.state.talks.info[this.id];
        if (talkInfo && talkInfo.media.hasVideo) this.prepareVideo();
        if (talkInfo) this.coverUrl = talkInfo.coverSmallUrl;
        return talkInfo;
      },
      emphasis() {
        if (!this.$store.state.talks.emphasis[this.id]) this.$store.dispatch(FETCH_TALK_EMPHASIS, this.id);
        return this.$store.state.talks.emphasis[this.id];
      },
//      liveInfo () {
//        if (this.talkInfo.parentId) {
//          this.objectService.getObject(this.talkInfo.parentId).then(liveObject => {
//            this.liveObject = liveObject;
//          });
//        }
//      },
      comments() {
        if (!this.$store.state.talks.comments[this.id]) this.fetchComments();
        return this.$store.state.talks.comments[this.id]
      },
      isLoading() {
        return this.talkInfo === undefined || this.emphasis === undefined;
      },
      talkCategories() {
        if (!this.$store.state.talks.info[this.id]) this.$store.dispatch(FETCH_TALK, this.id);
        return this.$store.state.talks.info[this.id].categories.length > 0 ? this.$store.state.talks.info[this.id].categories.join(' | ') : '';
      },
    },
    methods: {
      async fetchComments() {
        this.isCommentLoading = true;
        await this.$store.dispatch(FETCH_TALK_COMMENT, this.id);
        this.isCommentLoading = false;
      },
      prepareVideo() {
        System.import('zaojiu-player').then((player: ZaojiuPlayer) => {
          this.player = new player({
            element: 'player',
            playList: [{
              src: this.talkInfo.media.mp4_sd,
              quality: '标清',
              mimetype: 'video/mp4'
            }, {
              src: this.talkInfo.media.mp4_hd,
              quality: '高清',
              mimetype: 'video/mp4'
            }],
          });
          this.player.event$.subscribe((e: PlayerEvent) => {
            switch (e.type) {
              case 'play':
              case 'error':
                this.isVideoPlayed = true;
                break;
              case 'timeupdate':
                if (this.emphasis && this.emphasis.length && !this.seeking) {
                  this.emphasis.forEach((item, index) => {
                    const startTime = item.start / 1000;
                    if (this.player.video.el.currentTime >= startTime) this.emphasisActiveIndex = index;
                  });
                }
                break;
              case 'seeking':
                this.seeking = true;
                break;
              case 'playing':
                this.seeking = false;
                break;
            }
          });
        });

        // 横竖屏polyfill
        System.import('o9n').then((o9n: any) => {
          this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && (isAndroid || isiOS);
          o9n.orientation.onchange = (evt: any) => {
            this.isLandscape = evt.target.type.indexOf('landscape') !== -1 && (isAndroid || isiOS);
          }
        });
      },
      gotoComment(id, nick, content) {
        const query = {
          title: encodeURIComponent(this.talkInfo.subject),
          request: id && nick && content ? encodeURIComponent(JSON.stringify({
            id: id,
            nick: nick,
            content: content
          })) : null,
        };

        this.$router.push({path: `/talks/${this.id}/post-comment`, query: query} as Location);
      },
      touchStart(e) {
        if (!this.$refs.toolBar) return;

        this.originY = e.touches[0].clientY;
      },
      touchMove(e) {
        if (!this.$refs.toolBar) return;

        if (this.originY - e.touches[0].clientY > 10 && this.isToolbarShow) {
          this.isToolbarShow = false;
          setTimeout(() => (this.$refs.toolBar as HTMLElement).style.position = 'static', 300);
        } else if (e.touches[0].clientY - this.originY > 10 && !this.isToolbarShow) {
          (this.$refs.toolBar as HTMLElement).style.position = 'fixed';
          this.isToolbarShow = true;
        }
      },
      togglePraise() {
        this.$store.dispatch(TOGGLE_TALK_PRAISE, this.id);
      },
      toggleFavorite() {
        this.$store.dispatch(TOGGLE_TALK_FAVORITE, this.id);
      },
      emphasisClicked(index: number) {
        this.emphasisActiveIndex = index;
        const emphasis = this.emphasis[index];
        const startTime = emphasis.start / 1000;
        if (this.player) {
          this.player.video.el.currentTime = startTime;
          if (this.player.video.el.paused) this.player.video.el.play();
        }
      },
      isChildActived() {
        return this.$router.currentRoute.name !== 'talks.main';
      },
    }
  } as ComponentOptions<TalkComponent>;
</script>
