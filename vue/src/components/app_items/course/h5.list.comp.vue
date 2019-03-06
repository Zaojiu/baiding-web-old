<template>
  <div class="container">
    <!--<top-nav></top-nav>-->
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div v-else>


      <div class="header">
        <!--<div class="tab" :class="{active:ison}" @click="tabCourse(120)" >课程</div>-->
        <!--<div class="tab" :class="{active:!ison}" @click="tabCourse(210)">听书</div>-->

        <div class="tab" :class="{active:index==tab}" @click="tabCourse(item.type,index)" v-for="(item,index) in tabs">
          {{item.name}}
        </div>
      </div>
      <div class="content" v-show="tab==0">
        <div class="item" v-for="item in courseList" @click="enter(item.id,true,120)">
          <img :src="item.image" alt="">
          <div class="title">
            <h3>{{item.subject}}</h3>
            <p>{{item.speakerName}} · {{item.speakerMeta}}</p>
            <span>{{item.totalVol}}课 / {{(item.originalPrice)/100}}元 / 会员价{{(item.memberPrice)/100}}元</span>
          </div>
        </div>

      </div>
      <div class="content" v-show="tab==1">
        <div class="item" v-for="item in bookList" @click="enter(item.id,true,210)">
          <img :src="item.image" alt="">
          <div class="title">
            <h3>{{item.subject}}</h3>
            <p>{{item.speakerName}} · {{item.speakerMeta}}</p>
            <span>{{item.totalVol}}课 / {{(item.originalPrice)/100}}元 / 会员价{{(item.memberPrice)/100}}元</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .container {
    /*background-color: #1a1a1a;*/
    //background-color: #fff;
    height: 100vh;
    padding: 0 20px;
    .header {
      font-size: 16px;
      position: fixed;
      top: 0;
      left: 0;
      background-color: #fff;
      width: 100%;
      z-index: 10;
      padding: 0 20px;
      .tab{
        display: inline-block;
        width: 56px;
        height: 32px;
        text-align: center;
        line-height: 32px;

        margin: 10px 10px 20px 0;
        font-weight: 600;
        color: rgb(179,179,179);
        border-radius: 50px;
      }
      .active{
        background-color: rgb(239,239,239);
        color: #555;
      }
    }
    .content{
      margin-top: 62px;
      .item{
        margin-bottom: 28px;
        overflow: hidden;
        img{
          width: 80px;
          height: 113px;
          float: left;
          border-radius: 4px;
          background-color: #eee;
          object-fit: cover;
        }
        .title{
          margin-left: 92px;
          height: 113px;
          position: relative;
          h3{
            font-size: 16px;
            color: rgb(85,85,85);
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-weight: 700;
            margin-top: 3px;
          }
          p{
            font-size: 12px;
            color: rgb(179,179,179);
            line-height: 14px;
            margin-top: 5px;
            font-weight: 700;

          }
          span{
            position: absolute;
            left: 0;
            bottom: 3px;
            color: rgb(85,85,85);
            font-size: 12px;
            line-height: 16px;
            font-weight: 600;
          }
        }
      }
    }
    /*.title{*/
      /*width: 100%;*/
      /*font-size: 30px;*/
      /*line-height: 1em;*/
      /*padding: 20px;*/
      /*color: #fff;*/
    /*}*/

    /*.content{*/
      /*height: calc(100vh - 140px);*/
      /*overflow: auto;*/
    /*}*/

    /*.course-item {*/
      /*margin: 0 20px 20px 20px;*/

      /*.member-course {*/
        /*font-size: 0;*/
        /*position: relative;*/
        /*padding-top: 56.25%;*/
        /*overflow: hidden;*/
        /*border-radius: 6px;*/
        /*img {*/
          /*position: absolute;*/
          /*top: 0;*/
          /*left: 0;*/
          /*width: 100%;*/
        /*}*/
      /*}*/

      /*.normal-course {*/
        /*font-size: 0;*/
        /*position: relative;*/
        /*padding-top: 140%;*/
        /*overflow: hidden;*/
        /*img {*/
          /*position: absolute;*/
          /*top: 0;*/
          /*left: 0;*/
          /*width: 100%;*/
        /*}*/
      /*}*/
    /*}*/
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {listCourses,listCourses2} from '../../../shared/api/course.api';
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
  import axios from 'axios';
  import jquery from 'jquery';
  declare var $:any;
  @Component({})
  export default class CourseMall extends Vue {
    userInfo: UserInfoModel;
    courseList:any=[];
    bookList:any=[];
    isLoading = false;
    isError = false;
    isNotFound = false;
    ison=true;
    pageIndex=0;//页码
    type=120;
    isData=true;
    tabs=[{'name':'课程','type':'120'},{'name':'听书','type':'210'}];
    tab=0;
    created() {
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {

      }
      let _this = this;
      $(document).scroll(
        function() {
          if ($(document).scrollTop() + window.innerHeight == $(document).height()) {
            if(_this.isData){
              _this.pageIndex++;
              _this.initData(_this.type);
            }

          }
        });
      this.routeChange();
    }

    @Watch('$route')
    routeChange() {
      this.initData(120);
    }
    tabCourse(type:any,index:any){
     this.tab=index;
      this.initData(type);
      this.type = type;
    }
     initData(type:any) {
       axios.get(`${host.io}/api/course/resources?type=${type}&pageIndex=${this.pageIndex}&pageSize=20` ).then(res=>{
         if(res.data.results!=undefined){
           this.isData=true;
          let data:any = res.data.results.items;

          if(type==120){
            for (let i =0;i<data.length;i++){
              this.courseList.push(data[i]);
            }
          }else if(type==210){
            for (let i =0;i<data.length;i++){
              this.bookList.push(data[i]);
            }
            console.log(this.bookList);
          }
         }else{
           this.isData=false;
         }
       });
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
    //课程听书详情
    enter(id: string, isForMember: boolean,type:any) {
      if(type==120){
        if (isForMember) {

          if (this.checkLogin()) {
            if (this.userInfo.isMember) {
              this.$router.push({path: `/app/course/${id}/cover`});
            } else {
              showTips('会员专属');
            }
          }
          return;
        }
      }else if(type==210){
        this.$router.push({path: `/book/detail/${id}`});
      }


    }

  }
</script>

