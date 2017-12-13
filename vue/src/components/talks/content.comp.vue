<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else v-show="!isChildActived()" @touchstart="touchStart" @touchmove="touchMove">
      <top-nav v-if="!(isVideoPlayed && isLandscape)"></top-nav>
      <app-download-tips class="app-download-tips" v-if="isAppDownloadTipsShow && !(isVideoPlayed && isLandscape)" @close="isAppDownloadTipsShow = false"></app-download-tips>
      <header :class="{
        'sticky': isVideoPlayed && !isLandscape && !isOnScreen,
        'played': isVideoPlayed,
        'played-landscape': isVideoPlayed && isLandscape
      }">
        <div class="player" id="player" @click="talkInfo.media.hasVideo ? isVideoPlayed = true : false"></div>

        <div class="live-cover" v-if="!isVideoPlayed">
          <img
            class="cover-image"
            alt="话题间封面"
            :src="coverUrl"
            @error="coverUrl = defaultCoverUrl"
          >

          <div class="big-play" v-if="talkInfo.media.hasVideo"></div>
        </div>
      </header>

      <ul class="tab-nav"
          :class="{'stick-under-video': isVideoPlayed && !isLandscape && !isOnScreen}"
          v-show="!(isVideoPlayed && isLandscape)"
          v-if="emphasis && emphasis.length"
      >
        <li :class="{active: tabIndex === 0}" @click="tabIndex = 0">全文</li>
        <li :class="{active: tabIndex === 1}" @click="tabIndex = 1">划重点</li>
      </ul>

      <div class="tab-content-container" v-show="!(isVideoPlayed && isLandscape)">
        <div class="tab-content-inner"
             :class="{'tab-one-active': tabIndex === 0, 'tab-two-active': tabIndex === 1}">
          <div class="tab-content">
            <section class="talk-info">
              <div class="categories" v-if="formatedCategories">{{formatedCategories}}</div>
              <h1>{{talkInfo.subject}}</h1>
              <time>{{talkInfo.publishAtParsed.format('YYYY年MM月DD日')}}</time>
            </section>

            <audio-bar
              class="audio-bar"
              ref="audioPlayer"
              v-if="talkInfo.media && talkInfo.media.mp3"
              :audioUrl="talkInfo.media.mp3"
              @play="onAudioEvent($event)"
            ></audio-bar>

            <div class="speaker" v-for="speaker in talkInfo.speaker">
              <img class="avatar avatar-60 avatar-round" :src="speaker.avatar" :alt="speaker.name">
              <strong class="name">{{speaker.name}}</strong>
              <p class="desc">{{speaker.title}}</p>
            </div>

            <section class="article article-content" v-html="talkInfo.content" v-once></section>

            <section class="info" v-if="talkInfo.tags && talkInfo.tags.length">
              <div class="tags">
                <small v-for="tag in talkInfo.tags">{{tag}}</small>
              </div>
            </section>

            <section id="comments" class="comments">
              <h2>评论</h2>

              <div v-if="comments">
                <div class="comment" v-for="comment in comments" :key="comment.id">
                  <div class="header" v-once>
                    <div class="author-info">
                      <img class="avatar avatar-round avatar-25" :src="comment.user.avatar" alt="用户头像">
                      <span class="nick">{{comment.user.nick}}</span>
                      <time>{{comment.createdAtParsed.format('MM月DD日 HH:mm')}}</time>
                    </div>
                    <span class="reply" @click="gotoComment(comment.id, comment.user.nick, comment.content)"> <i
                      class="bi bi-reply-comment"></i>回复</span>
                  </div>
                  <!-- 不要换行，避免出现换行符 -->
                  <div class="content" v-once><div class="quote" v-if="comment.parent"><span class="nick">{{comment.parent.user.nick}}:</span>{{comment.parent.content}}</div>{{comment.content}}</div>
                </div>
              </div>

              <bd-loading class="comment-loading" v-if="isCommentLoading"></bd-loading>
              <error class="comment-error" v-else-if="isCommentError" @retry="fetchComments()"></error>
              <div class="no-comments" v-else-if="!comments.length"><i class="bi bi-no-comment"></i> 暂无评论</div>
              <div class="no-more-comments" v-else-if="isCommentOnLatest">到底咯~</div>
              <div class="more-comments" v-else @click="fetchComments()">加载更多评论</div>
            </section>
          </div>

          <div class="tab-content">
            <div class="emphasis" v-for="(item, index) in emphasis"
                 :class="{active: emphasisActiveIndex === index}" @click="emphasisClicked(index);">
              <div class="start">{{item.startParsed.format('hh小时mm分ss秒', {forceLength: true})}}</div>
              <div class="text">{{item.text}}</div>
              <img class="cover" v-if="item.coverUrl" :src="item.coverUrl" alt="划重点配图">
            </div>
          </div>
        </div>
      </div>

      <footer v-show="!(isVideoPlayed && isLandscape)" ref="toolBar"
              :class="{'footer-show': isToolbarShow,'footer-hide': !isToolbarShow}">
        <div class="icon" @click="togglePraise()" :class="{'active': talkInfo.isPraised}">
          <div class="font-content"><i class="bi bi-new-praise"></i></div>
          <div><span>点赞 {{talkInfo.praiseTotal}}</span></div>
        </div>
        <div class="icon" @click="toggleFavorite()" :class="{'active': talkInfo.isFavorited}">
          <div class="font-content"><i class="bi bi-new-favorite"></i></div>
          <div><span>收藏 {{talkInfo.favoriteTotal}}</span></div>
        </div>
        <div class="icon" @click="gotoComment()">
          <div class="font-content"><i class="bi bi-new-comment"></i></div>
          <div><span>评论 {{talkInfo.commentTotal}}</span></div>
        </div>
      </footer>
    </div>

    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .main {
    position: relative;

    .app-download-tips {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

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
        height: 240px;
        transition: height .5s;
      }

      @media (max-width: 1024px) and (orientation: landscape) {
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
          background: url("/assets/icon/new-big-play.svg") center top no-repeat;
          background-size: 80% 80%;
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
        font-size: $font-size-16;

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

    .audio-bar {
      margin: 20px;
    }

    .talk-info {
      margin: 20px;

      .categories {
        margin-bottom: 15px;
        font-size: 14px;
        color: rgb(80, 227, 194);
        font-weight: 400;
      }

      h1 {
        font-size: $font-size-22;
        font-weight: bold;
        line-height: 1.36em;
        color: $color-dark-gray2;
        margin-bottom: 10px;
      }

      time {
        display: block;
        font-size: $font-size-12;
        color: $color-gray6;
        line-height: 1em;
      }
    }

    .speaker {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 60px 20px 20px;
      padding: 20px;
      border-radius: 8px;
      border: solid 1px rgb(237, 237, 242);
      background-color: rgb(250, 250, 250);
      .avatar {
        margin-top: -50px;
        margin-bottom: 13px;
      }

      .name {
        font-size: $font-size-20;
        color: $color-dark-gray2;
        text-align: center;
        margin-bottom: 8px;
      }

      .desc {
        font-size: $font-size-14;
        color: $color-gray6;
        line-height: 1.7em;
        text-align: justify;
        margin-bottom: -5px;
      }
    }

    .article {
      margin: 0 20px;
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
        font-size: $font-size-14;
        color: $color-gray3;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .text {
        font-size: $font-size-16;
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
      bottom: -50px;
      transition: bottom 0.3s ease;
    }

    footer {
      display: flex;
      height: 50px;
      background-color: rgb(10, 10, 23);
      max-width: 1024px;
      width: 100%;

      .icon {
        flex:1;
        line-height: 1em;
        font-size: $font-size-14;
        color: $color-w;
        display: flex;
        flex-direction: column;
        div{
          text-align: center;
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          span{
            font-size: 12px;
          }
        }
        .font-content{
          flex: 3;
          font-size: 20px;
        }

        &.active {
          color: $color-brand;
        }

        .bi {
          margin-top: 3px;
        }

        .bi-praise {
          font-size: $font-size-18;
        }

        .bi-favorite {
          font-size: $font-size-18;
        }

        .bi-comment2 {
          font-size: $font-size-16;
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
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component, Watch } from 'vue-property-decorator';
  import {isOnLargeScreen, isAndroid, isiOS, setScrollPosition} from '../../shared/utils/utils';
  import {TalkCommentModel, TalkEmphasisModel, TalkInfoModel} from "../../shared/api/talk.model";
  import {getTalkInfo, listTalkComments, listTalkEmphasis, praise, unpraise, favorite, unfavorite} from '../../shared/api/talk.api';
  import {ZaojiuPlayer, ZaojiuPlayerInstance, PlayerEvent} from "zaojiu-player";
  import appDownloadTips from '../../shared/app-download-tips.comp.vue';
  import audioBar from '../../shared/audio-bar.comp.vue';
  import {setTitle} from '../../shared/utils/title';

  const COMMENT_COUNT = 20;

  @Component({
    components: {
      appDownloadTips: appDownloadTips,
      audioBar: audioBar,
    }
  })
  export default class ContentComponent extends Vue {
    id = '';
    originY = 0;
    isToolbarShow = false;
    isOnScreen = isOnLargeScreen;
    isVideoPlayed = false;
    isLandscape = false;
    coverUrl = '';
    defaultCoverUrl = '/assets/img/default-cover.jpg';
    tabIndex = 0;
    emphasisActiveIndex = -1;
    seeking = false;
    player: ZaojiuPlayerInstance;
    talkInfo = new TalkInfoModel({});
    isLoading = false;
    isError = false;
    comments: TalkCommentModel[] = [];
    isCommentLoading = false;
    isCommentError = false;
    isCommentOnLatest = false;
    emphasis: TalkEmphasisModel[] = [];
    isAppDownloadTipsShow = true;

    created() {
      this.id = this.$route.params['id'];

      this.initData();
      this.fetchComments();
      this.fetchEmphasis();
    }

    @Watch('$route.name')
    refreshComments() {
      if (this.$route.name === 'talks.main') {
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

      if (this.talkInfo.media.hasVideo) this.prepareVideo();
      this.coverUrl = this.talkInfo.coverSmall11Url;
      if (!this.isChildActived()) setTitle(this.talkInfo.subject);
    }

    get formatedCategories(): string {
      return this.talkInfo.categories.length > 0 ? this.talkInfo.categories.join(' | ') : '';
    }

    isChildActived(): boolean {
      return this.$router.currentRoute.name !== 'talks.main';
    }

//      get liveInfo () {
//        if (this.talkInfo.parentId) {
//          this.objectService.getObject(this.talkInfo.parentId).then(liveObject => {
//            this.liveObject = liveObject;
//          });
//        }
//      },

    async fetchEmphasis() {
      this.emphasis = await listTalkEmphasis(this.id);
    }

    async fetchComments() {
      this.isCommentLoading = true;
      this.isCommentError = false;

      try {
        const lastMarker = this.comments.length ? `$lt${this.comments[this.comments.length-1].createdAt}` : '';
        const comments = await listTalkComments(this.id, COMMENT_COUNT+1, lastMarker);
        let isCommentOnLatest = true;
        if (comments.length === COMMENT_COUNT+1) {
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

    async togglePraise() {
      this.talkInfo.isPraised = !this.talkInfo.isPraised;
      this.talkInfo.praiseTotal = this.talkInfo.isPraised ? this.talkInfo.praiseTotal + 1 : this.talkInfo.praiseTotal - 1;
      const promise = this.talkInfo.isPraised ? praise(this.id) : unpraise(this.id);
      await promise;
    }

    async toggleFavorite() {
      this.talkInfo.isFavorited = !this.talkInfo.isFavorited;
      const promise = this.talkInfo.isFavorited ? favorite(this.id) : unfavorite(this.id);
      await promise;
    }

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
              (this.$refs['audioPlayer'] as any).togglePlay();
              break;
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
    }

    gotoComment(id: string, nick: string, content: string) {
      const query: {[key: string]: string} = { title: encodeURIComponent(this.talkInfo.subject) };

      if (id && nick && content) {
        query['request'] = encodeURIComponent(JSON.stringify({
          id: id,
          nick: nick,
          content: content
        }));
      }

      this.$router.push({path: `/talks/${this.id}/post-comment`, query: query});
    }

    touchStart(e: TouchEvent) {
      if (!this.$refs['toolBar']) return;

      this.originY = e.touches[0].clientY;
    }

    touchMove(e: TouchEvent) {
      if (!this.$refs['toolBar']) return;

      if (this.originY - e.touches[0].clientY > 10 && this.isToolbarShow) {
        this.isToolbarShow = false;
        setTimeout(() => (this.$refs['toolBar'] as HTMLElement).style.position = 'static', 300);
      } else if (e.touches[0].clientY - this.originY > 10 && !this.isToolbarShow) {
        (this.$refs['toolBar'] as HTMLElement).style.position = 'fixed';
        this.isToolbarShow = true;
      }
    }

    emphasisClicked(index: number) {
      this.emphasisActiveIndex = index;
      const emphasis = this.emphasis[index];
      const startTime = emphasis.start / 1000;
      if (this.player) {
        this.player.video.el.currentTime = startTime;
        if (this.player.video.el.paused) this.player.video.el.play();
      }
    }

    onAudioEvent() {
      this.player.video.el.pause();
    }
  }
</script>
