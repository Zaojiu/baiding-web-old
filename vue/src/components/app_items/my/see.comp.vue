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

        <div class="item">
          <div class="item_img item_img_a">
            <img class="cover" src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span></span>
          </div>
          <p>北京大学中文系比较文学研究所教授，北京大学电影与文化研究中心主任</p>
          <div class="user">
            <img src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span class="user">李某某</span>
          </div>
          <div class="laud">
            <span>123</span>
          </div>

        </div>

        <div class="item">
          <div class="item_img item_img_g">
            <img class="cover" src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span></span>
          </div>


          <p>北京大学中文系比较文学研究所教授，北京大学电影与文化研究中心主任</p>
          <div class="user">
            <img src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span class="user">李某某</span>
          </div>
          <div class="laud">
            <span>123</span>
          </div>

        </div>
        <div class="item">
          <div class="item_img item_img_a">
            <img class="cover" src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span></span>
          </div>
          <p>北京大学中文系比较文学研究所教授，北京大学电影与文化研究中心主任</p>
          <div class="user">
            <img src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span class="user">李某某</span>
          </div>
          <div class="laud">
            <span>123</span>
          </div>

        </div>
        <div class="item">
          <div class="item_img item_img_g">
            <img class="cover" src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span></span>
          </div>
          <p>北京大学中文系比较文学研究所教授，北京大学电影与文化研究中心主任</p>
          <div class="user">
            <img src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span class="user">李某某</span>
          </div>
          <div class="laud">
            <span>123</span>
          </div>

        </div>
        <div class="item">
          <div class="item_img item_img_g">
            <img class="cover" src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span></span>
          </div>
          <p>北京大学中文系比较文学研究所教授，北京大学电影与文化研究中心主任</p>
          <div class="user">
            <img src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span class="user">李某某</span>
          </div>
          <div class="laud">
            <span>123</span>
          </div>

        </div>

        <div class="item">
          <div class="item_img item_img_a">
            <img class="cover" src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span></span>
          </div>
          <p>北京大学中文系比较文学研究所教授，北京大学电影与文化研究中心主任</p>
          <div class="user">
            <img src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span class="user">李某某</span>
          </div>
          <div class="laud">
            <span>123</span>
          </div>

        </div>


        <div class="item">
          <div class="item_img item_img_g">
            <img class="cover" src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span></span>
          </div>
          <p>北京大学中文系比较文学研究所教授，北京大学电影与文化研究中心主任</p>
          <div class="user">
            <img src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span class="user">李某某</span>
          </div>
          <div class="laud">
            <span>123</span>
          </div>

        </div>

        <div class="item">
          <div class="item_img item_img_a">
            <img class="cover" src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span></span>
          </div>
          <p>北京大学中文系比较文学研究所教授，北京大学电影与文化研究中心主任</p>
          <div class="user">
            <img src="https://baiding-pub.zaojiu.com/cover/img/FrQNThOS8JfpWzUwjL9tao4E1vlM-1539054125.jpg" alt="">
            <span class="user">李某某</span>
          </div>
          <div class="laud">
            <span>123</span>
          </div>

        </div>
      </div>
      <div class="item_list_video" v-show=" num == 1">
        <div class="item2" v-for="item in courseList" @click="enter(item.id,true)">
          <img :src="item.coverUrl+'~5-7'" alt="">
          <div class="title">
            <h3>{{item.subject}}</h3>
            <p>{{item.speaker.subject}} · {{item.speaker.title}}</p>
            <span>8课 / 199元 / 会员价100元</span>
          </div>
        </div>
      </div>

      <div class="item_list_video" v-show=" num == 2">
      <div class="item2" v-for="item in courseList2" @click="enter(item.id,true)">
        <img :src="item.coverUrl+'~5-7'" alt="">
        <div class="title">
          <h3>{{item.subject}}</h3>
          <p>{{item.speaker.subject}} · {{item.speaker.title}}</p>
          <span>8课 / 199元 / 会员价100元</span>
        </div>
      </div>

      </div>
    </div>

  </div>


</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import jquery from 'jquery'
  import {listCourses,listCourses2} from '../../../shared/api/course.api';
  import {Course} from '../../../shared/api/course.model';
  import axios from 'axios';
  import {host} from "../../../env/environment";
  @Component
  export default class EventListComponent extends Vue {
    tabs=["视频", "课程","听书",];
    num=1;
    isHidden=false;
    follow=false;//是否关注
    followTxt='关注';
    videoList=[];//视频
    courseList=[];//课程
    bookList=[];//听书

    created() {
      this.initData(200,0);
    }

    initData(typeId:number,pageIndex:number){
      axios.get(`${host.io}/api/zj/my/favorites?type=${typeId}&pageIndex=${pageIndex}&pageSize=10`).then (res => {
        if(typeId==200){
          this.videoList=res.data.results.items;
          console.log(res.data);
        }else if(typeId=120){
          this.courseList=res.data.results.items;
        }else if(typeId=210){
          this.bookList=res.data.results.items;
        }
      });
    }
    mounted() {
      this.setWidth('#tab');
      this.setImgHeight();
    }
    tab(index:any) {
      this.num = index;
    }
    setImgHeight(){
      let item2:any = $('.item_img');
      let widthT = item2.outerWidth();
      $('.item_img_g').height(widthT*1.34);
      $('.item_img_a').height(widthT);
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

  }
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    padding: 10px 16px;
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
        float: left;
        .item_img{
          font-size:0;
          width: 100%;
          position: relative;
          .cover{
            width: 100%;
            border-radius: 4px;
            height: 100%;
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
        .item_img_g{

        }
        .item_img_a{

        }
        p{
          margin: 8px 0;
          font-size: 12px;
          color: rgb(85,85,85);
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
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
