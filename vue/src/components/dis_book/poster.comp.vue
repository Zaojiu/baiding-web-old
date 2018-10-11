<template>
  <div>
    <div class="poster-con">

      <div class="indexB" >
        <img :src="coverUrl" alt="">
      </div>
      <div class="indexL">
        <p class="tit" >造就·拆书</p>
        <p class="share" v-if="isShare==false">分享该海报页，即可畅听拆书音频</p>
        <div class="pos-img" >
          <img :src="coverUrl" alt="">
        </div>
        <div class="pos-time" >
          <span v-text="totalVol"></span>课 / <span>{{formatSeconds(duration)}}</span>
        </div>
        <div class="pos-txt">
          <h3 v-text="subject" ></h3>
         <div v-html="shareContent">
         </div>
        </div>
        <div class="poster-footer" >
          <div class="txt" @click="getDetail()">
            <h4>查看课程详情</h4>
            <p>内容来自造就 APP</p>
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
  import {setShareInfo} from "../../shared/utils/share";
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
        @Watch('$route')
    created() {
      console.log(this.$route.params['id']);
      this.share();
         axios.get(`${host.io}/api/course/resources/`+this.$route.params['id']).then(res=>{
        // axios.get('http://www.zaojiu.fm/assets/book.json').then(res=>{
        const list = res.data.resourceInfo;
        this.coverUrl =  list.coverUrl+'~5-7';
        this.subject = list.subject;
        this.shareContent = list.shareContent;
        this.duration = list.defaultItemInfo.duration;
        this.totalVol = list.totalVol;
        if(res.data.resUserInfo.isPaid == true && res.data.resUserInfo.purchaseType==2 && res.data.resUserInfo.isShare==false){
          this.isShare = false;
        }

       })

    }
     async share() {
       if (isInWechat) {
         await initWechat();
         let url = `${host.self}/book/poster/`+this.$route.params['id'];
         let title = '拆书';
         setShareInfo(
           title,
           '一起探索科技创新与未来的前沿',
           'https://og9s6vxbs.qnssl.com/zaojiu-logo.jpg',
           url
         );
         axios.get(`${host.io}/api/wallet/order`).then(res=>{});
         this.$router.push({path: '/book/detail/'+this.$route.params['id']})
       }
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
  .poster-con{
    //background: rgba(0,0,0,0.8) url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1538384263908&di=ff9e0ac0b0a9a632b0042dfc96c51670&imgtype=0&src=http%3A%2F%2Fpic42.photophoto.cn%2F20170202%2F0008118265891464_b.jpg")no-repeat center;
    //background-size: cover;

    opacity: 0.9;
    background-color:black;
    overflow: hidden;
    position: relative;
    .indexB{
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      opacity: .1;
      width: 100%;
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
        background-color: #00edda;
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
        margin:0px auto 20px auto;

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
         text-align: center;
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

  }

</style>
