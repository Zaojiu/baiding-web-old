<template>
  <div class="container">

    <div class="content">
      <div class="items_tab">
        <div class="tabs" id="tab">
          <i
            v-for="(item,index) in tabs" class="tab"
            :class="{active:index == num}"
            @click="tab(index,item.id)">{{item.name}}</i>

        </div>
      </div>
      <div class="item_list" v-show=" num == 0">

        <div class="item" v-for="(item,index) in videoList" >
          <div class="item_img item_img_a" @click="getDetail(item.resourceId)">
            <img class="cover" :src="item.image" alt="">
            <span></span>
          </div>
          <p>{{item.title}}</p>
          <div class="user">
            <img :src="item.image" alt="">
            <span class="user">{{item.speakerName}}</span>
          </div>
          <div class="laud" :class="{laudY:item.isFavourite==1}" ref="likes" @click="like(item.resourceId,index)">
            <span>{{item.favourite}}</span>
          </div>

        </div>


      </div>

      <div v-if="isVideo && num==0" class="noList">暂无相关视频</div>
    </div>

  </div>


</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {listCourses,listCourses2} from '../../../shared/api/course.api';
  import {Course} from '../../../shared/api/course.model';
  import axios from 'axios';
  import {host} from "../../../env/environment";
  import {getUserInfoCache,getFollow,getLike} from "../../../shared/api/user.api";
  import jquery from 'jquery';
  import {UserInfoModel} from '../../../shared/api/user.model';
  declare var $:any;
  @Component
  export default class EventListComponent extends Vue {
    userInfo: UserInfoModel | null = null;
    tabs=[{name:"视频",id:200}];
    num=0;
    isHidden=false;
    follow=false;//是否关注
    followTxt='关注';
    videoList:any=[];//视频
    likeVideo:any=[];//喜欢短视频字段集合
    isVideo=true;//是否有视频
    isCourse=true;//是否有课程
    isBook = true;//是否有听书
    pageIndex=0;//页码
    id=200;
    dataLength=1;
    created() {
      this.initData(200,0);
      let _this = this;
      $(document).scroll(
        function() {
          if ($(document).scrollTop() + window.innerHeight == $(document).height()) {

            if(_this.dataLength<10){
              return;
            }else{
              _this.pageIndex++;
              _this.initData(_this.id,_this.pageIndex);
            }
          }
        });
    }

    initData(typeId:number,pageIndex:number){
      axios.get(`${host.io}/api/zj/my/favorites?type=${typeId}&pageIndex=${this.pageIndex}&pageSize=10`).then (res => {
        this.dataLength = res.data.results.items.length;
        if(typeId==200){

          let data = res.data.results.items;
          if(data != undefined){
            this.isVideo = false;
            for (let i =0;i<data.length;i++){
              this.videoList.push(data[i]);
              this.likeVideo.push(data[i].isFavourite);//存储喜欢集合(0,1)
            }
          }
          console.log(this.videoList);

        }
      });
    }
    mounted() {
    }
    tab(index:any,type:any) {
      this.num=index;
      console.log(this.num);
      this.initData(type,0);

    }

    //关注与取消
    cliFollw(){
      this.follow= !this.follow;
      if(this.follow){
        this.followTxt='已关注'
      }else{
        this.followTxt='关注'
      }
    }

    //详情
    getDetail(id:any){
      this.$router.push({path: `/items/smallVideo/${id}`})
    }
    //短视频喜欢
    like(id:any,index:any){
      let isLike:any;
      if(this.likeVideo[index]==0){
        isLike = true;
      }else{
        isLike = false;
      }
      if(isLike==true){
        getLike(id,200,isLike);
        $('.laud').eq(index).addClass('laudY');
        let txt:any=$('.laud').eq(index).text();
        let likeNum =parseInt(txt);
        $('.laud').eq(index).text(likeNum+1);
        this.likeVideo[index]=1;
      }else{
        getLike(id,200,isLike);
        $('.laud').eq(index).removeClass('laudY');
        let txt:any=$('.laud').eq(index).text();
        let likeNum =parseInt(txt);
        $('.laud').eq(index).text(likeNum-1);
        this.likeVideo[index]=0;
      }
    }

  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    padding: 10px 16px;
    .noList{
      position: fixed;
      top: 50%;
      left: 0;
      width: 100%; text-align: center;
      color: rgb(179,179,179);
      font-weight: 700;
      font-size: 16px;
      height: 50px;
      line-height: 50px;
      margin-top: -25px;
    }
    .top_info{
      margin: 12px 0 32px 0;
      img{
        width: 64px;
        height: 64px;
        border-radius: 50%;
        float: left;
      }
      .con_info{
        position: relative;
        h3{
          font-size: 20px;
          line-height: 24px;
          color: rgb(85,85,85);
          width: 191px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
          margin: 8px 0 5px 0;
        }
        .fans{
          font-size: 12px;
          line-height: 16px;
          color: rgb(179,179,179);
          font-weight: 700;
          i{
            font-size: 14px;
            color: rgb(85,85,85);
            font-style: normal;
            font-weight: 700;
            margin-right: 4px;
          }
        }
        .swiper-lab{
          margin-top: 13px;
          overflow: auto;
          .width_auto{

            i{

              font-size: 12px;
              color: rgb(179,179,179);
              padding-right: 16px;
              font-weight: 700;
              font-style: normal;
            }
          }


        }
        .summary{
          margin: 8px 0 0 0;
          font-size: 12px;
          line-height: 18px;
          color: rgb(179,179,179);
        }
        ._hidden{
          height: 54px;
          overflow: hidden;
          position: relative;
          .shadow{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 18px;
            background: linear-gradient(to top, rgba(255,255,255,0.7) 0%,rgba(255,255,255,0) 100%);
            background-repeat: repeat-x;
          }
        }
        .follow{
          position: absolute;
          top: 5px;
          right: 5px;
          display: block;
          width: 56px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background-color: $color-brand;
          font-size: 12px;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 700;
        }
        .yesFollow{
          background-color: rgb(239,239,239);
          color: rgb(179,179,179);
        }
      }
    }
    ::-webkit-scrollbar {
      display: none;
    }
    .content{
      .items_tab{
        width: 100%;


        overflow-x: scroll;
        .tabs{
          width: 100%;
          margin-bottom: 22px;
          .tab{
            font-size: 12px;
            padding: 6px 12px;
            margin-right: 8px;
            display: inline-block;
            color: rgb(178,178,178);
            font-weight: 700;
            font-style: normal;
          }
          .active{
            color: rgb(85,85,85);
            background-color: rgb(239,239,239);
            border-radius: 14px;
          }
        }
      }
    }
    .item_list{
      column-count: 2;
      .item{
        width: 98%;
        overflow: hidden;
        margin-bottom: 30px;
        break-inside: avoid;
        .item_img{
          position: relative;
          font-size: 0;
          overflow: hidden;
          .cover{
            width: 100%;
            border-radius: 4px;
            object-fit: cover;
          }
          span{
            position: absolute;
            top: 6px;
            right: 6px;
            display:block;
            width: 16px;
            height: 16px;
            background: url("assets/playImg.png") no-repeat center;
            background-size: 16px;
          }
        }


        p{
          margin: 8px 0;
          font-size: 12px;
          color: rgb(85,85,85);
          font-weight: 700;
          line-height: 17px;
        }
        .user{
          float: left;
          img{
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            float: left;
            margin-right: 4px;
            object-fit: cover;
          }
          span{
            font-size: 12px;
            color: rgb(166,166,166);
            font-weight: 700;
            -webkit-transform : scale(0.84,0.84) ;
            *font-size:10px;
          }
        }
        .laud{
          float: right;
          font-size: 9px;
          color: rgb(179,179,179);
          padding-left: 15px;
          background: url("assets/groupN.png") no-repeat ;
          background-size: 12px 12px;
          background-position: left center;
          span{
            font-size: 12px;
            color: rgb(166,166,166);
            font-weight: 600;
            -webkit-transform : scale(0.84,0.84);
            *font-size:10px;

          }
        }
        .laudY{
          background: url("assets/groupY.png") no-repeat ;
          background-size: 12px 12px;
          background-position: left center;
        }

      }
      .item:nth-child(2n){
      }
    }
    .item_list_video{
      .item2 {
        margin-bottom: 28px;
        overflow: hidden;
        img {
          width: 80px;
          height: 113px;
          float: left;
          border-radius: 4px;
          object-fit: cover;
        }
        .title {
          margin-left: 92px;
          height: 113px;
          position: relative;
          h3 {
            font-size: 16px;
            color: rgb(85, 85, 85);
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          p {
            font-size: 12px;
            color: rgb(179, 179, 179);
            line-height: 14px;
            margin-top: 5px;
            font-weight: 700;
          }
          span {
            position: absolute;
            left: 0;
            bottom: 3px;
            color: rgb(85, 85, 85);
            font-size: 12px;
            line-height: 16px;
            font-weight: 700;
          }
        }
      }
    }

  }
</style>
