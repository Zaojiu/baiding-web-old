<template>
  <div class="content">
    <div class="poster-con">
      <div class="indexL">
        <div class="pos-img" >
          <img :src="coverUrl" alt="">
        </div>
        <div class="pos-time" >
          <span>课程时长</span> <span>{{formatSeconds(duration)}}</span>
        </div>
        <div class="audio" v-show="isPaid ">
          <audio ref="player" id="article_audio" class="audio-id" controls  ></audio>
          <div class="audio_box">
            <a id="play_btn" class="play_btn" v-bind:class="{ on: isOn }" @click="palyPause()"></a>
            <div id="pgs" class="pgs" @click="clickPgs($event)">
              <div id="progress" class="pgs-play" v-bind:style="{ width: cdTimeJ+'%' }"></div>
              <div id="circle" class="circle" @touchmove="touchmoveCricle($event)" @touchstart="" v-bind:style="{ left: cdTimeJ+'%' }"></div>
            </div>
            <div class="time_p clearfix">
              <span id="playedTime" class="playedTime"></span>
              <span >{{transTime(cdTime)}}</span>

            </div>
          </div>
        </div>
        <div class="pos-txt" >
          <h3 v-text="subject" ></h3>
          <div v-html="content">
          </div>
        </div>

      </div>
      <div class="go_money" v-show="!isPaid && !isApp">
        <div class="left isMember" v-if="isMember" @click="btnClick(false)"><span class="txt-line">原价:{{totalFee}}元</span><span >会员价:{{memberFee}}元</span></div>
        <div class="left" v-if="!isMember" @click="btnClick(false)"><span >{{totalFee}}</span>元</div>
        <div class="right" @click="btnClick(true)">
          <p>{{groupBuyFee}}元</p>
          <span>分享海报享团购价</span>
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

  @Component
  export default class poster extends Vue {
    userInfo: UserInfoModel | null = null;
    isOnScreen = isOnLargeScreen;
    isVideoPlayed = false;
    isLandscape = false;
    coverUrl = '';
    seeking = false;
    memberType = 'member-aia-mars';
    isPaying = false;
    isLoading = false;
    subject='';
    content='';
    duration=0;
    totalVol=0;
    totalFee=0;
    groupBuyFee=0;
    memberFee=0;
    isOn=false;
    isAudio = false;//是否有音频
    audioUrl='';//音频地址
    playFlag=false;//播放状态
    cdTime=0;//剩余时间
    cdTimeJ = 0;//播放进度
    dTime=0;//总时间
    cTime=0;//播放时间
    clickType=false;//购买类型
    isPaid=false;//是否购买
    isApp = isInApp;
    myAudio: any;
    isMember=false;



    mounted() {
      //获取信息
      axios.defaults.withCredentials = true; //让ajax携带cookie
      axios.get(`${host.io}/api/course/resources/`+this.$route.params['id']+'?t='+new Date().getTime()).then(res=>{
        // axios.get('http://www.zaojiu.fm/assets/book.json?t='+new Date().getTime() ).then(res=>{
        const list = res.data.resourceInfo;
        this.coverUrl =  list.coverUrl+'~5-7';
        this.subject = list.subject;
        this.content = list.content;
        this.duration = list.defaultItemInfo.duration;
        this.totalVol = list.totalVol;
        this.totalFee = list.totalFee/100;
        this.groupBuyFee = list.groupBuyFee/100;
        this.memberFee = list.memberFee/100;
        this.isPaid =  res.data.resUserInfo.isPaid;

        //优惠购买未分享
        if(this.isPaid == true && res.data.resUserInfo.purchaseType==2 && res.data.resUserInfo.isShare==false){
          this.$router.push({path: '/book/poster/'+this.$route.params['id']})
        }
        if (this.userInfo && this.userInfo.isMember) {
          this.isMember = true;
        }

        if(this.isPaid && list.defaultItemInfo.audioUrl!='' && list.defaultItemInfo.audioUrl!=null){
          this.audioUrl = list.defaultItemInfo.audioUrl;
          this.myAudio.src=this.audioUrl;
          this.isAudio = true;
        }

      })
      this.handlePayResultForRedirect();
      try {
        this.userInfo = getUserInfoCache(false);
      } catch (e) {
      } finally {
      }
      this.myAudio = this.$refs.player;
      this.addEventListeners()

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
    //点击购买
    btnClick(type:any){
      this.clickType = type;
      //是否有用户信息

      this.goIntro();


    }
    async goIntro() {
      this.userInfo = getUserInfoCache();//获取用户信息

      //安卓端购买跳转
      /*if (this.isAndroid) {
        await initIOS();
        callHandler('payOrder', `${host.self}/orders?items=${encodeURIComponent(JSON.stringify([this.memberOrderObject]))}`);
        return;
      }*/

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
            this.$router.push({path: '/book/detail/'+this.$route.params['id']})
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
      console.log(this.clickType);
      if (this.isPaying) return;

      this.isPaying = true;

      try {
        var bookId = this.$route.params['id'];
        const orderMeta = await createOrder([new PostOrderObjectBook(bookId, OrderObjectType.Course, 1, this.clickType)], [], false,'');
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
      let redirectUrl = `${host.self}/book/detail/`+this.$route.params['id'];

      await pay(orderNo, redirectUrl);
      setPaymentNone();
      showTips('支付成功');
      if(this.clickType){
        this.$router.push({path: '/book/poster/'+this.$route.params['id']})
      }else{
        this.$router.push({path: '/book/detail/'+this.$route.params['id']})
      }
      //

      //this.$router.push({path: '/book/poster/`'+this.$route.params['id']})
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

    }
    removeEventListeners  () {
      const self = this;
      this.myAudio.removeEventListener('timeupdate', self._currentTime)
      this.myAudio.removeEventListener('canplay', self._durationTime)

    }
    _currentTime () {
      const self = this;
      self.cTime = parseInt(this.myAudio.currentTime)
    }
    _durationTime () {
      const self = this;
      self.dTime = parseInt(this.myAudio.duration)
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

          result = numS + "分" + parseInt(numM) + "秒";
        }else {
          result = (time) + "秒";
        }
      }
      return result;
    }
  }


