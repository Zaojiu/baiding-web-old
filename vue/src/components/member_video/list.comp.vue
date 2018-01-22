<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else>
      <top-nav></top-nav>
      <!--<app-download-tips class="app-download-tips" v-if="isAppDownloadTipsShow"
                         @close="isAppDownloadTipsShow = false"></app-download-tips>-->
      <h1 class="title">
        专属视频
      </h1>
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

    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    min-height: 100vh;
    background-color: rgb(36, 36, 36);

    .video-list{
      position: absolute;
      top: 118px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: auto;
    }
  }

  .main {
    position: relative;
    color: rgb(242, 242, 242);
    height: 100vh;

    .app-download-tips {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .no-more {
      text-align: center;
      font-size: 14px;
      padding: 0 0 24px 0;
      color:#808080;
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
      padding: 24px 20px;
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
        min-height: 40vw;
        img {
          width: 100%;
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
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import appDownloadTips from '../../shared/app-download-tips.comp.vue';
  import {setTitle} from '../../shared/utils/title';
  import {getMemberVideoList} from '../../shared/api/member-video.api'
  import {scrollView} from '../../shared/scroll-view/scroll-view.directive';
  import {host} from '../../env/environment';

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
    data: any;
    list = <any>[];
    marker: string;
    isListLoading = false;
    defaultCoverUrl = '/assets/img/default-cover.jpg';

    created() {
      setTitle('专属视频');
      this.initData();
    }

    async initData() {
      this.isLoading = true;
      this.isError = false;

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

    setDefaultUrl(event:any){
      event.target.src = this.defaultCoverUrl;
    }

    goTalk(id: string) {
      location.href = `${host.self}/talks/${id}`
    }

  }
</script>
