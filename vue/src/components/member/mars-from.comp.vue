<template>
  <div class="container">
    <div class="header">
      <img src="https://baiding-pub.zaojiu.com/members/mars-member-aia-card.png" alt="">
    </div>
    <div class="txt">
      <p>【温馨提示】</p>
      <p>联名卡为造就和友邦保险联手打造的特别计划，针对友邦保险渠道的用户，可专享9折优惠购卡的福利。</p>

      <p>在您购卡时，会先按原价（10000元/张）进行扣款，我们将在1个月内完成信息的核对，如核对无误，优惠金额（1000元/张）将按照原付款路径返还。</p>

      <p>为了保证您能尽早享受联名卡权益，在付款同时火星会员卡即视为生效，请您协助填写以下信息。</p>

      <p>有任何问题，欢迎咨询微信号：zaojiu6</p>
    </div>
    <div class="from">
      <form @submit="checkForm"
            method="post"

            novalidate="true">
        <div class="f_item">
          <p>购卡人姓名 <i>*</i></p>
          <span datatype="name" v-show="isName">请填写此项</span>
          <input type="text" id="name" v-model="info.name" v-bind:class="{ error: isName }">
        </div>
        <div class="f_item">
          <p>手机 <i>*</i></p>
          <span datatype="phone" v-show="isPhone">手机格式错误</span>
          <input type="text" id="phone" v-model="info.mobile" v-bind:class="{ error: isPhone }">
        </div>
        <div class="f_item">
          <p>公司 <i>*</i></p>
          <span datatype="company" v-show="isCompany">请填写此项</span>
          <input type="text" id="company" v-model="info.company" v-bind:class="{ error: isCompany }">
        </div>
        <div class="f_item">
          <p>邮箱 <i>*</i></p>
          <span datatype="email" v-show="isEmail">邮箱格式错误</span>
          <input type="text" id="email" v-model="info.email" v-bind:class="{ error: isEmail }">
        </div>
        <!--<div class="f_item">-->
          <!--<p>友邦推荐人 <i>*</i></p>-->
          <!--<span datatype="referee" v-show="isReferee">请填写此项</span>-->
          <!--<input type="text" id="referee" v-model="info.referee" v-bind:class="{ error: isReferee }">-->
        <!--</div>-->
        <div class="f_item">
          <p>购卡人身份 <i>*</i></p>
        </div>
        <div class="code_item">
          <div v-for="(item,index) in list" @click="chooseAddr(index)">
            <input type="radio" name="youbang"   :value="item.value" v-model="checkedValue"><span>{{item.txt}}</span>
          </div>
        </div>
        <div class="code_item" v-if="tInfo">
          <p>推荐人信息</p>
          <div v-for="(item,index) in tList" @click="chooseTinfo(index)">
            <input type="radio" name="tInfo"   :value="item.value" v-model="tChecked"><span>{{item.txt}}</span>
          </div>
        </div>
        <div class="f_item">
          <p>{{tInfoR}} <i>*</i></p>
        <span datatype="code" v-show="isCode">请填写此项</span>
        <input type="text" id="code" v-model="info.code" v-bind:class="{ error: isCode }">
        </div>
        <div class="sub_mid">
          <input type="submit" value="提交(去支付)">
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    -webkit-box-shadow: 0 2px 5px 1px rgba(124,124,124,.2);
    box-shadow: 0 2px 5px 1px rgba(124,124,124,.2);
    z-index: 20;
    padding-bottom: 30px;
    .header{
      width: 100%;
      height: auto;
      font-size: 0;
     img{
       width: 100%;
     }
    }
    .txt{
      padding: 20px;
      font-size: 14px;
      line-height: 28px;
    }
    .from{
      padding: 0 10px;
      .f_item{
        p{
          line-height: 24px;
          font-size: 16px;
          font-weight: normal;
          color: #000000;
          i{
            color: #da2824;
            vertical-align: middle;
          }
        }
        span{
          display: block;
          line-height: 1.4;
          font-size: 12px;
          color: #da2824;
        }
        input{
          width: 100%;
          height: 30px;
          border: 1px solid #ccc;
          outline: none;
          padding: 5px;
        }
        .active{
          border: 1px solid #3B67A0;
        }
        .error{
          border: 1px solid #da2824;
        }

      }
      .code_item{
        line-height: 30px;
        div{
          display: inline-block;
        }
        p,span{
          line-height: 30px;
          font-size: 16px;
          font-weight: 400;
          color: #000;
          margin-right: 5px;
        }
      }
      .sub_mid{
        input{
          width: 100%;
          height: 36px;
          border: none;
          display: inline-block;
          text-align: center;
          line-height: 36px;
          font-weight: 700;
          color: #FFFFFF;
          background: rgba(0,211,193,1);
          margin: 30px 0;
          outline: none;
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import axios from 'axios';
  import {host} from "../../env/environment";
  import {showTips} from "../../store/tip";
  @Component
  export default class vfrom extends Vue {
    info={
      name:'',
      mobile:'',
      company:'',
      email:'',
      // referee:'',
      code:'',
      is_inner_personnel:0,
      personnel_type:0
  };

    isName=false;
    isPhone=false;
    isCompany=false;
    isEmail=false;
    // isReferee=false;
    isCode=false;
    checkedValue=0;
    list=[{value:0,txt:'友邦员工'},{value:1,txt:'友邦营销员'},{value:2,txt:'友邦客户'}];
    tList=[{value:0,txt:'友邦员工'},{value:1,txt:'友邦营销员'}];
    tChecked=0;
    tInfo=false;
    tInfoR='代码';
    created() {
      axios.defaults.withCredentials = true; //让ajax携带cookie
    }
    //人员类型
    chooseAddr(index:any) {
      this.checkedValue = index;
      console.log(this.checkedValue);
      if(this.checkedValue==2){
        this.tInfo=true;
        this.info.is_inner_personnel=1;
        this.tInfoR='推荐人及代码';
      }else{
        this.tInfo=false;
        this.info.is_inner_personnel=0;
        this.info.personnel_type=index;
        this.tInfoR='代码';
      }
    }
    //推荐人员类型
    chooseTinfo(index:any){
      this.tChecked = index;
      console.log(this.tChecked);
      this.info.personnel_type=index;
    }
    // 表单提交
    checkForm(e:any){


      if(!this.info.name){
        this.isName=true;
      }else{
        this.isName=false;
      }
      if(!this.validPhone(this.info.mobile)){
        this.isPhone=true;
      }else{
        this.isPhone=false;
      }
      if(!this.info.company){
        this.isCompany=true;
      }else{
        this.isCompany=false;
      }
      if(!this.validEmail(this.info.email)){
        this.isEmail=true;
      }else{
        this.isEmail=false;
      }
      // if(!this.info.referee){
      //   this.isReferee=true;
      // }else{
      //   this.isReferee=false;
      // }
      if(!this.info.code){
        this.isCode=true;
      }else{
        this.isCode=false;
      }
      //提交信息
      if(this.info.name&&this.info.mobile&&this.info.company&&this.validEmail(this.info.email)&&this.info.code){

        var obj:any={
          "name":this.info.name,
          "email":this.info.email,
          "company":this.info.company,
          "mobile":this.info.mobile,
          "referrer":"推荐人",
          "is_inner_personnel":this.info.is_inner_personnel,
          "personnel_type":this.info.personnel_type,
          "code":this.info.code
        };
        // var obj:any=JSON.stringify(this.info);
         console.log(obj);
        let _this = this;
        sessionStorage.setItem('aiasUser','yes');
        _this.$router.push({path: '/wv/aia-intro-mars'});

        axios.post(`${host.io}/api/wallet/addAiasUser`,obj).then(function(response:any) {
          if(response==true){

          }

        })
          .catch(function(error) {
            console.log(obj);


          });
      }

      e.preventDefault();

    }

    //邮箱格式
    validEmail(email:any) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    //手机格式
    validPhone(phone:any){
      var re = /^[1][3,4,5,7,8][0-9]{9}$/;
      return re.test(phone);
    }




  }
</script>
