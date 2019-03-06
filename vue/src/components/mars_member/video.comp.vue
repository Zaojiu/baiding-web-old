<template>
  <div class="container">
    <div v-if="isMember" class="member-content">
      <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
      <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
      <div class="main" v-else>
        <div class="video-list scrollable"
             v-scroll-view="{onBottom: fetchMoreList}"
        >
          <ul class="list-group"
              v-if="list.length !== 0">
            <li class="list-item" v-for="item in data.list">
              <div @click="goTalk(item.id)">
                <div class="item-img">
                  <img :src="item.coverUrl"
                       alt="视频封面"
                       @error="setDefaultUrl"
                  >
                  <span class="left">{{item.tag}}</span>
                  <span class="right">{{item.duration}}</span>
                </div>
                <div class="item-text">
                  <h3>{{item.title}}</h3>
                  <p>{{item.name}} · {{item.speakerTitle}}{{item.speakerCompany}}</p>
                </div>
              </div>
            </li>
          </ul>
          <div class="no-more" v-if="!marker">已显示全部内容</div>
          <footer v-if="marker&&marker.length !== 0"
                  :class="{show: isListLoading, hide: !isListLoading}">
            <bd-loading></bd-loading>
          </footer>
        </div>
      </div>
    </div>
    <div v-if="!isMember" class="member-card">
      <div v-for="item in listImg" class="image-cover">
        <img :src="item"/>
      </div>
      <ul v-if="listText.length">
        <li v-for=" text in listText "><span class="dot"></span><span v-html="text"></span></li>
      </ul>
      <div class="gold-btn" @click="goToVideo()">
        <span>查看专属视频</span><i class="bi bi-member-video-enter"></i>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100%;
    overflow: auto;

    .member-content {
      height: 100%;
    }

    .video-list {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: auto;
      padding-top: 24px;
    }

    .main {
      position: relative;
      color: rgb(242, 242, 242);
      height: 100%;

      .app-download-tips {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }
      .no-more {
        text-align: center;
        font-size: 14px;
        margin: 10px 0;
        color: #808080;
      }

      .get-more {
        text-align: center;
        padding: 0 0 30px 0;
      }

      h1 {
        font-size: 28px;
        line-height: 28px;
        padding: 20px 0 20px 20px;
        letter-spacing: -0.7px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, .5);
      }

      .list-group {
        .list-item {
          & + li {
            margin-top: 30px;
          }
        }
        .item-img {
          font-size: 0;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background-color: #000;
          position: relative;
          padding-top: 56.25%;
          overflow: hidden;
          img {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          span {
            font-size: 12px;
            line-height: 12px;
            position: absolute;
            bottom: 8px;
          }
          .left {
            left: 16px;
          }
          .right {
            right: 16px;
          }
        }
        .item-text {
          background: linear-gradient(90deg, rgba(179, 151, 100, 1), rgba(130, 96, 33, 1));
          padding: 12px 20px 24px 20px;
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          h3 {
            color: rgb(229, 229, 292);
            font-size: 20px;
            line-height: 26px;
          }
          p {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            color: rgb(242, 242, 242);
            font-size: 16px;
            line-height: 16px;
            margin-top: 8px;
          }
        }
      }

      footer {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 0;

        &.fullscreen {
          height: 100vh;
        }

        &.show {
          opacity: 1;
        }

        &.hide {
          transition: 1s ease all;
          opacity: 0;
        }
      }

    }

    .member-card {
      color: #fff;
      padding-top: 24px;

      .image-cover {
        font-size: 0;
        img {
          width: 100%;
        }
        & + .image-cover {
          margin-top: 32px;
        }
      }
      ul {
        margin-top: 12px;
        li {
          padding: 12px 0 0 0;
          font-size: 15px;
          line-height: 24px;
          color: rgb(217, 217, 217);
          font-weight: bold;
          .dot {
            display: inline-block;
            height: 8px;
            width: 8px;
            border-radius: 4px;
            background-color: rgb(217, 217, 217);
            margin-right: 8px;
          }
          span {
            vertical-align: middle;
          }
        }
      }
      .gold-btn {
        margin-top: 24px;
        width: 144px;
        font-size: 14px;
        padding: 5px 0;
        text-align: center;
        border: 1px solid rgb(214, 173, 96);
        border-radius: 4px;
        color: rgb(214, 173, 96);
        box-sizing: border-box;
        position: relative;
        .bi {
          font-size: 16px;
          vertical-align: sub;
          padding-left: 6px;
        }
        &:after {
          display: block;
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          width: 144px;
          height: 32px;
          background: linear-gradient(90deg, rgba(0, 0, 0, .1), rgba(0, 0, 0, 0.6));
          border-radius: 4px;
        }
      }
      p {
        margin: 12px 0;
        color: rgb(128, 128, 128);
        font-size: 13px;
        line-height: 16px;
      }
      .ps {
        color: #d6ad60;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import appDownloadTips from '../../shared/app-download-tips.comp.vue';
  import {setTitle} from '../../shared/utils/title';
  import {getMemberVideoList} from '../../shared/api/member-video.api'
  import {scrollView} from '../../shared/scroll-view/scroll-view.directive';
  import {host} from '../../env/environment';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {isInApp} from "../../shared/utils/utils";
  import {initIOS, callHandler} from "../../shared/utils/ios";

  @Component({
    components: {
      appDownloadTips: appDownloadTips,
    },
    directives: {
      scrollView
    },
  })
  export default class MemberVideoComponent extends Vue {
    isLoading = false;
    isError = false;
    isAppDownloadTipsShow = true;
    isInApp = isInApp;
    data: any;
    list = <any>[];
    marker: string;
    isListLoading = false;
    defaultCoverUrl = '/assets/img/default-cover.jpg';
    userInfo: UserInfoModel;
    isMember = false;
    listText: string[] = [];
    listImg: string[] = [];

    created() {
      setTitle('专属视频');
      this.initData();
    }

    async initData() {
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {

      }
      if (this.userInfo && this.userInfo.member.valid) {
        this.isLoading = true;
        this.isError = false;
        this.isMember = true;
        try {
          this.data = await getMemberVideoList();
          this.list = this.data.list;
          this.marker = this.data.marker;
        } catch (e) {
          this.isError = true;
          throw e;
        } finally {
          this.isLoading = false;
        }
      } else {
        this.listImg = [
          'https://baiding-pub.zaojiu.com/member/member-only-video.png'
        ];
        this.listText = [
          '专享演讲者深度访谈及幕后花絮'
        ];
      }
    }

    async getMore() {
      this.isListLoading = true;
      try {
        let data = await getMemberVideoList(this.data.marker);
        this.marker = data.marker;
        if (data.list.length > 0) {
          data.list.forEach((item: any) => {
            this.list.push(item);
          })
        }

      } catch (e) {
        this.isError = true;
        throw e;
      } finally {
        this.isListLoading = false;
      }
    }

    fetchMoreList() {
      if (this.list.length === 0 || this.marker.length === 0) {
        return;
      }
      this.getMore();
    }

    setDefaultUrl(event: any) {
      event.target.src = this.defaultCoverUrl;
    }

    async goTalk(id: string) {
      if (this.isInApp) {
        await initIOS();
        callHandler('pushSpeaker', id);
      } else {
        location.href = `${host.self}/talks/${id}`;
      }
    }

    async goToVideo() {
      if (this.isInApp) {
        await initIOS();
        callHandler('pushMemberVideo2', '');
      } else {
        this.$router.push({path: '/member/video'});
      }
    }

  }
</script>
