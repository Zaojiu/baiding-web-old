<template>
  <div
    class="scroll-view scrollable"
    v-scroll-view="{onBottom: onBottom}"
  >
    <div class="main-list">
      <div class="live-info-block" v-for="liveInfo in lives" @click="gotoLiveRoomInfo(liveInfo.id)">
        <div class="admin-info">
          <div class="admin-info-wrapper" @click="gotoInfoCenter(liveInfo.admin.uid)">
            <img class="avatar" :src="liveInfo.admin.avatar" alt="主持人头像">
            <span class="nick">{{liveInfo.admin.nick}}</span>
          </div>
        </div>

        <div class="live-title-wrapper">
          <div class="live-title">{{liveInfo.subject}}</div>
          <span class="live-type text" v-if="liveInfo.isTypeText()"><i class="bi bi-paper2"></i>文字</span>
          <span class="live-type video" v-if="liveInfo.isTypeVideo()"><i class="bi bi-video"></i>视频</span>
        </div>

        <div class="live-info">
          <span class="time" >{{liveTime[liveInfo.id]}}</span>
          <span class="onlines-count">{{liveInfo.totalUsers > 999 ? '999+' : liveInfo.totalUsers}}人</span>
        </div>

        <div class="cover-container">
          <img class="cover" :src="covers[liveInfo.id]" alt="话题间封面">
          <!--<count-down class="count-down" [expectStartAt]="liveInfo.expectStartAt"-->
          <!--[countDownStatus]="liveInfo.isCreated()"></count-down>-->
          <span class="live-status living" v-if="liveInfo.isStarted()">直播中</span>
          <span class="live-status closed" v-if="liveInfo.isClosed()">已结束</span>
        </div>

        <div class="desc">{{liveInfo.desc}}</div>
      </div>

      <div class="bottom" v-if="isOnLatest && lives.length">
        <div class="word">已显示全部内容</div>
      </div>
    </div>

    <bd-loading
      v-if="!isOnLatest"
      class="loading-foot"
      :class="{show: isLoadingShown, hide: !isLoadingShown}"
    ></bd-loading>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import {scrollView} from '../../shared/scroll-view/scroll-view.directive';
  import {setDefaultShareInfo} from '../../shared/utils/share';
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {appConfig} from "../../env/environment";

  @Component({
    directives: {
      scrollView
    },
  })
  export default class LivesComponent extends Vue {
//    lives: LiveInfoModel[] = [];
//
//
//    created() {
//      this.setShareInfo();
//    }
//
//    setShareInfo() {
//      let userInfo;
//      try {
//        userInfo = getUserInfoCache(false);
//      } catch (e) {}
//
//      const shareTitle = `${userInfo ? userInfo.nick : '我'}正在使用${appConfig.name}，发现更多经验分享`
//      setDefaultShareInfo(shareTitle);
//    }
//
//    onTop() {
//    }
//
//    onBottom() {
//      if (this.livesList.length !== 0 && !this.isOnLatest) {
//        let lastId = this.livesList[this.livesList.length - 1].id;
//        this.getLists(lastId, this.loadSize).finally(() => {
//          this.scroller.hideFootLoading();
//        });
//      }
//    }
  }
</script>
