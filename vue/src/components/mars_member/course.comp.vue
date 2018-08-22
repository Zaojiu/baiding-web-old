<template>
  <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
  <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
  <div class="content" v-else>
    <div class="member-card">
      <div v-for="item in columnList" class="image-cover" @click="actionImgCover(item)">
        <img :src="item.coverSmall169Url"/>
      </div>
      <ul v-if="listText.length">
        <li v-for=" text in listText "><span class="dot"></span><span v-html="text"></span></li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    height: 100%;
    overflow: auto;
    margin-top: -20px;
    padding-top: 20px;
  }

  .member-card {
    color: #fff;
    overflow: hidden;

    .image-cover {
      font-size: 0;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
      }
      & + .image-cover {
        margin-top: 32px;
        margin-bottom: 32px;
      }
    }
    ul {
      padding: 12px 0;
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
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {initIOS, callHandler} from "../../shared/utils/ios";
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {UserInfoModel} from '../../shared/api/user.model';
  import {isInApp} from "../../shared/utils/utils";
  import {showTips} from '../../store/tip';
  import {listColumn} from '../../shared/api/column.api'
  import {Column} from '../../shared/api/column.model';

  @Component({})
  export default class Course extends Vue {
    isInApp: boolean = isInApp;
    listText: string[] = [];
    columnList: Column[] = [];
    userInfo: UserInfoModel;
    defaultCover = 'assets/img/default-cover.jpg';
    lockAction = false;
    isError = false;
    isLoading = false;

    created() {
      this.init();
    }

    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    async init() {
      this.isInApp = isInApp;
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {

      }
      if (!this.userInfo || !this.userInfo.member.valid) {
        this.lockAction = true;
        this.listText = [
        ];
      }
      this.initData();
    }

    async initData() {
      try {
        this.isLoading = true;
        this.columnList = await listColumn();
      } catch (e) {
        this.isError = true;
      } finally {
        this.isLoading = false;
      }
    }

    async actionImgCover(item: any) {
      // 在线课程跳转到课程

      if (this.lockAction) {
        showTips('会员专属');
        return;
      }

      if (this.isInApp) {
        await initIOS();
        callHandler('pushMemberCourse2', item.id);

      } else {
        this.$router.push({path: `/columns/${item.id}`});
      }
    };
  }
</script>
