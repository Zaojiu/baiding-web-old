<template>
  <div class="member-activate">
    <div class="content">
      <router-view></router-view>
    </div>
    <footer>
      <div class="bar-tab" @click="goToCourse"><img :src="courseImg"/></div>
      <div class="bar-tab" @click="goToGroup"><img :src="groupImg"/></div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>

  .member-activate {
    overflow: hidden;
    height: 100vh;
    .content {
      height: calc(100vh - 50px);
    }
    footer {
      background-color: #fff;
      height: 50px;
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 1px -3px 6px rgba(0, 0, 0, .05);
      .bar-tab {
        height: 100%;
        text-align: center;
        color: #000;
        font-size: 0;
        img {
          height: 100%;
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../shared/api/user.api";
  /*import {UserInfoModel} from '../../shared/api/user.model'
  import {isInApp, isInWechat} from "../../shared/utils/utils";
  import {PostOrderObject, OrderObjectType} from "../../shared/api/order.model";*/

  @Component({})
  export default class MallContainer extends Vue {
    id: string = "";
    groupId: string = "";
    courseImg = 'https://og9s6vxbs.qnssl.com/course/course-icon.png';
    groupImg = 'https://og9s6vxbs.qnssl.com/course/group-icon.png';

    created() {
      this.routeChange();
    }

    @Watch('$route')
    routeChange() {
      let routeName = this.$route.name;
      if (routeName === 'course.cover') {
        this.id = this.$route.params['id'];
        this.groupId = this.$route.query['groupId'];
        this.courseImg = 'https://og9s6vxbs.qnssl.com/course/course-icon-active.png';
        this.groupImg = 'https://og9s6vxbs.qnssl.com/course/group-icon.png';
      } else if(routeName === 'group.cover') {
        this.groupId = this.$route.params['id'];
        this.id = this.$route.query['courseId'];
        this.groupImg = 'https://og9s6vxbs.qnssl.com/course/group-icon-active.png';
        this.courseImg = 'https://og9s6vxbs.qnssl.com/course/course-icon.png';
      }
    }

    goToCourse() {
      this.$router.push({path: `/course/${this.id}/cover?groupId=${this.groupId}`});
    }

    goToGroup() {
      if (this.groupId) {
        this.$router.push({path: `/group/${this.groupId}/cover?courseId=${this.id}`});
      }
    }
  }
</script>
