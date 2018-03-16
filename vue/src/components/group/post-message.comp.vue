<template>
  <div class="container">
    <div class="top">
      <span class="btn-x" @click>X</span>
      <span class="btn-post" @click="initData()">发布</span>
    </div>
    <p class="title">发布内容</p>
    <div class="bottom">
      <textarea class="textarea" ></textarea>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import moment from 'moment';
  import {Component} from 'vue-property-decorator';
  import {postMessage} from '../../shared/api/group.api';
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {models} from '../../shared/api/group.model';
  import {UserInfoModel} from '../../shared/api/user.model';

    export default class PostMassage extends Vue {
      content = '123';
      groupId = '5a9ce8b148ab3a36f820cc68';
      toUids = '15422659915';

      create () {
      }

      async initData() {
        await postMessage(this.groupId, this.toUids, this.content);
      }

    }
</script>

<style lang="scss" scoped>
  .container {

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .btn-x {
        width: 14px;
        height: 14px;
        color: black;
        font-size: 14px;
        line-height: 14px;
        margin: 20px;
      }
      .btn-post {
        color: rgb(0, 211, 193);
        font-size: 17px;
        line-height: 24px;
        margin: 20px;
      }
    }

    .title {
      padding: 12px 0 20px 20px;
      font-size: 28px;
      line-height: 28px;
      color: black;
      box-shadow:  0px 2px 4px rgba(0, 0, 0, 0.1);
      font-weight: bold;
    }

    .bottom {
      padding: 16px 20px;

      .textarea {
        width: 100%;
        height: max-content;
        min-height: 456px;
        outline: none;
        font-size: 16px;
        line-height: 24px;
      }
    }
  }
</style>
