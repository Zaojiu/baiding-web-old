<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isNotFound">无此专栏</error>
    <error class="abs-center" v-else-if="isError"></error>
    <div class="group" v-else>
      <top-nav></top-nav>
      <div class="item" v-for="(item, index) in groupData">
        <div class="top">
          <img class="avatar avatar-round avatar-45 top-avatar" name="" v-bind:src=" item.userInfo?  item.userInfo.avatar : defaultAvatar " alt="头像"/>
          <div class="top-right">
            <p class="nick">{{ item.userInfo.nick }}</p>
            <p class="created-at">{{ showMoment(item.createdAt) }}</p>
          </div>
        </div>
        <p class="content">{{ item.content }}</p>
      </div>
    </div>
    <div class="new-content">发布内容</div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import moment from 'moment';
  import {Component} from 'vue-property-decorator';
  import {getData} from '../../shared/api/group.api';
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {models} from '../../shared/api/group.model';
  import {UserInfoModel} from '../../shared/api/user.model';

  @Component
  export default class GroupComponent extends Vue {
    id = 0;
    groupId = '';
    size = 100;
    createdAt = '';
    userInfo: UserInfoModel | null = null;
    isLoading = false;
    isError = false;
    isIntroCollape = true;
    isPaying = false;
    isNotFound = false;
    defaultAvatar = '/assets/img/zaojiu-logo.jpg';

    groupData = [];
    userData = {};


    created() {
      this.groupId = this.$route.params.id;
      console.log(this.groupId);
      this.initData(this.groupId);
    }

    async initData(groupId: string) {
      let res = await getData(groupId, this.size, this.createdAt);
      console.log(res);
      this.groupData = res;

      // this.groupData = res.data.result;
      // this.userData = res.data.include.users;

    }

    showMoment (m: any) {
      return moment.unix(m.substring(0, 10)).format('YYYY-MM-DD HH:mm:ss');
    }
  }

</script>

<style lang="scss" scoped>
  .container {
    background-color: transparent;

    .group {
      background-color: rgb(242, 242, 242);
      margin-bottom: 77px;

      .item {
        background-color: white;
        margin-bottom: 8px;

        .top {
          color: #000;
          margin-left: 20px;
          padding-top: 16px;

          .top-avatar {
            height: 40px;
            width: 40px;
          }

          .top-right {
            display: inline-block;
            margin-left: 12px;
            vertical-align: top;

            .nick {
              display: block;
              margin-top: 5px;
              font-size: 15px;
              line-height: 15px;
            }

            .created-at {
              display: block;
              margin-top: 6px;
              font-size: 10px;
              line-height: 10px;
            }
          }
        }

        .content {
          color: #000;
          margin: 8px 20px 12px 20px;
          padding-bottom: 16px;
          font-size: 15px;
          line-height: 23px;
        }
      }
    }
  }

  .new-content {
    position: fixed;
    height: 47px;
    background-color: rgb(0, 211, 193);
    color: white;
    font-size: 18px;
    line-height: 47px;
    margin: 0;
    bottom: 15px;
    left: 15px;
    right: 15px;
    border-radius: 4px;
    text-align: center;
  }


</style>
