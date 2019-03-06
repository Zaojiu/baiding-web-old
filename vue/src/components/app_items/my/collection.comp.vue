<template>
  <div class="container">
    <div class="item" v-for="(item,index) in collectionList">
      <img :src="item.coverUrl" alt="头图">
      <div class="text">
        <h2 class="subject">{{item.subject}}</h2>
        <div class="desc">{{item.desc}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import jquery from 'jquery';
  import axios from 'axios';
  @Component
  export default class EventListComponent extends Vue {
    collectionList=[];
    created() {
      this.initData()
    }
    initData() {
      axios.get('http://www.zaojiu.fm/assets/favorites.json?t=').then(res=>{
        this.collectionList = res.data.result;
      });
    }
    mounted() {


    }




  }
</script>

<style lang="scss" scoped>
  .container {
    .item{
      margin: 15px;
      padding-bottom: 15px;
      border-bottom: solid 1px rgba(225,225,225,0.5);
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      img{
        -ms-flex-negative: 0;
        flex-shrink: 0;
        height: 110px;
        width: 110px;
        margin-right: 10px;
        border-radius: 8px;
        -o-object-fit: cover;
        object-fit: cover;
         text-indent: -10000px;
      }
      .text{
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        overflow: hidden;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        .subject{
          font-size: 18px;
          font-weight: bold;
          line-height: 1.333em;
          color: #4b4b4b;
          -webkit-line-clamp: 2;
          margin-bottom: 5px;
        }
        .desc{
          font-size: 14px;
          line-height: 1.285em;
          color: #909090;
          -webkit-line-clamp: 3;
        }
      }
    }


  }
</style>
