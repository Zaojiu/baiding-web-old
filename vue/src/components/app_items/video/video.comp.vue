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
        <!--<app-download-tips-->
        <!--class="app-download-tips"-->
        <!--v-if="isAppDownloadTipsShow&&!isInMiniApp"-->
        <!--@close="isAppDownloadTipsShow = false"-->
        <!--&gt;</app-download-tips>-->
        <div class="audio"  v-show="isShowAudio">

          <!--视频顶部内容-->
          <!--<div class="bt_operation">-->
            <!--<span class="likeWhite"  :class="{likeRed:likeVideo}" @click="like()"></span>-->
          <!--</div>-->
          <video ref="player" @click="showBox()"  :src="videoUrl" webkit-playsinline="true" playsinline   :poster="speakerImage" id="article_audio" controlsList='nodownload' class="audio-id"
          ></video>

          <!--视频底部内容-->
          <div class="pos-audio" v-show="isBox">
            <div class="audio_box">
              <a id="play_btn" class="play_btn" v-bind:class="{ on: isOn }" @click="palyPause()"></a>
              <div id="pgs" class="pgs" @click="clickPgs($event)">

                <div id="progress" class="pgs-play" v-bind:style="{ width: cdTimeJ+'%' }"></div>
                <div id="circle" class="circle" @touchmove="touchmoveCricle($event)"  ></div>
              </div>
              <div class="time_p clearfix" >
                <span id="playedTime" class="playedTime"></span>
                <span >{{transTime(cTime)}}/{{transTime(dTime)}}</span>
              </div>
              <div class="big_cover" @click="fullScreen()" >

              </div>
            </div>
          </div>

        </div>
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


    <div class="footer" v-if="isMoney" @click="btnClick()">
      {{(videoInfo.originalPrice)/100}}元购买
    </div>

    <div class="footer" v-if="isMoney" @click="btnClick()" >
      <span class="txt-line">原价:{{(videoInfo.originalPrice)/100}}元</span>
      会员价{{(videoInfo.memberPrice)/100}}元购买
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

    thisVideo:any;
    isVideohtml=false;
    videos='';

    created() {
      if (!isInApp) {
        this.isAppDownloadTipsShow = true;
      }
      axios.defaults.withCredentials = true; //让ajax携带cookie
      this.getvideo();
      this.share();
    }
    getvideo(){
      //用户
      if (this.userInfo && this.userInfo.isMember) {
        this.isMember = true;
      }
      this.isInApp = isInApp;
      axios.get(`${host.io}/api/zj/video/getVedioDetail/` + this.$route.params['id'] + '?type=' + 121).then(res => {
        this.videoUrl = res.data.results.mp4hd;
        let data =res.data.results.mp4hd;
        this.videos =    data;
      // console.log(res.data.results);
      //没有视频信息
        if(JSON.stringify(res.data.results) == "{}"){
          this.isVideohtml=true;
          this.isMoney=false;
        }
        this.myVideo.src = this.videoUrl;
        this.videoInfo = res.data.results;
        this.follow = this.videoInfo.isAttention;
        this.idFollow = this.videoInfo.speakerId;
        this.isPaid = this.videoInfo.isPaid;
        this.speakerImage=this.videoInfo.speakerImage;
        document.title = this.videoInfo.title;//页面title
        //以下根据后台返回视频参数判断
        if (!this.isMember && this.isPaid == 0 && this.videoInfo.originalPrice != 0) {
          console.log('不显示');
          this.isMoney=true;
          this.isShowMember=true;
        } else if (this.isPaid == 0 && this.videoInfo.originalPrice != 0) {
          console.log('不显示视频');
        } else if (this.isMember && this.videoInfo.memberPrice == 0) {
          this.isShowAudio = true;
          this.isMoney=false;
        } else if (this.isMember && this.videoInfo.memberPrice != 0 && this.isPaid == 0) {
          console.log('不显示');
        } else if (this.videoInfo.originalPrice == 0) {
          this.isShowAudio = true;
          this.isMoney=false;
        } else if (this.isPaid == 1) {
          this.isShowAudio = true;
          this.isMoney=false;
        }
        //app中判断
        if (this.isInApp) {
          this.isShowAudio = false;
          this.isMoney=false;
        }
        if (this.videoInfo.isFavourite == 1) {
          this.isFavourite = false;
          this.likeVideo = true;
        } else {
          this.isFavourite = false;
          this.likeVideo = false;
        }
        if (this.videoInfo.isAttention == 1) {
          this.followTxt = '已关注';
        }

        // console.log(this.myVideo);

        this.isLoading = false;
      })
    }

    mounted() {

      this.myVideo = this.$refs.player;
      this.addEventListeners()

    }
