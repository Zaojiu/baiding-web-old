<template>
  <div class="container">
    <!--<bd-loading class="abs-center" v-if="isLoading"></bd-loading>-->
    <div class="content-header">

      <div class="img">
        <img :src="eventList.image" alt="111111" />
      </div>
      <div class="info">
        <p class="money"><i>￥</i>{{(soMoney)/100}}</p>
        <p class="title">{{eventList.title}}</p>
        <span class="type">{{soType}}</span>
      </div>
    </div>

    <div class="itemList">
      <div class="item" :typeMon="item.presentPrice" :num="item.ticketTotal"  @click="getMoney(item.presentPrice,item.ticketName,item.ticketTotal,soNum,index,item.ticketId)" :class="{'itemNull':item.ticketTotal==0,itemActive:index == activeNum}" v-for="(item,index) in dataList">
        {{item.ticketName}}
      </div>


    </div>
    <div class="ticketNum">
      <span class="num">购买数量</span>
      <div class="compute">
        <span class="reduce" @click="reduceTicket"></span>
        <span class="number" >{{soNum}}</span>
        <span class="add" @click="addTicket"></span>
      </div>

    </div>

    <div class="footer" v-if="status==0" @click="goProPrice">
      购买门票
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getEventList} from "../../../shared/api/event.api";
  import {EventModel} from "../../../shared/api/event.model";
  import {isInWechat} from "../../../shared/utils/utils";
  import {initWechat} from "../../../shared/utils/wechat";
  import {setShareInfo} from "../../../shared/utils/share";
  import {host} from "../../../env/environment";
  import axios from 'axios';
  import jquery from 'jquery';
  import {crReady} from "../../../shared/api/order.api";
  import {getUserInfoCache} from "../../../shared/api/user.api";
  import {UserInfoModel} from '../../../shared/api/user.model';

  @Component
  export default class EventListComponent extends Vue {
    userInfo: UserInfoModel | null = null;
    // isLoading = true;
   dataList:any=[];
    soMoney='';
   money='';//单价
   soType='选择票的种类';
   soNum=1;//购买票数
    newNum=0;//剩余票数
    ticketNull=false;//票数为空时
    activeNum=0;//默认没有选中的票
    eventList:any=[];//
    id='';
    typeId=0;//选择票种id
    status=0;
    title='';
    postData:any={'items':[{'subject':'123213','type':121,'objectId':'681','fee':0,'price':0,'nums':0,'discountedFee':0}]};
    price=0;//询后价格
    created() {
      this.id=this.$route.params['id'];
      // /api/zj/event/eventList/681
      this.userInfo = getUserInfoCache();
      this.initData();

    }
    //
    initData(){
      //获取活动票信息
      axios.get(`${host.io}/api/zj/event/eventList/${this.$route.params['id']}`).then(res => {
        this.dataList=res.data.results.ticketLists;
        this.eventList=res.data.results;
        this.status=this.eventList.status;

         // this.soMoney=this.eventList.ticketLists[0].presentPrice;
         this.soType=this.eventList.ticketLists[0].ticketName;
         this.newNum=this.eventList.ticketLists[0].ticketTotal;
         this.money=this.eventList.ticketLists[0].presentPrice;
         this.typeId=this.eventList.ticketLists[0].ticketId;
        this.postData.items[0].subject=res.data.results.title;
        this.ready();
      })
    }
    mounted(){
    }
    //询价
    async ready(){

      // this.postData.items[0].subject=this.title;//title
      // console.log(this.title);
      this.postData.items[0].type = 122;//活动标识id
      this.postData.items[0].objectId = this.typeId;//票种id
      this.postData.items[0].nums = this.soNum;
      //票询价
      this.soMoney = await crReady(this.postData);//询价
    }
  //  单价，名称，现有数量，购买数量，下标，id
  getMoney(money:any,name:any,num:any,soNumber:any,index:any,id:any){
      console.log(money,name,num,soNumber,index,id);
      if(num!=0){
        this.typeId = id;
        this.ticketNull=false;
        this.activeNum = index;
        this.money = money;//单价
        if(soNumber<=num){
          // this.soMoney=parseInt(money) * this.soNum;
          this.soType=name;
          this.newNum = num;
          this.money = money;
          // console.log(this.newNum)
        }else{
          this.soType=name;
          this.soNum = num;
          this.newNum = num;
          // this.soMoney=parseInt(money) * this.soNum;
        }

      }else{
        this.ticketNull=true;
       console.log('售空！');
      }
    this.ready();
  }
  // 添加票数
    addTicket(){
     if(!this.ticketNull){
       console.log(this.soNum,this.newNum);
       if(this.soNum<this.newNum){
         this.soNum++;
         this.getMoney(this.money,this.soType,this.newNum,this.soNum,this.activeNum,this.typeId)
       }
     }

    }
  //减少票数
    reduceTicket(){
      if(!this.ticketNull){
        if(this.soNum!=1&&this.soNum>0){
          this.soNum--;
          this.getMoney(this.money,this.soType,this.newNum,this.soNum,this.activeNum,this.typeId)
        }
      }
    }
    //查看商品信息
    goProPrice(){
      console.log(this.eventList.image,this.eventList.title,this.soType,this.soMoney,this.soNum);
      let order:any={
        type:121,//商品类型id
        goodsId:this.typeId,//票id
        image:this.eventList.image,
        title:this.eventList.title,
        typeName:this.soType,
        totalPrice:this.soMoney,
        unitPrice:this.money,
        num:this.soNum,
        oldPrice:this.money
      };
      sessionStorage.setItem('order',JSON.stringify(order));
      //获取用户信息
      this.$router.push({path: `/app/order/pay/${this.$route.params['id']}`})
    }
    @Watch('soNum', {deep: true})
    watchCount(newVal:any, oldVal:any) {
      console.log("newVal", newVal, "oldVal", oldVal)
    }

  }
