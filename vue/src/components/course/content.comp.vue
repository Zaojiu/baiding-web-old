<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else v-show="!isChildActived()">

      <top-nav v-if="!(isVideoPlayed && isLandscape)"></top-nav>

      <header :class="{
        'played': isVideoPlayed,
        'played-landscape': isVideoPlayed && isLandscape
      }">
        <div class="player" id="player"
             @click="itemInfo.current.isTypeVideo ? isVideoPlayed = true : false"></div>

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
                class="avatar avatar-round avatar-25"
                :src="itemInfo.course.speaker && itemInfo.course.speaker.coverUrl || '/assets/img/zaojiu-logo.jpg'"
                alt="发布人头像"
              >
              <span
                class="nick">{{itemInfo.course.speaker && itemInfo.course.speaker.subject ? itemInfo.course.speaker.subject : '造就'}}</span>
            </div>

            <time>{{itemInfo.current.publishAtParsed.format('YYYY年MM月DD日')}}</time>
          </div>
        </div>

        <audio-bar class="audio-bar" v-if="itemInfo.current.isTypeAudio"
                   :audioUrl="itemInfo.current.audioUrl"></audio-bar>

        <div class="article article-content" v-html="itemInfo.current.content"></div>

        <div class="relative-items" v-if="itemInfo.prev || itemInfo.next">
          <div class="item" v-if="itemInfo.prev" @click="gotoRelativeItem(itemInfo.prev)">
            <div class="item-cover">
              <span class="text">{{prevBtnText}}</span>
            </div>
            <p class="item-title">{{itemInfo.prev.subject}}</p>
          </div>
          <div class="item" v-if="itemInfo.next" @click="gotoRelativeItem(itemInfo.next)">
            <div class="item-cover">
              <span class="text next">{{nextBtnText}}</span>
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
                <img class="avatar avatar-round avatar-25" :src="comment.user.avatar" alt="用户头像">
                <span class="nick">{{comment.user.nick}}</span>
                <time>{{comment.createdAtParsed.format('MM月DD日 HH:mm')}}</time>
              </div>
            </div>
            <!-- 不要换行，避免出现换行符 -->
            <div class="comment-content" v-once>
              <div class="quote" v-if="comment.parent"><span class="nick">{{comment.parent.user.nick}}:</span>{{comment.parent.content}}
              </div>
              <div>{{comment.content}}</div>
            </div>
          </div>
        </div>

        <bd-loading class="comment-loading" v-if="isCommentLoading"></bd-loading>
        <error class="comment-error" v-else-if="isCommentError" @retry="fetchComments()"></error>
        <div class="no-comments" v-else-if="!comments.length"><i class="bi bi-no-comment"></i> 暂无评论</div>
        <div class="no-more-comments" v-else-if="isCommentOnLatest">到底咯~</div>
        <div class="more-comments" v-else @click="fetchComments()">加载更多评论</div>
        <div ref="bottom"></div>
      </div>
      <footer class="tool-bar" v-show="!(isVideoPlayed && isLandscape)" ref="toolBar"
              :class="{'footer-show': isToolbarShow,'footer-hide': !isToolbarShow}">
        <div class="icon" @click="togglePraise()" :class="{'active': isPraised}">
          <div class="font-content"><i class="bi bi-new-praise"></i></div>
          <div><span>点赞 {{itemInfo.current.praisedTotal}}</span></div>
        </div>
        <div class="icon" @click="goComment">
          <div class="font-content"><i class="bi bi-new-comment"></i></div>
          <div><span>评论 {{itemInfo.current.commentTotal}}</span></div>
        </div>
      </footer>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    overflow: hidden;
  }

  .main {
    position: relative;
    height: 100vh;
    overflow: auto;
    background-color: $color-gray5;

    .tool-bar {
      position: fixed;
      width: 100%;
      max-width: 1024px;
      bottom: 0;
      display: flex;
      height: 50px;
      background-color: rgb(10, 10, 23);
      display: -webkit-box;
      display: -ms-flexbox;
      z-index: 1;
      margin: 0 auto;

      .icon {
        flex: 1;
        line-height: 1em;
        font-size: $font-size-14;
        color: $color-w;
        display: flex;
        flex-direction: column;
        div {
          text-align: center;
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          span {
            font-size: 12px;
          }
        }
        .font-content {
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

    .block {
      box-shadow: 0 2px 2px rgb(236, 236, 236);
      margin-bottom: 3px;
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
        //height: 56.25vw;
      }

      &.played-landscape:before {
        height: 100vh;
      }

      &:before {
        content: "";
        display: block;
        padding-top: 56.25%;
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
        -webkit-box-pack: end; // for old ios browser
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

      .live-cover-event {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column-reverse;
        -webkit-box-pack: end;

        .three-tips {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 1);
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          font-size: 14px;
          text-align: center;
          color: #D5B578;
          display: table;
          .three-tips-content {
            display: table-cell;
            vertical-align: middle;
            .three-btn {
              position: relative;
              z-index: 3;
              font-size: 16px;
              text-align: center;
              padding: 12px 40px;
              color: #fff;
              background: linear-gradient(rgba(204, 169, 104, 1), rgba(154, 120, 58, 1));
              border-radius: 4px;
              margin-top: 20px;
              .bi {
                padding-right: 4px;
                position: relative;
                top: -2px;
              }
            }
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
            font-size: $font-size-18;
            color: $color-w;
          }
          .next {
            background-color: rgba(0, 0, 0, .6);
          }
        }

        .item-title {
          font-size: $font-size-16;
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
      padding: 15px 15px 65px 15px;
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

    .payment {
      position: fixed;
      width: 100%;
      max-width: 1024px;
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
  import {isOnLargeScreen, isAndroid, isiOS} from '../../shared/utils/utils';
  import {getCourseItemDetail, praise, unpraise} from '../../shared/api/course.api';
  import {ZaojiuPlayer, ZaojiuPlayerInstance, PlayerEvent} from "zaojiu-player";
  import {CourseItemDetail, CourseItemContent, CourseItem, CourseItemCommentModel} from "../../shared/api/course.model";
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {Store} from "../../shared/utils/store";
  import {OrderObjectType, PostOrderObject} from '../../shared/api/order.model';
  import {createOrder} from '../../shared/api/order.api';
  import {ApiError} from '../../shared/api/xhr';
  import {ApiCode, ApiErrorMessage} from '../../shared/api/code-map.enum';
  import {pay} from '../../shared/api/pay.api';
  import audioBar from "../../shared/audio-bar.comp.vue";
  import {showTips} from '../../store/tip';
  import {setPaymentNone} from "../../store/payment";
  import {setTitle} from '../../shared/utils/title';
  import {listComments} from '../../shared/api/course.api';
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from '../../shared/utils/share';
  import {isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";

  const COMMENT_COUNT = 20;

  @Component({
    components: {
      audioBar: audioBar,
    }
  })
  export default class ContentComponent extends Vue {
    id = '';
    courseId = '';
    originY = 0;
    isOnScreen = isOnLargeScreen;
    isVideoPlayed = false;
    isLandscape = false;
    coverUrl = '';
    defaultCoverUrl = '/assets/img/default-cover.jpg';
    tabIndex = 0;
    emphasisActiveIndex = -1;
    player: ZaojiuPlayerInstance;
    itemInfo = new CourseItemDetail({});
    isLoading = false;
    isError = false;
    isListener = false;
    isPraised = false;
    isComment = false;
    isChangeItem = true;

    comments: CourseItemCommentModel[] = [];
    isCommentLoading = false;
    isCommentError = false;
    isCommentOnLatest = false;

    userInfo = getUserInfoCache();
    isPaying = false;
    isToolbarShow = false;
    invitedBy = '';
    marker = '';

    created() {
      this.courseId = this.$route.params['courseId'];
      this.itemChanged();
    }

    @Watch('$route')
    itemChanged() {
      this.id = this.$route.params['itemId'];
      if (!this.fromPaymentResult()) {
        this.initData();
        if (this.isChangeItem) {
          this.isChangeItem = false;
          this.initComments(false);
          this.setViewedCourseItem();
        } else {
          this.initComments(true);
        }
      }
      /*if (isInWechat) {
        this.share();
      }*/
    }

    async share() {
      const {id, itemId} = this.$route.params;
      await initWechat();
      setShareInfo(this.itemInfo.current.subject,
        '',
        `${host.assets}/assets/img/zaojiu-logo.jpg`,
        `${host.self}/course/${id}/items/${itemId}`);
    }

    fromPaymentResult() {
      const payResult = this.$route.query['payResult'];

      if (!payResult) return false;

      if (payResult === 'success') {
        showTips('支付成功');
        setPaymentNone();
      } else if (payResult === 'cancel') {
        showTips('订单未支付');
      } else {
        showTips('支付失败，请重试');
        console.error(decodeURIComponent(payResult));
      }

      this.$router.back();

      return true;
    }

    get originFee(): string {
      if (this.itemInfo.course.originFee.value && this.itemInfo.course.originFee.value !== this.itemInfo.course.totalFee.value) {
        return this.itemInfo.course.originFee.toYuan();
      }

      return '';
    }

    get btnText(): string {
      if (this.userInfo && this.userInfo.isMember) {
        if (this.itemInfo.course.memberFee.value === 0) {
          return `会员免费`;
        } else {
          return `会员价: ${this.itemInfo.course.memberFee.toYuan()}`;
        }
      } else {
        if (this.itemInfo.course.totalFee.value === 0) {
          return `限时免费`;
        } else {
          return `支付: ${this.itemInfo.course.totalFee.toYuan()}`;
        }
      }
    }

    get prevBtnText() {
      const item = this.itemInfo.prev;
      if (item) {
        if (item.isStatusNotReady) {
          return '制作中';
        } else if (!this.itemInfo.course.paid) {
          return '付费看上篇';
        } else {
          return '上一篇';
        }
      }
    }

    get nextBtnText() {
      const item = this.itemInfo.next;
      if (item) {
        if (item.isStatusNotReady) {
          return '制作中';
        } else if (!this.itemInfo.course.paid) {
          return '付费看下篇';
        } else {
          return '下一篇';
        }
      }
    }

    setViewedCourseItem() {
      const latestViewedCourseItem: { [key: string]: string } = Store.localStore.get('latestViewedCourseItem') || {};
      latestViewedCourseItem[this.courseId] = this.id;
      Store.localStore.set('latestViewedCourseItem', latestViewedCourseItem);
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;
      this.invitedBy = this.$route.query['invited_by'];

      try {
        this.itemInfo = await getCourseItemDetail(this.id, this.invitedBy);
        this.isPraised = this.itemInfo.current.currentUserInfo.praised;
      } catch (e) {
        this.isError = true;
        if (e instanceof ApiError) {
          const code = e.code;
          if (code === ApiCode.ErrUnpay) {
            this.$router.push({path: `/course/${this.courseId}/cover`});
            showTips(ApiErrorMessage[code]);
            return;
          }
        }
        throw e;
      } finally {
        this.isLoading = false;
      }
      if (this.itemInfo.current.isTypeVideo) this.prepareVideo();
      this.coverUrl = this.itemInfo.current.cover169Url;
      if (!this.isChildActived()) setTitle(this.itemInfo.current.subject);
    }

    async initComments(needScroll: boolean) {
      this.comments = [];
      await this.fetchComments();
      if (needScroll) {
        (this.$refs['bottom'] as HTMLElement).scrollIntoView(true);
      }
    }

    async fetchComments() {
      this.isCommentLoading = true;
      this.isCommentError = false;

      try {
        const lastMarker = this.marker;
        const commentsData = await listComments(this.id, COMMENT_COUNT, lastMarker);
        const comments = commentsData.comments;
        this.marker = commentsData.marker;
        this.isCommentOnLatest = !this.marker;
        this.comments.push(...comments);
      } catch (e) {
        this.isCommentError = true;
        throw e;
      } finally {
        this.isCommentLoading = false;
      }
    }


    async togglePraise() {
      let oldStatus = this.isPraised;
      try {
        this.isPraised = !this.isPraised;
        this.itemInfo.current.praisedTotal = oldStatus ? this.itemInfo.current.praisedTotal - 1 : this.itemInfo.current.praisedTotal + 1;
        const promise = (!oldStatus) ? praise(this.id) : unpraise(this.id);
        await promise;
      } catch (e) {
      }
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

    goComment(id: string, nick: string, content: string) {
      const query: { [key: string]: string } = {title: encodeURIComponent(this.itemInfo.current.subject)};

      if (id && nick && content) {
        query['request'] = encodeURIComponent(JSON.stringify({
          id: id,
          nick: nick,
          content: content
        }));
      }

      this.$router.push({path: `/course/${this.courseId}/items/${this.id}/post-comment`, query: query});
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

    isChildActived() {
      return this.$router.currentRoute.name !== 'course.item.main';
    }

    gotoRelativeItem(item: CourseItemContent) {
      if (item.isStatusReady && this.itemInfo.course.paid) {
        this.isChangeItem = true;
        this.$router.push({path: `/course/${item.courseId}/items/${item.id}`});
      }
    }

    checkMobileBind() {
      if (!this.userInfo.isMobileBinded) {
        this.$router.push({path: '/mobile-bind-event', query: {redirectTo: this.$route.fullPath}});
        return false;
      }

      return true;
    }

    async createOrder() {
      if (!this.checkMobileBind) return;
      if (this.isPaying) return;

      this.isPaying = true;
      const orderQuery = new PostOrderObject(this.courseId, OrderObjectType.Course, 1);

      try {
        const orderMeta = await createOrder([orderQuery], [], false);
        await this.pay(orderMeta.orderNo);
      } catch (e) {
        if (e instanceof ApiError) {
          const code = e.code;

          if (code === ApiCode.ErrOrderNeedProcessOthers) {
            const oldOrderNum = e.originError.response && e.originError.response.data.data.orderNo;
            this.pay(oldOrderNum);
          } else {
            const errMessage = ApiErrorMessage[code] || `未知错误: ${code}`;
            showTips(errMessage);
          }

          throw e;
        }
      } finally {
        this.isPaying = false;
      }
    }

    async pay(orderNo: string) {
      await pay(orderNo);
      this.$router.push({path: `/course/${this.courseId}/items/${this.id}`, query: {payResult: 'success'}});
    }
  }
</script>
