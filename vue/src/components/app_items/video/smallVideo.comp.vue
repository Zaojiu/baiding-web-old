
<template>
  <div class="content">
    <app-download-tips
      class="app-download-tips"
      v-if="isAppDownloadTipsShow"
      @close="isAppDownloadTipsShow = false"
    ></app-download-tips>
    <div class="swiper-container">

        <div   ref="video">
          <div class="video">
            <video ref="player" class="video-id" loop="loop"  webkit-playsinline="true" playsinline x5-video-player-type="h5" x5-video-player-fullscreen="true" :src="item.shortUrl" :poster="item.image"></video>
            <div class="video_info">
              <div class="pos_info">
                <span class="like" ref="likes" @click="like(item.id,item.type,0)" :class="{likeRed:item.isFavourite}"><i>{{item.favourite}}</i></span>
                <!--分享次数-->
                <span class="share" @click="getShare()"></span>
                <span class="longVideo" @click="getVideoTil(item.longUrlId)"><i class="numI" :class="{numINo:item.longUrlId==0}">正片</i></span>
                <div class="info_img">
                  <div class="img">
                    <img :src="item.speakerImage"
                         alt="" @click="getUser(item.speakerId)">
                    <i class="iBlock" @click="follow(item.speakerId,0)" :class="{noneI:item.isAttention==1}"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="video_user_info">
              <div class="info_left">
                <!---->
                <h3>{{item.title}}</h3>
                <!--<p>{{item.title}}</p>-->
                <div class="label_name" >
                  <div class="width_auto" >
                    <span v-for="(item,index) in item.tags" @click="getLabel(item.id)">{{item.name}}</span>

                  </div>

                </div>
              </div>
            </div>
            <div class="vPlay" @click="palyPause()" :class="{ playL: isPlay }" >
            </div>
          </div>
        </div>

      </div>
    </div>


