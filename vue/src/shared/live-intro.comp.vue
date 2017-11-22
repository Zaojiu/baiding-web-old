<template>
  <div class="live-intro">
    <live-cover :liveInfo="liveInfo"></live-cover>

    <div class="article">
      <div class="title">{{liveInfo.subject}}</div>

      <div class="talent">
        <img class="avatar avatar-25 avatar-round" :src="liveInfo.admin.avatar" alt="支持人头像">
        <div class="info">{{liveInfo.admin.nick}} / {{liveInfo.role(liveInfo.admin)}}</div>
      </div>

      <div class="desc" v-html="liveInfo.desc"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .live-intro {
    .article {
      margin: 20px;

      .title {
        margin-bottom: 12px;
        text-align: justify;
        font-size: $font-size-22;
        color: $color-dark-gray2;
        line-height: 1.36em;
        word-break: break-all;
      }

      .talent {
        display: flex;
        align-items: center;

        .avatar {
          flex-shrink: 0;
        }

        .info {
          flex-grow: 1;
          margin-left: 10px;
          font-size: $font-size-14;
          color: $color-gray;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .desc {
        margin: 32px 0;
        font-size: $font-size-16;
        color: $color-dark-gray3;
        line-height: 1.68em;
        word-break: break-all;
        white-space: pre-wrap;
      }
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {LiveInfoModel} from './api/lives.model';
  import liveCover from './live-cover.comp.vue';

  @Component({
    props: ['liveInfo'],
    components: {
      liveCover: liveCover,
    },
  })
  export default class LiveIntroComponent extends Vue {
    liveInfo: LiveInfoModel;
  }
</script>
