<template>
  <div
    class="live-list scrollable"
    v-scroll-view="{onBottom: onBottom}"
  >
    <div class="main-list">
      <div class="live-info-block" v-for="liveInfo in lives" @click="gotoLiveInfo(liveInfo.id)">
        <live-cover :liveInfo="liveInfo"></live-cover>

        <div class="info">
          <div class="title">{{liveInfo.subject}}</div>
          <div class="time">{{liveTime[liveInfo.id]}}</div>
          <div class="desc" v-if="liveInfo.desc">{{liveInfo.desc}}</div>
        </div>
      </div>

      <div class="bottom" v-if="isOnLatest && lives.length">已显示全部内容</div>
    </div>

    <footer v-if="!isOnLatest" :class="{show: isLoadingShown, hide: !isLoadingShown, fullscreen: lives.length === 0}">
      <bd-loading></bd-loading>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
  .live-list {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: $color-gray4;
    overflow: auto;

    .main-list {
      .live-info-block {
        margin-bottom: 10px;
        background-color: $color-w;

        .info {
          padding: 20px;

          .title {
            color: $color-dark-gray2;
            font-size: $font-size-20;
            line-height: 1.3em;
            word-break: break-all;
          }

          .time {
            font-size: $font-size-12;
            color: $color-gray;
            margin-top: 6px;
          }

          .desc {
            margin-top: 8px;
            font-size: $font-size-14;
            color: $color-gray6;
            line-height: 1.42em;
            white-space: pre-line;
            text-overflow: ellipsis;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
        }
      }

      .live-info-block + .bottom {
        margin-top: -10px;
      }

      .bottom {
        height: 62px;
        line-height: 62px;
        text-align: center;
        font-size: 16px;
        color: $color-gray;
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
  import {Component} from 'vue-property-decorator';
  import {scrollView} from '../../shared/scroll-view/scroll-view.directive';
  import {setDefaultShareInfo} from '../../shared/utils/share';
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {appConfig} from "../../env/environment";
  import {LiveInfoModel} from "../../shared/api/lives.model";
  import {listNow} from '../../shared/api/lives.api';
  import liveCover from '../../shared/live-cover.comp.vue';
  import {praseLiveTime} from '../../shared/utils/utils';

  const LOAD_SIZE = 20;

  @Component({
    components: {
      liveCover,
    },
    directives: {
      scrollView
    },
  })
  export default class LivesComponent extends Vue {
    lives: LiveInfoModel[] = [];
    liveTime: { [liveId: string]: string } = {};
    isOnLatest = false;
    isLoadingShown = false;

    created() {
      this.loadLives();
      this.setShareInfo();
    }

    setShareInfo() {
      let userInfo;
      try {
        userInfo = getUserInfoCache(false);
      } catch (e) {}

      const shareTitle = `${userInfo ? userInfo.nick : '我'}正在使用${appConfig.name}，发现更多经验分享`
      setDefaultShareInfo(shareTitle);
    }

    async loadLives(markerId?: string, size = LOAD_SIZE) {
      this.isLoadingShown = true;

      let lives: LiveInfoModel[] = [];
      try {
        lives = await listNow(markerId, size + 1);
      } finally {
        this.isLoadingShown = false;
      }

      for (let liveInfo of this.lives) {
        this.liveTime[liveInfo.id] = praseLiveTime(liveInfo);
      }

      if (lives.length < size + 1) {
        this.isOnLatest = true;
      } else {
        lives.pop();
      }

      this.lives = this.lives.concat(lives);
    }

    onBottom() {
      if (this.lives.length === 0 || this.isOnLatest) return;

      const lastId = this.lives[this.lives.length - 1].id;
      this.loadLives(lastId);
    }

    gotoLiveInfo(liveId: string) {
      this.$router.push({path: `/lives/${liveId}/info`});
    }
  }
</script>
