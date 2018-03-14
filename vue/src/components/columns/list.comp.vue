<template>
  <div class="content">
    <h1 class="title">
      课程列表
    </h1>
    <div class="member-card">
      <div v-for="item in listImg" class="image-cover" @click="actionImgCover(item)">
        <img :src="item"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .content {
    height: 100vh;
    overflow: auto;
    background-color: #1a1a1a;

    h1 {
      background-color: #242424;
      color:#f2f2f2;
      font-size: 28px;
      line-height: 28px;
      padding: 20px 0 20px 20px;
      letter-spacing: -0.7px;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, .5);
    }

  }

  .member-card {
    padding-top: 20px;
    color: #fff;
    overflow: hidden;
    width: calc(100% - 40px);
    margin: auto;

    .image-cover {
      font-size: 0;
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
      }
      & + .image-cover {
        margin-top: 32px;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {initIOS, callHandler} from "../../shared/utils/ios";
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {isInApp} from "../../shared/utils/utils";
  import {showTips} from '../../store/tip';

  @Component({})
  export default class Course extends Vue {
    isInApp: boolean = isInApp;
    listImg: string[] = [];
    userInfo: UserInfoModel;
    defaultCover = 'assets/img/default-cover.jpg';

    created() {
      this.init();
    }

    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    init() {
      this.isInApp = isInApp;
      this.listImg = [
        'https://og9s6vxbs.qnssl.com/cover/img/Fr68ytdpD1lPW4zQuUwu1S_tv1Vl-1519459640.png~16-9',
        'https://og9s6vxbs.qnssl.com/member/online-class.png'
      ];
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {

      }
    }

    async actionImgCover(item: string) {
      // 在线课程跳转到课程
      if (this.isInApp) {
        await initIOS();
        if (item === 'https://og9s6vxbs.qnssl.com/member/online-class.png') {
          callHandler('pushMemberCourse2', '5a5f080551281300015d4449');
        } else if (item === 'https://og9s6vxbs.qnssl.com/cover/img/Fr68ytdpD1lPW4zQuUwu1S_tv1Vl-1519459640.png~16-9') {
          callHandler('pushMemberCourse2', '5a911d1f0b603c0001c24160');
        }

      } else {
        if (item === 'https://og9s6vxbs.qnssl.com/member/online-class.png') {
          this.$router.push({path: '/columns/5a5f080551281300015d4449'});
        } else if (item === 'https://og9s6vxbs.qnssl.com/cover/img/Fr68ytdpD1lPW4zQuUwu1S_tv1Vl-1519459640.png~16-9') {
          this.$router.push({path: '/columns/5a911d1f0b603c0001c24160'});
        }
      }
    };
  }
</script>

