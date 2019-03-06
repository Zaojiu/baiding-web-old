<template>
  <div>
    <div class="poster-con">

      <div class="indexB" >
        <img :src="coverUrl" alt="">
      </div>
      <div class="indexL">
        <!-- <p class="tit">造就·拆书</p> -->
        <div class=bg_tit></div>
        <p class="share" v-if="isShare==false && isApp==false">分享该海报页，即可畅听音频</p>
        <div class="pos-img" >
          <img :src="coverUrl" alt="">
        </div>
        <div class="pos-time" >
          <span v-text="totalVol"></span>课 / <span>{{formatSeconds(duration)}}</span>
        </div>
        <div class="pos-txt">
          <h3 v-text="subject" ></h3>
         <div class="ht_class" v-html="shareContent">
         </div>
        </div>
        <div class="poster-footer" >
          <div class="txt" @click="getDetail()">
            <h4>查看详情</h4>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {isInApp,isInWechat} from "../../shared/utils/utils";
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from "../../shared/utils/new_share";
  import axios from 'axios';
  import {host} from "../../env/environment";
import { concat } from 'rxjs/operator/concat';
   @Component
  export default class poster extends Vue {
     isApp = isInApp;
       coverUrl='';
      subject='';
      shareContent='';
      duration=0;
      totalVol=0;
      isShare=true;//是否分享
      created(){

      }
        mounted() {

     
          axios.defaults.withCredentials = true; //让ajax携带cookie
         axios.get(`${host.io}/api/course/resources/`+this.$route.params['id']+'?t='+new Date().getTime()).then(res=>{
         //axios.get('http://www.zaojiu.fm/assets/book.json').then(res=>{
        const list = res.data.resourceInfo;
        this.coverUrl =  list.coverUrl+'~5-7';
        this.subject = list.subject;
        this.shareContent = list.shareContent;
        this.duration = list.defaultItemInfo.duration;
        this.totalVol = list.totalVol;
        if(res.data.resUserInfo.isPaid == true && res.data.resUserInfo.purchaseType==2 && res.data.resUserInfo.isShare==false){
          this.isShare = false;
        }
    this.share();
       })

    }

     async share() {
       if (isInWechat) {
         await initWechat();
         let url = `${host.self}/book/poster/`+this.$route.params['id'];
         let goUrl = this.$route.params['id'];
         let title = this.subject;
         setShareInfo(
           title,
           '造就-听书海报',
           'https://baiding-pub.zaojiu.com/zaojiuUNI@3x.png',
           url,
           goUrl
         );
       }
    }
      sucGo(){
        axios.get(`${host.io}/api/wallet/order`).then(res=>{});
        this.$router.push({path: '/book/detail/'+this.$route.params['id']})
      }
      getDetail(){
        this.$router.push({path: '/book/detail/'+this.$route.params['id']})
      }
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
  .poster-con{
    

    background-color:rgba(0,0,0,0.8);
    overflow: hidden;
    position: relative;
    .indexB{
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
       filter: blur(16px);
      img{
        width: 100%;
      }
    }
    .indexL{
      padding-top: 30px;
      z-index: 4;
      .bg_tit{
        width: 75px;
        height: 75px;
        background: url('https://baiding-pub.zaojiu.com/book/book-title.png') no-repeat center;
        position: absolute;
        top: 0;
        left: 0;
            background-size: cover;
      }
      .tit{
        position: absolute;
        top: 18px;
        left: -42px;
        background-color: $color-brand;
        font-size: 14px;
        color: #fff;
        padding: 5px 46px;
        font-weight: 700;
        transform: rotate(-45deg);
      }
      .share{
        text-align: center;
        line-height: 40px;
        color: #fff;
      }
      .pos-img{
        width: 120px;
        //height: 170px;
        margin:0px auto 10px auto;

        img{
          width: 100%;
          height: 100%;
        }
      }
      .pos-time{
        text-align: center;
        font-size: 14px;
        color: rgba(255,255,255,0.54);
      }
      .pos-txt{
        margin: 0 15px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(64,64,64,1);
        h3{
          font-size: 20px;
          width: 260px;
          text-align: center;
          color: #fff;
          padding-top: 20px;
          padding-bottom: 20px ;
          margin: 0 auto;
        }
       .ht_class{
         font-size: 14px;
         line-height: 28px;
         color: rgba(255,255,255,0.54);

       }
      }
      .poster-footer{
        margin:20px 15px 0 15px;
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
         text-align: center;
          color: #fff;
          line-height: 40px;
          background: $color-brand;
          border-radius: 4px;
          h4{
            font-size: 16px;
          }
          
        }
      }
    }

  }

</style>
