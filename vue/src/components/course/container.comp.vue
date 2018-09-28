<template>
  <div class="member-activate">
    <div class="content">
      <router-view></router-view>
    </div>
    <!-- <footer>
      <div class="bar-tab" @click="goToCourse"><img :src="courseImg"/></div>
      <div class="bar-tab" @click="goToGroup"><img :src="groupImg"/></div>
    </footer> -->
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
      position: fixed;
      bottom: 0;
      width: 100%;
      max-width: 1024px;
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
  import {getCourseInfo, listCourseItems, joinGroup} from '../../shared/api/course.api';

  @Component({})
  export default class MallContainer extends Vue {
    courseId: string = '';
    groupId: string = '';
    courseImg = 'https://og9s6vxbs.qnssl.com/course/course-icon.png';
    groupImg = 'https://og9s6vxbs.qnssl.com/course/group-icon.png';

    created() {
      if (this.$route.query['courseId']) {
        this.courseId = this.$route.query['courseId'];
      } else {
        this.courseId = this.$route.params['courseId'];
      }

      this.initData();
      this.routeChange();
    }

    async initData () {
      try {
        if (this.courseId) {
          let data =  await getCourseInfo(this.courseId);
          this.groupId = data.groupId;
        }
      } catch (e){
        //
      }
    }

    @Watch('$route')
    routeChange() {
      let routeName = this.$route.name;
      if (routeName === 'course.cover') {
        this.courseId = this.$route.params['courseId'];
        this.groupId = this.$route.query['groupId'];
        this.courseImg = 'https://og9s6vxbs.qnssl.com/course/course-icon-active.png';
        this.groupImg = 'https://og9s6vxbs.qnssl.com/course/group-icon.png';
      } else if(routeName === 'group.cover') {
        this.groupId = this.$route.params['groupId'];
        this.courseId = this.$route.query['courseId'];
        this.groupImg = 'https://og9s6vxbs.qnssl.com/course/group-icon-active.png';
        this.courseImg = 'https://og9s6vxbs.qnssl.com/course/course-icon.png';
      }
    }

    goToCourse() {
      this.$router.push({path: `/course/${this.courseId}/cover?groupId=${this.groupId}`});
    }

    goToGroup() {
      if (this.groupId) {
        this.$router.push({path: `/group/${this.groupId}/cover?courseId=${this.courseId}`});
      }
    }
  }
</script>
