<template>
  <div class="content">
    <div v-if="isLoading" style="background-color: #fff;width: 100%;height: 100vh;position: fixed;top: 0;left: 0;z-index: 99999999;">
      <bd-loading class="abs-center" ></bd-loading>
    </div>
    <app-download-tips
      class="app-download-tips"
      v-if="isAppDownloadTipsShow"
      @close="isAppDownloadTipsShow = false"
    ></app-download-tips>
    <div style="width: 100%;height: 100vh;background-color: #fff;z-index: 9999;" v-show="isVideohtml">
      <div class="noList" >
        暂无此视频内容
      </div>
    </div>
    <div class="poster-con">
      <div class="indexL">


        <div class="content-txt">
          <div class="title">
            <h3>{{videoInfo.title}}</h3>
          </div>
          <div class="intro">
            <!--<img :src="videoInfo.speakerImage" alt="" @click="getUser(videoInfo.speakerId)">-->
            <img :src="videoInfo.speakerImage" alt="" >
            <div class="info">
              <strong>{{videoInfo.company}}</strong>
              <p>{{videoInfo.speakerTitle}}</p>
            </div>

            <span class="follow" @click="cliFollw()" :class="{yesFollow:follow==1}">{{followTxt}}</span>
          </div>
          <div class="content_html" v-html="videoInfo.text">
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
  import {pay} from "../../../shared/api/pay.api";
  import appDownloadTips from '../../../shared/app-download-tips.comp.vue';
  import {ApiErrorMessage} from "../../../shared/api/code-map.enum";
  import axios from 'axios';
  import jquery from 'jquery'
  import { constants } from 'fs';
  import {UserInfoModel} from '../../../shared/api/user.model';
  import {getUserInfoCache,getFollow,getLike} from "../../../shared/api/user.api";
  import {setPaymentNone} from "../../../store/payment";
  import {initIOS, callHandler} from "../../../shared/utils/ios";
  declare var $:any;
  // declare var document:any;
  @Component({
    components: {
      appDownloadTips: appDownloadTips
    }
  })
  export default class poster extends Vue {
    userInfo: UserInfoModel | null = null;
    duration = 0;
    isOn = false;
    videoUrl = '';//视频地址
    playFlag = false;//播放状态
    cdTime = 0;//视频剩余时间
    cdTimeJ = 0;//播放进度
    dTime = 0;//视频总时间
    cTime = 0;//视频播放时间
    isInApp = isInApp;
    myVideo: any;
    isShowAudio = false;
    paused = true;
    isBox = true;
    follow = 0;//是否关注
    followTxt = '关注';
    isAppDownloadTipsShow = false;
    likeVideo = false;
    favourite = 0;//粉丝
    videoInfo: any = '';//视频信息
    idFollow:any;//关注id
    isFavourite = false;//是否喜欢
    isPaid = 0;//是否购买过（0，1）
    isMember = false;//是否为会员
    isPaying = false;
    isLoading = true;//加载是否完成
    isMoney = true;//显示原价
    isShowMember=false;//显示会员价
    speakerImage='';
    isVideohtml=false;

    created() {
      if (!isInApp) {
        this.isAppDownloadTipsShow = true;
      }
      axios.defaults.withCredentials = true; //让ajax携带cookie
      this.getvideo();
    }
    getvideo(){
      //用户
      if (this.userInfo && this.userInfo.isMember) {
        this.isMember = true;
      }
      this.isInApp = isInApp;
      axios.get(`${host.io}/api/zj/video/getVedioDetail/` + this.$route.params['id'] + '?type=' + 121).then(res => {

        this.videoInfo = res.data.results;
        this.follow = this.videoInfo.isAttention;
        this.idFollow = this.videoInfo.speakerId;
        this.isPaid = this.videoInfo.isPaid;
        this.speakerImage=this.videoInfo.speakerImage;
        document.title = this.videoInfo.title;//页面title

        this.isLoading = false;
      })
    }
    mounted() {

    }
    //关注与取消
    cliFollw() {

      // console.log(this.videoInfo.speakerId);
      //跳原生登录
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
        if(this.isInApp){
          showTips('请登录');
          initIOS();
          callHandler('login');
          return;
        }
      }finally{
      }


      let isF: any;
      if (this.follow == 0) {//判断关注或取消
        isF = true
      } else {
        isF = false;
      }
      let follow = getFollow(this.idFollow, 0, isF);
      var a = Promise.resolve(follow);
      let _this = this;
      a.then(function (result) {
        let succ = result;
        if (succ.code == '0') {
          if (_this.follow == 0) {
            _this.followTxt = '已关注';
            _this.follow = 1;
          } else {
            _this.followTxt = '关注';
            _this.follow = 0;
          }
        }
      })

    }
    showBox() {
      this.isBox = !this.isBox;
    }

    //讲者详情
    getUser(id:any){
      //跳原生讲者主页
      //
      // if(this.isInApp){
      //   initIOS();
      //   callHandler('getUserAd',id);
      //   return;
      // }
      // this.$router.push({path: `/app/UserAd/${id}`})
    }
    getInfo() {
      this.userInfo = getUserInfoCache();//获取用户信息
    }


  }



