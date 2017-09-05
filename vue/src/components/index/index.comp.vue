<template>
  <!--<div-->
    <!--class="scroll-view scrollable"-->
    <!--v-scroll-view="{onTop: onTop, onBottom: onBottom, threshold: 50}"-->
  <!--&gt;-->
    <!--<div class="main-list">-->
      <!--<div class="live-info-block" v-for="liveInfo in livesList" @click="gotoLiveRoomInfo(liveInfo.id)">-->
        <!--<div class="admin-info">-->
          <!--<div class="admin-info-wrapper" @click="gotoInfoCenter(liveInfo.admin.uid)">-->
            <!--<img class="avatar" :src="liveInfo.admin.avatar" alt="主持人头像">-->
            <!--<span class="nick">{{liveInfo.admin.nick}}</span>-->
          <!--</div>-->
        <!--</div>-->

        <!--<div class="live-title-wrapper">-->
          <!--<div class="live-title">{{liveInfo.subject}}</div>-->
          <!--<span class="live-type text" v-if="liveInfo.isTypeText()"><i class="bi bi-paper2"></i>文字</span>-->
          <!--<span class="live-type video" v-if="liveInfo.isTypeVideo()"><i class="bi bi-video"></i>视频</span>-->
        <!--</div>-->

        <!--<div class="live-info">-->
          <!--<span class="time" >{{liveTime[liveInfo.id]}}</span>-->
          <!--<span class="onlines-count">{{liveInfo.totalUsers > 999 ? '999+' : liveInfo.totalUsers}}人</span>-->
        <!--</div>-->

        <!--<div class="cover-container">-->
          <!--<img class="cover" :src="covers[liveInfo.id]" alt="话题间封面">-->
          <!--&lt;!&ndash;<count-down class="count-down" [expectStartAt]="liveInfo.expectStartAt"&ndash;&gt;-->
                      <!--&lt;!&ndash;[countDownStatus]="liveInfo.isCreated()"></count-down>&ndash;&gt;-->
          <!--<span class="live-status living" v-if="liveInfo.isStarted()">直播中</span>-->
          <!--<span class="live-status closed" v-if="liveInfo.isClosed()">已结束</span>-->
        <!--</div>-->

        <!--<div class="desc">{{liveInfo.desc}}</div>-->
      <!--</div>-->

      <!--<div class="bottom" v-if="isOnLatest && livesList.length">-->
        <!--<div class="word">已显示全部内容</div>-->
      <!--</div>-->
    <!--</div>-->

    <!--<bd-loading *ngIf="!isOnLatest" class="loading-foot"-->
                <!--[ngClass]="{show: scroller.isFootLoadingShown, hide:!scroller.isFootLoadingShown}"></bd-loading>-->

  <!--</div>-->
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import {scrollView} from '../../shared/scroll-view/scroll-view.directive';

  @Component({
    directives: {
      scrollView
    },
  })
  export default class IndexComponent extends Vue {
    created() {
      location.reload();
    }

    onTop() {
    }

    onBottom() {
    }
  }
</script>