</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {Money} from '../../../shared/utils/utils';
  import {UserInfoModel} from '../../../shared/api/user.model';
  import {PostOrderObject, PostOrderObjectBook, OrderObjectType} from "../../../shared/api/order.model";
  import {isInApp, isInWechat, isInWeiBo} from "../../../shared/utils/utils";
  import {isOnLargeScreen, isAndroid, isiOS, setScrollPosition} from '../../../shared/utils/utils';
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from "../../../shared/utils/share";
  import {host} from "../../../env/environment";
  import {createOrder} from "../../../shared/api/order.api";
  import {ApiError} from "../../../shared/api/xhr";
  import {ApiCode} from "../../../shared/api/code-map.enum";
  import {Store} from "../../../shared/utils/store";
  import {showTips} from "../../../store/tip";
  import {getRelativePath,params} from "../../../shared/utils/utils";
  import {ApiErrorMessage} from "../../../shared/api/code-map.enum";
  import {setPaymentNone} from "../../../store/payment";
  import {pay} from "../../../shared/api/pay.api";
  import appDownloadTips from '../../../shared/app-download-tips.comp.vue';
  import axios from 'axios';
  import jquery from 'jquery'
  import { constants } from 'fs';
  import Swiper from 'swiper';
  import {getUserInfoCache,getFollow,getLike} from "../../../shared/api/user.api";
  declare var $:any;
  declare var swiper:any;
  declare var direction:any;

  @Component({
    components: {
      appDownloadTips: appDownloadTips
    }
  })

  export default class poster extends Vue {
    userInfo: UserInfoModel | null = null;
    videoUrl='';//视频地址
    playFlag=false;//播放状态
    myVideo: any;
    isOn=false;
    likeVideo=false;//喜欢视频
    isFollow:any=[];//是否关注
    isFavourite:any=[];//是否喜欢
    startTime=0;
    endTime=0;
    now=0;
    main: any;
    swiper:any=Swiper;
    _$='$';
    videoList:any=[];//短视频集合
    vList:any;//dom集合
    pIndex=-1;//播放下标
    loadList=1;//指定下标加载
    pageIndex=0;//视频页码
    shareTitle='';
    shareVideo:any=[];//存储
    item:any='';//短视频内容
    isPlay=false;
    isAppDownloadTipsShow = false;
    created(){
      if (!isInApp) {
        this.isAppDownloadTipsShow = true;
      }
      axios.defaults.withCredentials = true; //让ajax携带cookie

      this.getVideo();
      if(isInWechat){
        console.log('在微信中打开');
      }
    }
    mounted() {
      this.vList = this.$refs;
    }
    //初次请求
    getVideo(){
      // axios.get(`${host.io}/api/course/resources/`+this.$route.params['id']+'?t='+new Date().getTime()).then(res=>{
      axios.get(`${host.io}/api/zj/video/getShortVideoDetail/${this.$route.params['id']}?type=200&pageIndex=${this.pageIndex}&pageSize=5`).then(res=>{
        let data:any= res.data.results.items[0];
        if(data==''){
          console.log('暂无更多数据');
        }
       this.item= res.data.results.items[0];
        this.shareVideo=res.data.results.items[0];//分享内容
        console.log(this.item);
        this.isFollow.push(this.item.isAttention);
        this.share();
      })
    }

//❤️传参 1.页面根据下标修改样式2.传递视频ID到后台
    like(id:any,type:any,index:any){
      this.userInfo = getUserInfoCache();//获取用户信息
      let isFavourite:any;
      if(this.isFavourite[index]==0){
        isFavourite=true;
      }else{
        isFavourite=false;
      }
      //取消还是喜欢
      if(isFavourite==true){
        getLike(id,200,isFavourite);
        $('.like').eq(index).addClass('likeRed');
        let likeNum =parseInt($('.like').eq(index).find('i').text());
        $('.like').eq(index).find('i').text(likeNum+1);
        this.isFavourite[index]=1;
      }else{
        getLike(id,200,isFavourite);
        $('.like').eq(index).removeClass('likeRed');
        let likeNum =parseInt($('.like').eq(index).find('i').text());
        $('.like').eq(index).find('i').text(likeNum-1);
        this.isFavourite[index]=0;

      }
    }
    //follow传参 1.页面根据下标修改样式2.传递视频ID到后台
   async follow(id:any,index:any){
      this.userInfo = await getUserInfoCache();//获取用户信息
      // debugger;
      // $('.iBlock').eq(index).css({"transform":`rotate(${(this.followClick)*360}deg`});
      // this.userInfo = getUserInfoCache();//获取用户信息
      let isFollow:any;
      console.log(this.isFollow[index]);
      if(this.isFollow[index]==0){
        isFollow=true;
      }else{
        isFollow=false;
      }

      await getFollow(id,0,isFollow);
      //取消还是关注
      // $('.iBlock').eq(index).css({'transform':'rotate(-360deg)','transition':'all 0s'});
      if(isFollow){
        $('.iBlock').eq(index).addClass('noneI');
        this.isFollow[index]=1;
      }else{
        $('.iBlock').eq(index).removeClass('noneI');
        this.isFollow[index]=0;
      }
    }
    //播放/暂停
    palyPause(){

      if(this.isPlay){
        this.vList.player.pause();
        this.isPlay=false;
      }else{
        this.vList.player.play();
        this.isPlay=true;
      }

    }
    //按钮样式切换
    choose (index:number) {
      this.pIndex = index
    }

    //标签详情
    getLabel(id:any){
      this.$router.push({path: `/app/labelAd/${id}`})
    }
    //讲者详情
    getUser(id:any){
      this.$router.push({path: `/app/UserAd/${id}`})
    }
    //长视频详情
    getVideoTil(id:any){

      if(id==0){
        return;
      }
      this.$router.push({path: `/items/video/${id}`})
    }
    getShare(){
      if(isInWechat){
        showTips('点击右上角分享');
      }

    }
    //分享
    async share() {
      console.log(this.shareVideo);
      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/items/smallVideo/` + this.shareVideo.id;
        let title = this.shareVideo.shareTitle;
        let image = this.shareVideo.shareImage;
        let desc =this.shareVideo.shareText;
        setShareInfo(
          title,
          desc,
          image,
          url
        );
      }
    }

  }



</script>


<style lang="scss" scoped>
  @import "~swiper/dist/css/swiper.min.css";
  html, body {
    position: relative;
    height: 100%;
  }
  body {
    background: #eee;
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    color:#000;
    margin: 0;
    padding: 0;
  }
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {

    font-size: 18px;
    background: #fff;


  }
  .content{
    .swiper-slide{
      height: 200px;
    }

    ::-webkit-scrollbar {
      display: none;
    }
    .video{
      width: 100%;
      position: relative;
      background: #000;
      color: #fff;
      .video-id{
        width: 100%;
        height: 100vh;
        z-index: 1;

      }
      .video_info{
        position: absolute;
        right: 20px;
        bottom: 65px;
        z-index: 10;
        .pos_info{

          span{
            display: block;

            text-align: center;
            width: 36px;
            margin: 0 auto 24px auto;

            i{

              font-size: 16px;
              font-weight: 700;
              font-style: normal;
              text-shadow:0 1px 2px  #383838;
            }
            .numI{
              font-size: 13px;
              font-weight: 700;
              font-style: normal;
              text-shadow: 0 1px 2px #383838;
            }
            .numINo{
              opacity: 0.65;
            }
          }
          .like{
            padding-top: 38px;
            background: url("assets/groupN.png") no-repeat center 0;
            background-size: 36px;
            transition: 1.5s;
          }
          .likeRed{
            background: url("assets/groupY.png") no-repeat center 0;
            background-size: 36px;
          }
          .share{
            padding-top: 30px;
            background: url("assets/share.png") no-repeat center 0;
            background-size: 36px;
          }
          .longVideo{
            padding-top: 30px;
            background: url("assets/whiteVideo.png") no-repeat center 0;
            background-size: 36px;
          }
        }
        .info_img{
          .img{
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid #fff;
            position: relative;

            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
            .iBlock{
              position: absolute;
              bottom: -10px;
              left: 14px;
              display: inline-block;
              width: 20px;
              height: 20px;
              background: $color-brand url("assets/add.png") no-repeat center;
              background-size: 11px 9px;
              border-radius: 50%;
              transition: 1s;
            }
            .noneI{
              background: $color-brand url("assets/duihao.png") no-repeat center;
              background-size: 11px 9px;
              border-radius: 50%;
              transition: 1s;
              transform: rotate(360deg);
            }
          }
        }

      }
      .video_user_info{
        position: absolute;
        bottom: 36px;
        left: 20px;
        right: 20px;
        .info_left{
          padding-right: 65px;
          h3{
            font-size: 18px;
            line-height: 22px;
            overflow: hidden;
            text-overflow:ellipsis;//文本溢出显示省略号
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 8px;
          }
          p{
            font-size: 16px;
            line-height: 20px;
            font-weight: 700;
            margin: 2px 0 8px 0;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
          }
          .label_name{

            font-size: 16px;
            font-weight: 700;
            height: 24px;
            white-space : nowrap;
            overflow: auto;
            .width_auto{

            }
            span{
              margin-right: 10px;
            }
          }
        }

      }
      .vPlay{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -44px;
        margin-top: -44px;
        width: 88px;
        height: 88px;
        background: url("assets/smPlay.png") no-repeat center;
        background-size: 88px;
        z-index: 333;
      }
      .playL{
        /*background: url("assets/bigPlayY.jpg") no-repeat center;*/
        background-size: 88px;
        transition: 1.5s;
        opacity: 0;
      }
    }

  }

</style>
