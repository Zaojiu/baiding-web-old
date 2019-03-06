<template>

  <div class="container">
    <div class="content">
      <div class="items_tab">
        <div class="tabs" id="tab">
          <i
            v-for="(item,index) in tabs" class="tab"
            :class="{active:index == num}"
            @click="tab(index)">{{item}}</i>

        </div>
      </div>
      <div class="item_list" v-show=" num == 0">
        <div class="item1" v-for="(item,index) in userList" >
            <div class="item_img" @click="getDetail(item.id,0)">
              <img class="cover" :src="item.image" alt="">
            </div>
            <div class="item_txt">
              <h3>{{item.speakerName}}</h3>
              <p>{{item.company}}</p>
            </div>
            <div class="item_follow">
              <span class="follow yesFollow userFollow"  @click="cliFollw(item.id,index,0)" >已关注</span>
            </div>
        </div>

        <div class="noList" v-show="yesNull">
          暂无关注讲者内容
        </div>

      </div>
      <div class="item_list_video" v-show=" num == 1">
         <div class="item2" v-for="(item,index) in labelList">
           <div class="item_img">
             <!--<img :src="item.image" alt="">-->
             <img src="" alt="" @click="getDetail(item.id,1)">
             <div class="item_text">
               <h3># {{item.tagName}}</h3>
               <p>{{item.notesNum}}粉丝</p>
             </div>
           </div>
           <div class="item_follow">
             <span class="follow yesFollow labelFollow" @click="cliFollw(item.id,index,1)" >已关注</span>
           </div>

         </div>
        <div class="noList" v-show="labelNull">
         暂无关注标签内容
        </div>
      </div>
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
    tabs=["用户","标签"];
    num=0;
    isHidden=false;
    followTxt='已关注';
    courseList: Course[] = [];
    courseList2: Course[] = [];
    yesNull=false;//没关注内容
    labelNull=false;//没关注内容
    userList=[];
    labelList=[];
    pageIndex=0;//页码
    isUserFollow:any=[];//关注用户集合
    isLabelFollow:any=[];//关注标签集合
    userLength=1;
    labelLength=1;
    created() {
      this.initData(0,0);
      let _this = this;
      $(document).scroll(
        function() {
          if ($(document).scrollTop() + window.innerHeight == $(document).height()) {
            if((_this.userLength && _this.num==0) || (_this.labelLength && _this.num==1)){

            }else{
              _this.pageIndex++;
              _this.initData(_this.num,_this.pageIndex);
            }
          }
        });
    }

    //数据
    initData(typeId:number,pageIndex:number){
      axios.get(`${host.io}/api/zj/my/attention?type=${typeId}&pageIndex=${this.pageIndex}&pageSize=10`).then (res => {
        console.log( res.data.results);

        if(typeId==0){
           let data = res.data.results.items;
           this.userLength = data.length;
          if(data==undefined){
            this.yesNull=true;
          }else{
            for (let i=0;i<data.length;i++){
              this.isUserFollow.push(data[i].isAttention);//关注用户集合
            }
            this.userList = res.data.results.items;
          }



        }else if(typeId==1){
          let data = res.data.results.items;
          this.labelLength = data.length;
          if(data==undefined){
            this.labelNull=true;
          }else{
            for (let i=0;i<data.length;i++){
              this.isLabelFollow.push(data[i].isAttention);//关注标签集合
            }
            this.labelList = res.data.results.items;
          }



        }
      });
    }
    mounted() {
      this.setWidth('#tab');
      this.setImgHeight()
    }
    tab(index:any) {
      this.num = index;
      this.initData(index,1);
    }
    setImgHeight(){
      let bodyW:any = $('body').width();
      let item2:any = $('.item2');
      item2.find('.item_img').height(bodyW*0.442);

    }
    //关注与取消
    //关注与取消
    async cliFollw(id:any,index:any,type:any){
      this.userInfo =await getUserInfoCache();//获取用户信息
      let isFollow:any;
      if(type==0){//用户，标签
        if(this.isUserFollow[index]==0){
          isFollow=true;
        }else{
          isFollow=false;
        }
        await getFollow(id,0,isFollow);
      }else{
        if(this.isLabelFollow[index]==0){
          isFollow=true;
        }else{
          isFollow=false;
        }
        await getFollow(id,1,isFollow);
      }
      if(type==0){

        if(isFollow){
          $('.userFollow').eq(index).addClass('yesFollow').text('已关注');
          this.isUserFollow[index]=1;
        }else{
          $('.userFollow').eq(index).removeClass('yesFollow').text('关注');
          this.isUserFollow[index]=0;
        }
      }else{
        if(isFollow){
          $('.labelFollow').eq(index).addClass('yesFollow').text('已关注');
          this.isLabelFollow[index]=1;

        }else{
          $('.labelFollow').eq(index).removeClass('yesFollow').text('关注');
          this.isLabelFollow[index]=0;
          console.log(this.isLabelFollow);
        }
      }

    }

    //滚动宽度
    setWidth(lab:any){
      var _$ = $(lab);
      let len:any=0;
      for (var i=0;i<_$.find('i').length;i++){
        len+=_$.find('i').eq(i).outerWidth(true)
      }
      let $width:any=_$.width();
      if($width<=len){
        _$.width(len)
      }

    }
    //详情
    getDetail(id:any,type:any){
      if(type==0){
        this.$router.push({path: `/items/smallVideo/${id}`})
      }else if(type==1){
        this.$router.push({path: `/app/labelAd/${id}`})
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
    ::-webkit-scrollbar {
      display: none;
    }
    .content{
      .items_tab{
        width: 100%;

        overflow: auto;
        .tabs{
          width: 100%;
          margin-bottom: 16px;
          .tab{
            font-size: 12px;
            padding: 6px 12px;
            margin-right: 8px;
            display: inline-block;
            color: rgb(178,178,178);
            font-weight: 500;
            font-style: normal;
          }
          .active{
            color: rgb(85,85,85);
            background-color: rgb(239,239,239);
            border-radius: 14px;
          }
        }
      }
      .item_list{

        .item1{
          display: flex;
          margin-bottom: 28px;
          .item_img{
            width: 64px;
            height: 64px;
            margin-right: 8px;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
              object-fit: cover;
            }
          }
          .item_txt{
            flex: 1;
            h3{
              font-size: 16px;
              line-height: 20px;
              color: rgb(85,85,85);
              word-break: break-all;
              white-space: pre-wrap;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              margin-bottom: 2px;
            }
            p{
              font-size: 12px;
              line-height: 17px;
              color: rgb(179,179,179);
              word-break: break-all;
              white-space: pre-wrap;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            }
          }
          .item_follow{
            width: 56px;
            height: 24px;
            margin-left: 16px;
            .follow{
              margin-top: 20px;
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
      }
      .item_list_video{

        .item2{
          width: 48%;
          float: left;
          margin-bottom: 28px;
          .item_img{
            position: relative;
            font-size: 0;
            padding-top: 100%;
            img{
              position: absolute;
              width: 100%;
              height: 100%;
              object-fit: cover;
              top: 0;
              left: 0;
            }
            .item_text{
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 52px;
              color: #fff;
              padding: 16px 0 0 12px;
              background: linear-gradient(to top, rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 100%);
              background-repeat: repeat-x;
              h3{
                font-size: 16px;
                line-height: 20px;
              }
              p{
                font-size:12px;
                -webkit-transform-origin-x: 0;
                -webkit-transform: scale(0.75);
                line-height: 12px;
                font-weight: 600;
              }
            }
          }
            .item_follow{
              width: 100%;
              height: 24px;
              .follow{
                margin-top: 12px;
                display: block;

                height: 24px;
                line-height: 24px;
                text-align: center;
                background-color: $color-brand;
                font-size: 12px;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
              }
              .yesFollow{
                background-color: rgb(239,239,239);
                color: rgb(179,179,179);
              }
          }
        }
        .item2:nth-child(2n){
          margin-left: 4%;
        }
      }
      .no_null{
        text-align: center;
        color: #b3b3b3;
      }
    }



  }
</style>
