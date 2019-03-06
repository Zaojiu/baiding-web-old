<template>
  <div class="content">
    <div class="poster-con">
      <div class="indexL">

        <div class="audio" v-show="isShowAudio">
          <video ref="player" id="article_audio" class="audio-id"   controlsList="nodownload"
                 ></video>

          <div class="pos-audio">
          <div class="audio_box">
            <a id="play_btn" class="play_btn" v-bind:class="{ on: isOn }" @click="palyPause()"></a>
            <div id="pgs" class="pgs" @click="clickPgs($event)">

              <div id="progress" class="pgs-play" v-bind:style="{ width: cdTimeJ+'%' }"></div>
              <div id="circle" class="circle" @touchmove="touchmoveCricle($event)"  v-bind:style="{ left: cdTimeJ+'%' }"></div>
            </div>
            <div class="time_p clearfix">
              <span id="playedTime" class="playedTime"></span>
              <span >{{transTime(cTime)}}/{{transTime(dTime)}}</span>
            </div>
            <div class="big_cover" @click="fullScreen()">

            </div>
          </div>
          </div>
        </div>
        <div class="content-txt">
          <div class="title">
            <h3>置死地而后生《只狼》破戒僧Boss战演示，重点在这里</h3>
          </div>
          <div class="intro">
            <img src="https://baiding-pub.zaojiu.com/cover/img/Fr2SjMz4qbk6mLu3iOspaEUtpXy3-1539054923.jpg~1-1" alt="">
            <div class="info">
              <strong>张玫</strong>
              <p>碧山旅行 创始人</p>
            </div>

            <button class="follow ">关注</button>
          </div>
          <div class="content_html">
            <p>由 From Softwar 倾力打造的动作游戏《只狼 影逝二度》在科隆游戏展上提供了实机试玩，让不少玩家能够提前领略本作的魅力。
              IGN 在试玩了《只狼 影逝二度》后，总结了十五个玩家需要知晓的信息，下面就是这些信息的内容。</p>

            <p> 玩家和敌人都有名为“战姿槽”（Posture Bar）的设定，当遭受攻击或者没有在正确时间格挡，就会缓慢增长战姿槽。
              当敌人的“战姿槽”攒满之后，他们的防御就会被打破，就像《黑暗之魂》《血源诅咒》中那样，玩家可以使出威力巨大的终结技“忍者终结”
              （Shinobi Finisher）来杀死敌人或者消耗敌人的一整条血槽。如果玩家的战姿槽攒满，那么在下一次攻击时玩家会步伐不稳，会被敌人的强力攻击直接击倒，
              使玩家变得异常脆弱，直到能够闪避开为止。一些比较强的敌人，比如“武士将军”可以发动特殊能力来降低自己的战姿槽，这也说明一味地进行防守并不是明智的选择。</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {Money} from '../../shared/utils/utils';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {PostOrderObject, PostOrderObjectBook, OrderObjectType} from "../../shared/api/order.model";
  import {isInApp, isInWechat, isInWeiBo} from "../../shared/utils/utils";
  import {isOnLargeScreen, isAndroid, isiOS, setScrollPosition} from '../../shared/utils/utils';
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from "../../shared/utils/share";
  import {host} from "../../env/environment";
  import {createOrder} from "../../shared/api/order.api";
  import {ApiError} from "../../shared/api/xhr";
  import {ApiCode} from "../../shared/api/code-map.enum";
  import {Store} from "../../shared/utils/store";
  import {showTips} from "../../store/tip";
  import {getRelativePath,params} from "../../shared/utils/utils";
  import {ApiErrorMessage} from "../../shared/api/code-map.enum";
  import {setPaymentNone} from "../../store/payment";
  import {pay} from "../../shared/api/pay.api";
  import axios from 'axios';
  import jquery from 'jquery'
  import { constants } from 'fs';

  @Component
  export default class poster extends Vue {

    duration=0;
    isOn=false;
    isAudio = false;//是否有音频
    audioUrl='';//音频地址
    playFlag=false;//播放状态
    cdTime=0;//剩余时间
    cdTimeJ = 0;//播放进度
    dTime=0;//总时间
    cTime=0;//播放时间
    isApp = isInApp;
    myAudio: any;
    isShowAudio=false;
    paused=true;

    created(){
//获取信息
      axios.defaults.withCredentials = true; //让ajax携带cookie
      //axios.get(`${host.io}/api/course/resources/`+this.$route.params['id']+'?t='+new Date().getTime()).then(res=>{
        axios.get('http://www.zaojiu.fm/assets/book.json?t='+new Date().getTime() ).then(res=>{
        const list = res.data.resourceInfo;
        this.duration = list.defaultItemInfo.duration;
          this.isShowAudio=true;
          this.audioUrl = list.defaultItemInfo.audioUrl;
          this.myAudio.src=this.audioUrl;


        this.share();


      })
    }
    mounted() {


      this.myAudio = this.$refs.player;
      this.addEventListeners()

    }
    //监测播放状态
    beforeMount(){
      setInterval(()=>{
        if(this.myAudio.paused){
          this.isOn = false;
        }else{
          this.isOn= true;
        }
      },1000)
    }
    beforeDestroyed() {
      this.removeEventListeners()
    }
    beforeUpdate(){
      this.cdTime = this.dTime - this.cTime;
      //时间格式化
      const sss = Math.floor(this.cTime) / Math.floor(this.dTime);
      this.cdTimeJ = Math.round( sss* 100);



    }

    async share() {
      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/book/detail/`+this.$route.params['id'];
        let title = '';
        setShareInfo(
          title,
          'www.zaojiu.com',
          'https://baiding-pub.zaojiu.com/zaojiuUNI@3x.png',
          url
        );
      }
    }

    //播放/暂停
    palyPause(){
      if(this.playFlag==false){
        this.myAudio.play();

        this.playFlag = true;
        this.isOn = true;
      }else{
        this.myAudio.pause();
        this.playFlag = false;
        this.isOn = false;
      }

    }


    //监测音频时间
    addEventListeners () {
      const self = this;
      this.myAudio.addEventListener('timeupdate', self._currentTime)
      this.myAudio.addEventListener('canplay', self._durationTime)
      this.myAudio.addEventListener('paused', self._paused)


    }
    removeEventListeners  () {
      const self = this;
      this.myAudio.removeEventListener('timeupdate', self._currentTime)
      this.myAudio.removeEventListener('canplay', self._durationTime)
      this.myAudio.removeEventListener('paused', self._paused)

    }
    _currentTime () {
      const self = this;
      self.cTime = parseInt(this.myAudio.currentTime)
    }
    _durationTime () {
      const self = this;
      self.dTime = parseInt(this.myAudio.duration)
    }
    _paused() {
      const self = this;
      self.paused = this.myAudio.paused;

    }

//转换音频时长显示
    transTime(time:any) {

      let duration:any = parseInt(time);
      let vDuration:any = duration/60;
      let minute:any = parseInt(vDuration);
      let sec = duration%60+'';
      let isM0 = ':';
      if(minute == 0){
        minute = '00';
      }else if(minute < 10 ){
        minute = '0'+minute;
      }
      if(sec.length == 1){
        sec = '0'+sec;
      }
      return minute+isM0+sec

    }
    //点击进度条
    clickPgs(e:any){
      let _$:any = $("#pgs");
      let startX = _$.offset().left;
      let endX = e.clientX;  //点击事件的x坐标
      let rate=(endX - startX) / _$.width();
      $("#circle").css({"left":(endX-startX-1)+"px"});
      this.myAudio.currentTime=rate*this.myAudio.duration;


    }
    //拖拉进度条
    touchmoveCricle(e:any){
      e.preventDefault();
      let _$:any = $("#pgs");
      let startX = _$.offset().left;
      let endX = e.touches[0].clientX;

      if((endX+1) > startX && endX < (startX+_$.width())){  //触摸范围大于进度条起点，小于进度条终点
        $("#circle").css({"left":(endX-startX-1)+"px"});
        let rate = (endX - startX) / _$.width();
        this.myAudio.currentTime=rate*this.myAudio.duration;
      }
    }

     fullScreen(){
      var ele:any = this.$refs.player;
      if (ele .requestFullscreen) {
        ele .requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele .webkitRequestFullScreen) {
        ele .webkitRequestFullScreen();
      }
    }

    //课程时间格式化
    formatSeconds(msd:any){
      let time:number = parseFloat(msd) / 1000;
      let num:number=60;
      let result:string = '';

      if (null != time) {
        if (time > 60) {
          let numT:any = time/num;
          let numS = parseInt(numT);
          let numM:any = (parseFloat(numT)-numS)*60;

          result = numS + "’" + parseInt(numM) + "’’";//课程时长 52’36’’
        }else {
          result = (time) + "’";
        }
      }
      return result;
    }
  }


</script>


<style lang="scss" scoped>
  .content{

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
              width: 45px;
              height: 45px;
              margin-right: 10px;
              border-radius: 50%;
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
                margin-top: 5px;
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
              margin-top: 10px;
            }
            .isFlolow{
              color: rgb(179,179,179);
              background: rgb(239,239,239);
            }
          }
          .content_html{
            font-size: 14px;
            line-height: 28px;
            color: rgb(166,166,166);
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
      }

      .play_btn{
        position: absolute;
        top: 8px;
        left: 0;
        display: inline-block;
        width: 24px;
        height: 24px;

        background: url(https://baiding-pub.zaojiu.com/book/play2@3x.png) no-repeat 50%;
        background-size: 100% 100%;

      }
      .on{
        background: url('https://baiding-pub.zaojiu.com/book/play@3x.png') no-repeat center;
        background-size: 100% 100%;
      }
      .pos-audio{
      position: absolute;
        bottom: 5px;
        width: 100%;
        background: rgba(0,0,0,.7);
      .audio_box {
        position: relative;
        width: 95%;
        height: 40px;

        margin: 5px auto;
        //background-color: rgb(245, 245, 245);
        .pgs{
          position: relative;
          top: 16px;
          left: 30px;
          width: 60%;
          height: 4px;
          background-color: rgba(235,235,235,1);
          text-align: center;
          border-radius: 2px;
          .pgs-play{
            position: absolute;
            top:0;
            left: 0;
            width: 0;
            height: 100%;
            background-color: rgba(0,211,193,1);
            z-index: 1;
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
        .big_cover{
          position: absolute;
          width: 24px;
          height: 24px;
          background: red;
          top: 8px;
          right: 6px;
        }
        .time_p{
          position: absolute;
          top: 11px;
          right: 35px;
          font-size: 12px;
          color: rgb(143,143,143);
        }
      }

      }
    }
  }

</style>
