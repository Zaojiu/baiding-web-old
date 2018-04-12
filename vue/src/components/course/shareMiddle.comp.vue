<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else>
      <div class="top">
        <header>
          <div class="cover">
            <img :src="invitedInfo.coverUrl">
          </div>
        </header>
        <div class="user">
          <div class="avatar-img">
            <img :src="invitedInfo.inviter.avatar"/>
          </div>
          <p>「{{invitedInfo.inviter.nick}}」花钱请你听课</p>
        </div>
        <div class="content">
          <h3 class="title">{{invitedInfo.subject}}</h3>
          <p>课程讲师：{{invitedInfo.speaker.subject}}.{{invitedInfo.speaker.title}}</p>
        </div>
      </div>
      <footer>
        <div class="my-button">
          <button @click="goCourse()">
            学习课程
          </button>
        </div>
        <p>限量二十个名额，请速速领取</p>
      </footer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    overflow: hidden;
  }

  .main {
    position: relative;
    height: 100vh;
    overflow: auto;
    background-color: $color-gray5;

    .top{
      overflow: auto;
      height: calc(100vh - 105px);
      padding-bottom: 30px;
    }

    header{
      position: relative;
      padding-top: 56.25%;
      .cover{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        overflow: hidden;
        img{
          width: 100%;
        }
      }
    }

    .user{
      position: relative;
      top:-10vw;

      .avatar-img{
        height: 20vw;
        width: 20vw;
        margin: auto;
        border-radius: 10vw;
        border:3px solid #fff;
        overflow: hidden;
        img{
          width: 100%;
        }
      }
      p{
        color:rgb(56,56,56);
        font-weight: bold;
        font-size: 14px;
        line-height: 14px;
        text-align: center;
        margin-top: 8px;
      }
    }

    .content{
      text-align: center;
      h3{
        width: calc(100% - 64px);
        margin: auto;
      }
      p{
        width: calc(100% - 64px);
        margin: 8px auto 0 auto;
        color: rgb(166,166,166);
        font-size: 14px;
        line-height: 20px;
      }
    }
    footer{

      position: absolute;
      width: 100%;
      bottom: 0;

      .my-button{
        text-align: center;
        button{
          width: calc(100% - 40px);
          font-size: 18px;
          line-height: 25px;
          padding: 11px 0;
          color: #fff;
          font-weight: bold;
          background-color: rgb(0,211,193);
          border-radius: 4px;
        }
      }
      p{
        margin: 16px 0 28px 0;
        text-align: center;
        font-size: 12px;
        line-height: 12px;
        color:rgb(166,166,166);
      }
    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {InvitedModel} from "../../shared/api/course.model";
  import {getUserInfoCache} from '../../shared/api/user.api';
  import {showTips} from '../../store/tip';
  import {setTitle} from '../../shared/utils/title';
  import {getInvitedByInfo, acceptInvited} from '../../shared/api/course.api';

  @Component({
  })
  export default class ContentComponent extends Vue {
    courseId = '';
    itemId = '';
    invitedByUid =  '';
    invitedInfo: InvitedModel;
    isLoading = true;
    isError = false;
    userInfo = getUserInfoCache();

    created() {
      this.itemId = this.$route.params['itemId'];
      this.invitedByUid = this.$route.params['uid'];
      this.initData();
    }

    async initData() {

      try {
        let invitedInfo = await getInvitedByInfo(this.itemId, this.invitedByUid);
        this.courseId = invitedInfo.course_user_info.courseId;
        if (invitedInfo.item_user_info.isPaid || invitedInfo.course_user_info.isPaid){
          this.$router.push({path:`/course/${this.courseId}/items/${this.itemId}`});
          return;
        }
        this.invitedInfo = invitedInfo;
      } catch (e) {
        this.isError = true;
        throw e;
      } finally {
        this.isLoading = false;
      }
      this.doPageLogic();
    }

    doPageLogic() {
      setTitle(this.invitedInfo.subject);
    }

    async goCourse(){
      if (this.invitedInfo.invite_remain <= 0){
        showTips('已被抢光！');
        return;
      }
      try {
        await acceptInvited(this.itemId,this.invitedInfo.inviter.uid);
      } catch(e) {
        throw e;
      }

      let invited_by = ''+this.invitedInfo.inviter.uid;
      this.$router.push({path:`/course/${this.courseId}/items/${this.itemId}`,query:{invited_by:invited_by}});
    }

  }
</script>