</script>


<style lang="scss" scoped>

  .content_html >>> img{

    max-width: 100%;
    height: auto;
  }

  .content{
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
    .poster-con{


      opacity: 0.9;

      overflow: hidden;
      position: relative;
      .indexB{
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        opacity: .1;
        img{
          width: 100%;
        }
      }
      .indexL{
        z-index: 4;
        .tit{
          position: absolute;
          top: 18px;
          left: -42px;

          font-size: 14px;
          padding: 5px 46px;
          font-weight: 700;
          transform: rotate(-45deg);
        }
        .pos-img{
          width: 120px;
          //height: 170px;
          margin:0px auto 10px auto;


          img{
            width: 100%;
            height: 100%;
            box-shadow: 0 5px 16px rgba(0,0,0,0.3);
            border-radius: 5px;
          }
        }
        .pos-time{
          text-align: center;
          font-size: 14px;
          color: rgba(166,166,166,1);
        }
        .audio{
          position: relative;
        }
        .pos-txt{
          margin: 0 15px;
          padding-bottom: 60px;
          h3{
            font-size: 20px;
            width: 260px;
            text-align: center;

            padding-top: 20px;
            padding-bottom: 20px ;
            margin: 0 auto;
            color: rgba(33,33,33,1);
          }
          .ht_class{
            font-size: 14px;
            line-height: 28px;
            color: rgba(166,166,166,1);
            p{
              font-size: 14px;
              line-height: 28px;
              color: rgba(166,166,166,1);
            }
          }

        }
        .poster-footer{
          margin:30px 15px 0 15px;
          overflow: hidden;
          padding-bottom: 40px;
          .img{

            width: 75px;
            height: 75px;
            float: left;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .txt{
            margin-left: 90px;
            color: #fff;
            line-height: 28px;
            padding: 12px 0;
            h4{
              font-size: 16px;
            }
            p{
              font-size: 14px;
            }
          }
        }
        .content-txt{
          padding: 0 20px;
          margin-bottom: 60px;
          .title{
            font-size: 20px;
            line-height: 28px;
            color: rgb(85,85,85);
            margin: 16px 0 20px 0;
          }
          .intro{
            overflow: hidden;
            margin-bottom: 24px;
            img{
              float: left;
              width: 40px;
              height: 40px;
              margin-right: 10px;
              border-radius: 50%;
              object-fit: cover;
            }
            .info{
              width: 62%;
              float: left;
              strong{
                font-size: 14px;
                line-height: 18px;
                color: rgb(85,85,85);
              }
              p{
                font-size: 12px;
                line-height: 16px;
                color: rgb(179,179,179);
                width: 100%;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space :nowrap;
                margin-top: 2px;
              }
            }

            .follow{
              float: right;
              width: 56px;
              height: 24px;
              text-align: center;
              line-height: 24px;
              border-radius: 4px;
              color: #fff;
              background: $color-brand;
              font-size: 12px;
              margin-top: 8px;
              cursor: pointer;
              transition: background-color 0.5s;
            }
            .yesFollow{
              background-color: rgb(239,239,239);
              color: rgb(179,179,179);
            }
          }
          .content_html{
            font-size: 14px;
            line-height: 28px;
            color: rgb(166,166,166);
            overflow: hidden;

          }


        }

      }

      .go_money{
        position: fixed;
        height: 50px;
        bottom:0;
        left: 0;
        width: 100%;
        background: #fff;
        .left{
          float: left;
          width: 38%;
          color: #00edda;
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          line-height: 50px;
        }
        .isMember{
          font-size: 14px;
        }
        .txt-line{
          font-weight: normal;
          text-decoration: line-through;
          padding-right: 10px;
          position: absolute;
          top: -13px;
          left: 11px;
          font-size: 12px;
        }
        .right{
          float: right;
          text-align: center;
          width: 62%;
          background: #00edda;

          color: #fff;
          height: 50px;
          p{
            font-size: 18px;
            font-weight: 600;
            line-height: 18px;
            margin: 10px 0 1px 0;

          }

          span{
            font-size: 12px;
            line-height: 14px;
            display: inherit;
          }
        }

      }

    }
    .title{
      line-height: 40px;
      h2{
        font-size: 18px;
        text-align: center;
        color: rgba(56,56,56,1);
      }
    }
    .audio{
      .audio-id{
        /*display: none;*/
        width: 100%;
        height: 207px;
        font-size: 0;
        object-fit:cover;
      }
      .bt_operation{
        position: absolute;
        top: 0;
        right:0;
        height: 30px;
        padding-top: 5px;
        padding-right: 12px;
        z-index: 1000;
        span{
          display: inline-block;
          width: 24px;
          height: 24px;
          margin-left: 20px;
        }
        .likeWhite{
          background: url("assets/groupN.png") no-repeat center;
          background-size: 24px;
        }
        .likeRed{
          background: url("assets/groupY.png") no-repeat center;
          background-size: 24px;
        }
        .headset{
          background: url("assets/headset.png") no-repeat center;
          background-size: 24px;
        }
        .videoPlay{
          background: url("assets/videoCopy@2x.png") no-repeat center;
          background-size: 26px 24px;
        }

      }
      .show_audio{
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgb(0,0,0);
        line-height: 217px;
        text-align: center;
        p{
          font-size: 14px;
          font-weight: 700;
          color: rgba(255,255,255,0.8);

        }
      }
      .play_btn{
        position: absolute;
        bottom: 3px;
        left: 8px;
        display: inline-block;
        width: 24px;
        height: 24px;

        background: url('assets/smallPlay.png') no-repeat 50%;
        background-size: 100% 100%;

      }
      .on{
        background: url('assets/smallPause.png') no-repeat center;
        background-size: 100% 100%;
      }
      .pos-audio{
        position: absolute;
        bottom: 5px;
        width: 100%;
        /*background: rgba(0,0,0,.7);*/
        .audio_box {
          position: relative;
          width: 100%;
          height: 44px;

          background:-webkit-linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.3));

          background:-o-linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.3));

          background:-moz-linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.3));

          background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.3));
          .pgs{
            position: absolute;
            bottom: 13px;
            left: 38px;
            right: 109px;
            height: 4px;
            background-color: rgba(255,255,255,0.5);
            text-align: center;
            border-radius: 2px;
            .pgs-play{
              position: absolute;
              top:0;
              left: 0;
              width: 0;
              height: 100%;
              background-color: rgba(255,255,255,1);
              z-index: 1;
              border-radius: 2px;
            }
            .circle{
              position: absolute;
              top: -5px;
              left: -5px;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background-color: #fff;
              z-index: 2;
            }

          }
          .pgs_right88{
            right: 88px;
          }
          .big_cover{
            position: absolute;
            width: 24px;
            height: 24px;
            background: url("assets/bigCover.png") no-repeat center;
            background-size: 24px;
            bottom: 4px;
            right: 8px;
          }
          .time_p{
            position: absolute;
            bottom: 7px;
            right: 35px;
            font-size: 12px;
            color: #fff;
          }
          .time_right12{
            right: 12px;
          }
        }

      }

    }
    .footer{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      line-height: 50px;
      font-weight: 700;
      font-size: 18px;
      text-align: center;
      background-color: $color-brand;
      color: #fff;
      .txt-line{
        font-weight: normal;
        text-decoration: line-through;
        padding-right: 10px;
        position: absolute;
        top: -14px;
        left: 50%;
        font-size: 14px;
        margin-left: -120px;
      }
    }

  }

</style>