//播放/暂停
    palyPause() {
      console.log(this.myVideo);
      let videoId:any =this.$refs.player;
      if (this.playFlag == false) {

        videoId.play();
        this.myVideo.play();
        this.playFlag = true;
        this.isOn = true;

      } else {
        videoId.pause();
        this.myVideo.pause();
        this.playFlag = false;
        this.isOn = false;
      }


    }
    //❤️
    like() {
      let like = getLike(this.$route.params['id'], 121, this.isFavourite);
      var a = Promise.resolve(like);
      let _this = this;
      a.then(function (result) {
        let succ = result;
        if (succ.code == '0') {
          if (_this.isFavourite == true) {//判断是否为喜欢
            _this.isFavourite = false;
            _this.likeVideo = true;
          } else {
            _this.isFavourite = true;
            _this.likeVideo = false;
          }
        }
      })
    }

    //关注与取消
   async cliFollw() {
      // console.log(this.videoInfo.speakerId);
      //跳原生登录
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
        if(this.isInApp){
          showTips('请登录');
          await initIOS();
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
      await getFollow(this.idFollow, 0, isF);
      if (this.follow == 0) {
        this.followTxt = '已关注';
        this.follow = 1;
      } else {
        this.followTxt = '关注';
        this.follow = 0;
      }
  }
    //监测播放状态
    beforeMount() {
      setInterval(() => {
          if (this.myVideo.paused) {
            this.isOn = false;
          } else {
            this.isOn = true;
          }
      }, 1000)
    }

    beforeDestroyed() {
      this.removeEventListeners()

    }

    beforeUpdate() {
      this.cdTime = this.dTime - this.cTime;
      //时间格式化
      const sss = Math.floor(this.cTime) / Math.floor(this.dTime);
      this.cdTimeJ = Math.round(sss * 100);
    }

    //分享
    async share() {

      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/items/video/` + this.$route.params['id'];
        let title = this.videoInfo.shareTitle;
        let image = this.videoInfo.shareImage;
        let desc = this.videoInfo.shareText;
        setShareInfo(
          title,
          desc,
          image,
          url
        );
      }
    }

    showBox() {
      this.isBox = !this.isBox;
    }






    //监测视频时间
    addEventListeners() {
      const self = this;
      this.myVideo.addEventListener('timeupdate', self._currentTime)

      this.myVideo.addEventListener('canplay', self._durationTime)
      this.myVideo.addEventListener('paused', self._paused)

    }

    removeEventListeners() {
      const self = this;
      this.myVideo.removeEventListener('timeupdate', self._currentTime)
      this.myVideo.removeEventListener('canplay', self._durationTime)
      this.myVideo.removeEventListener('paused', self._paused)

    }

    _currentTime() {
      const self = this;
      self.cTime = parseInt(this.myVideo.currentTime)
    }

    _durationTime() {
      const self = this;
      self.dTime = parseInt(this.myVideo.duration)
    }

    _paused() {
      const self = this;
      self.paused = this.myVideo.paused;
    }

    //转换音频时长显示
    transTime(time: any) {

      let duration: any = parseInt(time);
      let vDuration: any = duration / 60;
      let minute: any = parseInt(vDuration);
      let sec = duration % 60 + '';
      let isM0 = ':';
      if (minute == 0) {
        minute = '00';
      } else if (minute < 10) {
        minute = '0' + minute;
      }
      if (sec.length == 1) {
        sec = '0' + sec;
      }
      return minute + isM0 + sec

    }

    //点击进度条
    clickPgs(e: any) {
      let _$: any = $("#pgs");
      let startX = _$.offset().left;
      let endX = e.clientX;  //点击事件的x坐标
      let rate = (endX - startX) / _$.width();
      $("#circle").css({"left": (endX - startX - 1) + "px"});
      this.myVideo.currentTime = rate * this.myVideo.duration;


    }

    //拖拉进度条
    touchmoveCricle(e: any) {
      e.preventDefault();
      let _$: any = $("#pgs");
      let startX = _$.offset().left;
      let endX = e.touches[0].clientX;

      if ((endX + 1) > startX && endX < (startX + _$.width())) {  //触摸范围大于进度条起点，小于进度条终点
        $("#circle").css({"left": (endX - startX - 10) + "px"});
        let rate = (endX - startX) / _$.width();
        this.myVideo.currentTime = rate * this.myVideo.duration;
      }
    }

    //全屏
    fullScreen() {
      var ele: any = this.$refs.player;
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
      }
    }

    //课程时间格式化
    formatSeconds(msd: any) {
      let time: number = parseFloat(msd) / 1000;
      let num: number = 60;
      let result: string = '';
      if (null != time) {
        if (time > 60) {
          let numT: any = time / num;
          let numS = parseInt(numT);
          let numM: any = (parseFloat(numT) - numS) * 60;
          result = numS + "’" + parseInt(numM) + "’’";//课程时长 52’36’’
        } else {
          result = (time) + "’";
        }
      }
      return result;
    }
    //讲者详情
    getUser(id:any){
      //跳原生讲者主页

      if(this.isInApp){
        initIOS();
        callHandler('getUserAd',id);
        return;
      }
      this.$router.push({path: `/app/UserAd/${id}`})
    }

    //点击购买
    btnClick(type: any) {

      //是否有用户信息
      this.getInfo();
      this.goIntro();
    }

    getInfo() {
      this.userInfo = getUserInfoCache();//获取用户信息
    }

    async goIntro() {

      // web 创建订单
      if (!this.checkMobileBinded(this.$route.fullPath)) {
        return;
      }
      this.createOrder();
    }

    async handlePayResultForRedirect() {
      const query = this.$route.query;
      const payResult = query['payResult'];

      if (!payResult) return true;

      if (payResult === 'success') {
        showTips('支付成功');
        setTimeout(() => {
          this.$router.push({path: '/app/book/detail/' + this.$route.params['id']})
        }, 10)
      } else if (payResult === 'cancel') {
        showTips('订单未支付');
      } else {
        showTips('支付失败，请重试');
        console.error(decodeURIComponent(payResult));
      }

      return false;
    }


    checkMobileBinded(to: string) {
      // 未绑定手机
      if (this.userInfo && this.userInfo.isMobileBinded) {
        return true;
      }
      this.$router.push({path: '/mobile-bind-event', query: {redirectTo: to}});
      return false;
    };


    //订单
    async createOrder() {
      // console.log(this.clickType);
      if (this.isPaying) return;

      this.isPaying = true;

      try {
        var bookId = this.$route.params['id'];
        const orderMeta = await createOrder([new PostOrderObjectBook(bookId, OrderObjectType.Course, 1, false)], [], false, '');
        await this.payOrder(orderMeta.orderNo);
      } catch (e) {
        if (e instanceof ApiError) {
          const code = e.code;

          if (code === ApiCode.ErrOrderNeedProcessOthers) {
            const oldOrderNum = e.originError.response && e.originError.response.data.data.orderNo;
            this.payOrder(oldOrderNum);
          } else if (e.isUnauthorized) {
            Store.memoryStore.delete('userInfo');
            showTips(`请登录`);
            this.$router.push({path: '/signin', query: {redirectTo: getRelativePath(location.href, '/lives')}});
          } else {
            const errMessage = ApiErrorMessage[code] || `未知错误: ${code}`;
            showTips(errMessage);
          }

          throw e;
        }
      } finally {
        this.isPaying = false;
      }
    }

    //支付过程
    async payOrder(orderNo: string) {
      let redirectUrl = `${host.self}/item/video/` + this.$route.params['id'];

      await pay(orderNo, redirectUrl);
      setPaymentNone();
      showTips('支付成功');
      this.$router.push({path: '/items/video/' + this.$route.params['id']})

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