</script>

<style lang="scss" scoped>
  .container {

    padding: 20px 20px 60px 20px;
    .content-header{
      display: flex;
      margin-bottom: 32px;
      .img{
        width: 80px;
        height: 80px;
        margin-right: 12px;
        img{
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .info{
        flex: 1;
        font-size: 0;
        .money{
          font-size: 20px;
          line-height: 16px;
          color: $color-brand;
          font-weight: 600;
          i{
            font-style: normal;
            font-weight: normal;
            font-size: 12px;
          }
        }
        .title{
          font-size: 16px;
          line-height: 20px;
          color: rgb(85,85,85);
          font-weight: 700;
          margin: 4px 0 6px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .type{
          font-size: 12px;
          line-height: 12px;
          color: rgb(179,179,179);
          font-weight: 700;
        }

      }
    }
    .itemList{
      .item{
        font-size: 13px;
        color: rgb(85,85,85);
        font-weight: 700;
        padding: 6px 14px;
        border-radius: 40px;
        background-color: rgb(247,247,247);
        margin-right: 16px;
        margin-bottom: 18px;
        display: inline-block;
      }
      .itemNull{
        color: rgb(166,166,166);
      }
      .itemActive{
        background-color: $color-brand;
        color: #fff;
      }
    }
    .ticketNum{
      overflow: hidden;
      margin-top: 26px;
      .num{
        font-size: 14px;
        color: rgb(166,166,166);
        font-weight: 700;
        float: left;
      }
      .compute{
        float: right;
        span{
          display: inline-block;
          float: left;
        }
        .reduce{

          width: 20px;
          height: 20px;
          background: url("assets/reduceNum.png") no-repeat;
          background-size: cover;

        }
        .number{
          font-size: 14px;
          font-weight: 600;
          padding: 0 12px;
        }
        .add{
          width: 20px;
          height: 20px;
          background: url("assets/addNum.png") no-repeat;
          background-size: cover;
        }
      }
    }
    .footer{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
      background-color: $color-brand;
      font-size: 18px;
      font-weight: 700;
      line-height: 50px;
      text-align: center;
      color: #fff;
    }


  }
</style>
