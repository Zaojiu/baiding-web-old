<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else v-show="!isChildActived()" @touchstart="touchStart" @touchmove="touchMove">
      <header :class="{
        'sticky': isVideoPlayed && !isLandscape && !isOnScreen,
        'played': isVideoPlayed,
        'played-landscape': isVideoPlayed && isLandscape
      }">
        <div class="player" id="player" @click="itemInfo.current.isTypeVideo ? isVideoPlayed = true : false"></div>

        <div class="live-cover" v-if="!isVideoPlayed">
          <img
            class="cover-image"
            alt="话题间封面"
            :src="coverUrl"
            @error="coverUrl = defaultCoverUrl"
          >

          <div class="big-play" v-if="itemInfo.current.isTypeVideo">视频 {{itemInfo.current.duration.format('mm’ss“')}}
          </div>
        </div>
      </header>

      <div class="block content">
        <div class="title">
          <h1>{{itemInfo.current.subject}}</h1>
          <div class="talk-info">
            <div class="author-info">
              <img
                class="avatar avatar-round avatar-sm"
                :src="itemInfo.column.speaker && itemInfo.column.speaker.coverUrl || '/assets/img/zaojiu-logo.jpg'"
                alt="发布人头像"
              >
              <span
                class="nick">{{itemInfo.column.speaker && itemInfo.column.speaker.subject ? itemInfo.column.speaker.subject : '造就'}}</span>
            </div>

            <time>{{itemInfo.current.publishAtParsed.format('YYYY年MM月DD日')}}</time>
          </div>
        </div>

        <audio-bar class="audio-bar" v-if="itemInfo.current.isTypeAudio" :audioUrl="itemInfo.current.audioUrl" :audioCover="itemInfo.current.cover11Url"></audio-bar>

        <div class="article article-content" v-html="itemInfo.current.content" v-once></div>

        <div class="relative-items" v-if="itemInfo.prev || itemInfo.next">
          <div class="item" v-if="itemInfo.prev" @click="gotoRelativeItem(itemInfo.prev)">
            <div class="item-cover">
              <img :src="itemInfo.prev.cover169Url" alt="专栏图片">
              <span class="text">上一篇</span>
            </div>
            <p class="item-title">{{itemInfo.prev.subject}}</p>
          </div>
          <div class="item" v-if="itemInfo.next" @click="gotoRelativeItem(itemInfo.next)">
            <div class="item-cover">
              <img :src="itemInfo.next.cover169Url" alt="专栏图片">
              <span class="text">下一篇</span>
            </div>
            <p class="item-title">{{itemInfo.next.subject}}</p>
          </div>
        </div>
      </div>

      <div id="comments" class="comments block">
        <h2>评论</h2>

        <div v-if="comments">
          <div class="comment" v-for="comment in comments" :key="comment.id">
            <div class="header" v-once>
              <div class="author-info">
                <img class="avatar avatar-round avatar-sm" :src="comment.user.avatar" alt="用户头像">
                <span class="nick">{{comment.user.nick}}</span>
                <time>{{comment.createdAtParsed.format('MM月DD日 HH:mm')}}</time>
              </div>
              <div class="reply" @click="gotoComment(comment.id, comment.user.nick, comment.content)">
                <i class="bi bi-reply-comment"></i>回复
              </div>
            </div>
            <!-- 不要换行，避免出现换行符 -->
            <div class="comment-content" v-once><div class="quote" v-if="comment.parent"><span class="nick">{{comment.parent.user.nick}}:</span>{{comment.parent.content}}</div>{{comment.content}}</div>
          </div>
        </div>

        <bd-loading class="comment-loading" v-if="isCommentLoading"></bd-loading>
        <error class="comment-error" v-else-if="isCommentError" @retry="fetchComments()"></error>
        <div class="no-comments" v-else-if="!comments.length"><i class="bi bi-no-comment"></i> 暂无评论</div>
        <div class="no-more-comments" v-else-if="isCommentOnLatest">到底咯~</div>
        <div class="more-comments" v-else @click="fetchComments()">加载更多评论</div>
      </div>

      <footer
        class="tool-bar"
        style="position:fixed; bottom:0;"
        v-show="!(isVideoPlayed && isLandscape)"
        v-if="itemInfo.column.paid"
        ref="toolBar"
      >
        <div class="icon view">{{itemInfo.current.viewTotal}}人看过</div>
        <div class="icon" @click="togglePraise()" :class="{'active': itemInfo.current.currentUserInfo.praised}">
          <i class="bi bi-praise"></i>{{itemInfo.current.praisedTotal}}
        </div>
        <div class="icon" @click="gotoComment()">
          <i class="bi bi-comment2"></i>
        </div>
      </footer>

      <footer class="payment" v-show="!(isVideoPlayed && isLandscape)" v-if="!itemInfo.column.paid">
        <button class="button button-outline" v-if="false">赠送给好友</button>
        <button class="button button-primary" @click="pay()"><span class="origin-fee"
                                                                   v-if="originFee">{{originFee}}</span>{{btnText}}
        </button>
      </footer>
    </div>

    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .main {
    position: relative;
    background-color: $color-gray5;

    .block {
      box-shadow: 0 2px 2px rgb(236, 236, 236);
      margin-bottom: 10px;
      background-color: $color-w;
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
        height: 100vw;
        transition: height .5s;
      }

      @media(max-width: 1024px) and (orientation: landscape) {
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

    .content {
      padding: 20px 0;
    }

    .title {
      padding: 0 20px 30px;

      h1 {
        font-size: 24px;
        line-height: 1.25em;
        color: $color-dark-gray;
        padding-bottom: 15px;
        font-weight: 500;
        word-break: break-all;
      }

      .talk-info {
        display: flex;
        align-items: center;
        overflow: hidden;

        .author-info {
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

    .audio-bar {
      margin: 0 20px 30px;
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

    .relative-items {
      display: flex;
      padding: 30px 0 10px;

      .item {
        flex-grow: 1;
        flex-basis: 50%;
        overflow: hidden;

        .item-cover {
          position: relative;
          max-height: 100px;
          overflow: hidden;

          &:before {
            content: '';
            display: block;
            padding-top: 56.25%;
          }

          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .text {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, .5);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: $font-size-lg;
            color: $color-w;
          }
        }

        .item-title {
          font-size: $font-size-md;
          color: $color-gray3;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-top: 15px;
          text-align: center;
          padding: 0 10px;
        }
      }
    }

    .comments {
      padding: 15px 15px 65px;
      box-shadow: none;
      margin-bottom: 0;

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
              margin-left: 10px;
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

        .comment-content {
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
        height: 50px;
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

    .tool-bar {
      display: flex;
      height: 46px;
      background-color: rgb(10, 10, 23);
      max-width: 1024px;
      width: 100%;

      .icon {
        line-height: 1em;
        font-size: $font-size-sm;
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

        &.active {
          color: $color-brand;
        }

        .bi {
          margin-right: 5px;
        }

        .bi-praise {
          font-size: $font-size-lg;
        }

        .bi-favorite {
          font-size: $font-size-lg;
        }

        .bi-comment2 {
          font-size: $font-size-md;
        }
      }

      .view {
        flex-grow: 1;

        .bi {
          font-size: 16px;
        }
      }
    }

    .payment {
      position: fixed;
      width: 100%;
      bottom: 0;
      background-color: $color-w;
      display: flex;

      .button {
        border-radius: 0;
        height: 50px;
        line-height: 50px;
      }

      .button-primary {
        flex-grow: 1;
      }

      .button-outline {
        width: 40%;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {isOnLargeScreen, isAndroid, isiOS, setScrollPosition, setTitle} from '../../shared/utils/utils';
  import {getColumnItemDetail, listComments, praise, unpraise} from '../../shared/api/column.api';
  import {ZaojiuPlayer, ZaojiuPlayerInstance, PlayerEvent} from "zaojiu-player";
  import {ColumnItemDetail, ColumnItemCommentModel} from "../../shared/api/column.model";
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {Store} from "../../shared/utils/store";
  import audioBar from "../../shared/audio-bar.comp.vue";


  const COMMENT_COUNT = 20;

  @Component({
    components: {
      audioBar: audioBar,
    }
  })
  export default class ContentComponent extends Vue {
    id = '';
    columnId = '';
    originY = 0;
    isOnScreen = isOnLargeScreen;
    isVideoPlayed = false;
    isLandscape = false;
    coverUrl = '';
    defaultCoverUrl = '/assets/img/default-cover.jpg';
    tabIndex = 0;
    emphasisActiveIndex = -1;
    player: ZaojiuPlayerInstance;
    itemInfo = new ColumnItemDetail({});
    isLoading = false;
    isError = false;
    comments: ColumnItemCommentModel[] = [];
    isCommentLoading = false;
    isCommentError = false;
    isCommentOnLatest = false;
    userInfo = getUserInfoCache();

    created() {
      this.columnId = this.$route.params['id'];
      this.id = this.$route.params['itemId'];

      this.setViewedColumnItem();
      this.initData();
      this.fetchComments();
    }

    @Watch('$route.name')
    refreshComments() {
      if (this.$route.name === 'column.item.main') {
        this.columnId = this.$route.params['id'];
        this.id = this.$route.params['itemId'];
        this.comments = [];
        this.fetchComments();
        setScrollPosition('#comments');
      }
    }

    get originFee(): string {
      if (this.itemInfo.column.originFee.value && this.itemInfo.column.originFee.value !== this.itemInfo.column.totalFee.value) {
        return this.itemInfo.column.originFee.toYuan();
      }

      return '';
    }

    get btnText(): string {
      if (this.userInfo && this.userInfo.isMember) {
        if (this.itemInfo.column.memberFee.value === 0) {
          return `会员免费`;
        } else {
          return `会员价: ${this.itemInfo.column.memberFee.toYuan()}`;
        }
      } else {
        if (this.itemInfo.column.totalFee.value === 0) {
          return `限时免费`;
        } else {
          return `支付: ${this.itemInfo.column.totalFee.toYuan()}`;
        }
      }
    }

    setViewedColumnItem() {
      const latestViewedColumnItem: { [key: string]: string } = Store.localStore.get('latestViewedColumnItem') || {};
      latestViewedColumnItem[this.columnId] = this.id;
      Store.localStore.set('latestViewedColumnItem', latestViewedColumnItem);
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;

      try {
        this.itemInfo = await getColumnItemDetail(this.id);
      } catch (e) {
        this.isError = true;
        throw e;
      } finally {
        this.isLoading = false;
      }

      if (this.itemInfo.current.isTypeVideo) this.prepareVideo();
      this.coverUrl = this.itemInfo.current.coverSmall11Url;
      if (!this.isChildActived()) setTitle(this.itemInfo.current.subject);
    }

    async fetchComments() {
      this.isCommentLoading = true;
      this.isCommentError = false;

      try {
        const lastMarker = this.comments.length ? `$lt${this.comments[this.comments.length - 1].createdAt}` : '';
        const comments = await listComments(this.id, COMMENT_COUNT + 1, lastMarker);
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

    async togglePraise() {
      this.itemInfo.current.currentUserInfo.praised = !this.itemInfo.current.currentUserInfo.praised;
      this.itemInfo.current.praisedTotal = this.itemInfo.current.currentUserInfo.praised ? this.itemInfo.current.praisedTotal + 1 : this.itemInfo.current.praisedTotal - 1;
      const promise = this.itemInfo.current.currentUserInfo.praised ? praise(this.id) : unpraise(this.id);
      await promise;
    }

    prepareVideo() {
      System.import('zaojiu-player').then((player: ZaojiuPlayer) => {
        this.player = new player({
          element: 'player',
          playList: [{
            src: this.itemInfo.current.videoUrl,
            quality: '标清',
            mimetype: 'video/mp4'
          }],
        });
        this.player.event$.subscribe((e: PlayerEvent) => {
          switch (e.type) {
            case 'play':
            case 'error':
              this.isVideoPlayed = true;
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
      const query: { [key: string]: string } = {title: encodeURIComponent(this.itemInfo.current.subject)};

      if (id && nick && content) {
        query['request'] = encodeURIComponent(JSON.stringify({
          id: id,
          nick: nick,
          content: content
        }));
      }

      this.$router.push({path: `/columns/${this.columnId}/items/${this.id}/post-comment`, query: query});
    }

    touchStart(e: TouchEvent) {
      if (!this.$refs['toolBar']) return;

      this.originY = e.touches[0].clientY;
    }

    touchMove(e: TouchEvent) {
      if (!this.$refs['toolBar']) return;

      const clientY = e.touches[0].clientY;

      if (this.originY - clientY > 10 && (this.$refs['toolBar'] as HTMLElement).style.position !== 'absolute') {
        (this.$refs['toolBar'] as HTMLElement).style.bottom = '-46px';
        (this.$refs['toolBar'] as HTMLElement).style.transition = 'bottom 0.3s ease';
        setTimeout(() => {
          (this.$refs['toolBar'] as HTMLElement).style.bottom = '0px';
          (this.$refs['toolBar'] as HTMLElement).style.position = 'absolute';
        }, 300);
      } else if (clientY - this.originY > 10 && (this.$refs['toolBar'] as HTMLElement).style.position !== 'fixed') {
        (this.$refs['toolBar'] as HTMLElement).style.bottom = '-46px';
        (this.$refs['toolBar'] as HTMLElement).style.position = 'fixed';
        (this.$refs['toolBar'] as HTMLElement).style.transition = '';
        setTimeout(() => {
          (this.$refs['toolBar'] as HTMLElement).style.bottom = '0px';
          (this.$refs['toolBar'] as HTMLElement).style.transition = 'bottom 0.3s ease';
        });
      }
    }

    isChildActived() {
      return this.$router.currentRoute.name !== 'column.item.main';
    }

    gotoRelativeItem(item: ColumnItemDetail) {
      // TODO: 判断收费，是否ready
    }

    pay() {
      // TODO: 专栏付费
    }
  }
</script>
