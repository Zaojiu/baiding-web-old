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
            <li class="list-item" v-for="item in list">
              <div class="item-img">
                <img :src="item.coverUrl"
                     alt="封面"
                >
              </div>
              <div class="item-text">
                <p>{{item.title}}</p>
              </div>
              <div class="item-action">
                <button @click="download(item.downloadUrl)">下载</button>
              </div>
            </li>
          </ul>
          <div class="no-content" v-if="list.length === 0">暂时没有内容</div>
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
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100%;
    background-color: rgb(26, 26, 26);

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
      overflow-x: hidden;
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
        color: #808080;
        border-top: 1px solid #262626;
        padding: 10px 0;
      }
      .no-content {
        text-align: center;
        font-size: 14px;
        padding: 24px 0;
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, .5);
      }
      .list-group {
        padding: 0 20px;
        .list-item {
          padding: 20px 0;
          display: flex;
          flex-direction: row;

          & + li {
            border-top: 1px solid rgb(38, 38, 38);
          }

          .item-img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            overflow: hidden;

            img {
              width: 100%;
            }
          }
          .item-text {
            width: calc(100% - 120px);
            padding: 0 20px 0 8px;
            color:rgb(213, 181, 120);

            p {
              width: 100%;
              font-size: 14px;
              line-height: 20px;
              margin: 0;
              padding: 0;
              vertical-align: baseline;
              border: 0;
              background: transparent;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
          .item-action {
            width: 80px;
            button {
              color: rgb(213, 181, 120);
              width: 100%;
              padding: 9px 0;
              font-size: 14px;
              line-height: 14px;
              border: 1px solid rgb(213, 181, 120);
              border-radius: 4px;
              position: relative;

              &:after {
                display: block;
                content: '';
                position: absolute;
                top: -1px;
                left: -1px;
                width: 82px;
                height: 36px;
                background: linear-gradient(90deg, rgba(0, 0, 0, .1), rgba(26, 26, 26, 0.6));
                border-radius: 4px;
              }
            }
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
  import {getDownloadResourcesList} from '../../shared/api/download-resources.api'
  import {scrollView} from '../../shared/scroll-view/scroll-view.directive';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {showTips} from '../../store/tip';
  import {isiOS} from "../../shared/utils/utils";

  @Component({
    components: {
      appDownloadTips: appDownloadTips,
    },
    directives: {
      scrollView
    },
  })
  export default class DownloadResourcesComponent extends Vue {
    isLoading = false;
    isError = false;
    isAppDownloadTipsShow = true;
    data: any;
    list = <any>[];
    marker: string;
    isListLoading = false;
    userInfo: UserInfoModel;
    isMember = false;
    listText: string[] = [];
    listImg: string[] = [];

    created() {
      setTitle('干货下载');
      this.initData();
    }

    async initData() {

      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {

      }

      this.isMember = this.userInfo && this.userInfo.member.valid;

      if (this.isMember) {
        await this.getDownloadList();
      } else {
        this.listImg = [
          'https://baiding-pub.zaojiu.com/member/member-download.png'
        ];
        this.listText = [
          '可订阅并下载近千个专属演讲视频',
          '可下载收藏500多个造就演讲PPT'
        ];
      }

    }

    async getDownloadList() {
      this.isLoading = true;
      this.isError = false;
      try {
        this.data = await getDownloadResourcesList();
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
        let data = await getDownloadResourcesList(this.data.marker);
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

    download(url: string) {
      if (this.userInfo.member.valid) {

        if(isiOS){
          showTips('请到造就app中下载');
          return false;
        }

        let $form = $('<form method="GET"></form>');
        $form.attr('action', url);
        $form.appendTo($('body'));
        $form.submit();

      } else {
        showTips('会员专属');
      }
    }


    fetchMoreList() {
      if (this.list.length === 0 || this.marker.length === 0) {
        return;
      }
      this.getMore();
    }
  }
</script>
