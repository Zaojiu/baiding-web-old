<template>
  <div class="content">
    <div class="member-card">
      <div v-for="item in listImg" class="image-cover" @click="actionImgCover(item)">
        <img :src="item.cover"/>
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
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {isInApp} from "../../shared/utils/utils";
  import {showTips} from '../../store/tip';

  @Component({})
  export default class Course extends Vue {
    isInApp: boolean = isInApp;
    listText: string[] = [];
    listImg: any[] = [];
    userInfo: UserInfoModel;
    defaultCover = 'assets/img/default-cover.jpg';
    lockAction = false;

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
        {
          id: '5aa8d12f0b603c0001b68a37',
          cover: 'https://og9s6vxbs.qnssl.com/cover/img/FvPvY8l4lOYBAfCDbCCpRdA-803H-1521013118.png~16-9'
        },
        {
          id: '5a911d1f0b603c0001c24160',
          cover: 'https://og9s6vxbs.qnssl.com/cover/img/FhWbgkZc7hamg2-5QdVku4W8ekkT-1521093786.png~16-9'
        },
        {
          id: '5a5f080551281300015d4449',
          cover: 'https://og9s6vxbs.qnssl.com/cover/img/FrvrNDD_POewjr-JeRmkMyT5Cd81-1521093982.png~16-9'
        },
        {
          id: '5b0d0b195abd5900016a58ba',
          cover: 'https://og9s6vxbs.qnssl.com/cover/img/FoMzM-TwYdDrpy0S6DrbW8i9pKyB-1527670691.jpg~16-9'
        },
      ];
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {

      }
      if (!this.userInfo || !this.userInfo.member.valid) {
        this.lockAction = true;
        this.listText = [
          '五折购买在线《大师之课》'
        ];
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
