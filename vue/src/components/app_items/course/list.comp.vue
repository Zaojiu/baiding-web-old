<template>
  <div class="container">
    <top-nav></top-nav>
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div v-else>
      <h2 class="title">课程</h2>
      <div class="content">
        <div class="course-item" v-for="item in courseList">
          <div class="member-course" v-if="item.isForMember" @click="enter(item.id,true)">
            <img :src="item.coverUrl+'~16-9'"/>
          </div>
          <div class="normal-course" v-else @click="enter(item.id,false)">
            <img :src="item.coverUrl+'~5-7'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .container {
    background-color: #1a1a1a;
    //background-color: #fff;
    height: 100vh;

    .title{
      width: 100%;
      font-size: 30px;
      line-height: 1em;
      padding: 20px;
      color: #fff;
    }

    .content{
      height: calc(100vh - 140px);
      overflow: auto;
    }

    .course-item {
      margin: 0 20px 20px 20px;

      .member-course {
        font-size: 0;
        position: relative;
        padding-top: 56.25%;
        overflow: hidden;
        border-radius: 6px;
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      }

      .normal-course {
        font-size: 0;
        position: relative;
        padding-top: 140%;
        overflow: hidden;
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {listCourses} from '../../../shared/api/course.api';
  import {Course} from '../../../shared/api/course.model';
  import {UserInfoModel} from '../../../shared/api/user.model';
  import {showTips} from '../../../store/tip';
  import {ApiError} from '../../../shared/api/xhr';
  import {ApiCode, ApiErrorMessage} from '../../../shared/api/code-map.enum';
  import {Store} from "../../../shared/utils/store";
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from '../../../shared/utils/share';
  import {isInWechat} from "../../../shared/utils/utils";
  import {host} from "../../../env/environment";

  @Component({})
  export default class CourseMall extends Vue {
    userInfo: UserInfoModel;
    courseList: Course[] = [];
    isLoading = false;
    isError = false;
    isNotFound = false;

    created() {
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {

      }
      this.routeChange();
    }

    @Watch('$route')
    routeChange() {
      this.initData();
    }

    async initData() {
      this.isLoading = true;
      try {
        this.courseList = await listCourses();
      } catch (e) {
        if (e instanceof ApiError && e.code === ApiCode.ErrNotFound) {
          this.isNotFound = true;
        } else {
          this.isError = true;
        }
        throw e;
      } finally {
        this.isLoading = false;
        if (isInWechat) {
          this.share();
        }
      }
    }

    async share() {
      await initWechat();
      setShareInfo('课程列表',
        `「造就」精品课程,期待你的加入`,
        `${host.assets}/assets/img/zaojiu-logo.jpg`,
        `${host.self}${this.$route.fullPath}`);
    }

    checkLogin() {
      // 未登录
      if (!this.userInfo) {
        this.$router.push({path: '/signin', query: {redirectTo: `${host.self}${this.$route.fullPath}`}});
        return false;
      }

      return true;
    };

    enter(id: string, isForMember: boolean) {
      if (isForMember) {

        if (this.checkLogin()) {
          if (this.userInfo.isMember) {
            this.$router.push({path: `/columns/${id}`});
          } else {
            showTips('会员专属');
            this.$router.push({path: '/new-member/action',query:{needBack:'/course/list'}});
          }
        }
        return;
      }
      this.$router.push({path: `/app/course/${id}/cover`});
    }

  }
</script>