</script>


<style lang="scss" scoped>
  .content{

    .poster-con{
      //background: rgba(0,0,0,0.8) url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538384263908&di=ff9e0ac0b0a9a632b0042dfc96c51670&imgtype=0&src=http%3A%2F%2Fpic42.photophoto.cn%2F20170202%2F0008118265891464_b.jpg")no-repeat center;
      //background-size: cover;

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
        padding-top: 30px;
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
          margin:0px auto 20px auto;

          img{
            width: 100%;
            height: 100%;
          }
        }
        .pos-time{
          text-align: center;
          font-size: 14px;

        }
        .audio{
          margin-top: 15px;
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
          }
          p{
            margin-top: 20px;
            font-size: 14px;
            line-height: 28px;
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
          font-weight: 700;
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
            font-weight: 700;
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
        display: none;
      }
      .audio_box {
        position: relative;
        width: 95%;
        height: 56px;
        border-radius: 8px;
        margin: 5px auto;
        background-color: rgb(245, 245, 245);

        .pgs{
          position: relative;
          top: 23px;
          left: 58px;
          width: 66%;
          height: 10px;
          background-color: rgba(235,235,235,1);
          text-align: center;
          border-radius: 10px;
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
            top: -7px;
            left: -5px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #fff;
            z-index: 2;
          }
        }
        .play_btn{
          position: absolute;
          top: 12px;
          left: 14px;
          display: inline-block;
          width: 36px;
          height: 36px;
          background:url('../../assets/img/play2@3x.png') no-repeat center;
          background-size: 100% 100%;
        }
        .on{
          background: url('../../assets/img/play@3x.png') no-repeat center;
          background-size: 100% 100%;
        }
        .time_p{
          position: absolute;
          top: 20px;
          right: 15px;
          font-size: 12px;
          color: rgb(143,143,143);
        }


      }
    }
  }

</style>
