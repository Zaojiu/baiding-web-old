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
            <img class="long-img"
                 alt="封面图"
                 :src="coverUrl"
                 @error="coverUrl = defaultCoverUrl"/>
                 />
            <section class="talk-info" ref="content">
              <div class="categories" v-if="formatedCategories">{{formatedCategories}}</div>
              <h1>{{talkInfo.subject}}</h1>
              <time>{{talkInfo.publishAtParsed.format('YYYY年MM月DD日')}}</time>
            </section>
            <section class="article article-content" v-html="talkInfo.content" v-once></section>
            <div class="bot-footer">没有更多了</div>
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
    .long-img {
      width: 100vw;
    }
    .tab-content-container {
      overflow: hidden;

      .tab-content-inner {
        white-space: nowrap;
        transition: transform .3s;

        .tab-content {
          font-size: 0;
        }

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
    .article-content{
      p{
        margin: 0;
        margin-bottom: 24px;
      }
      figure{
        margin-bottom: 24px;
        .p1{
          font-size: 14px;
          color:rgb(128,128,128);
          text-align: center;
          padding-top: 16px;
        }
      }
    }
    .bot-footer{
      font-size: 14px;
      line-height: 16px;
      margin: 36px auto;
      text-align: center;
      color:rgb(166,166,166);
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {TalkInfoModel} from "../../shared/api/talk.model";
  import {
    getTalkInfo
  } from '../../shared/api/talk.api';
  import appDownloadTips from '../../shared/app-download-tips.comp.vue';
  import {setTitle} from '../../shared/utils/title';
  import {callHandler, initIOS} from "../../shared/utils/ios";
  import {isInApp} from '../../shared/utils/utils';

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
    isAppDownloadTipsShow = true;
    contentDom: any;
    isContentChange = false;
    isInApp: boolean;

    created() {
      this.id = this.$route.params['id'];
      this.isInApp = isInApp;
      this.initData();
    }

    mounted() {
      if (this.isInApp) {
        window.addEventListener('scroll', this.handelScroll);
      }
      this.$nextTick(() => {
        this.contentDom = (this.$refs as any);
      })
    }

    @Watch('$route.name')
    refreshComments() {
      if (this.$route.name === 'topic_post.main') {
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
