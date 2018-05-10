<template>
  <div class="container">
    <div class="aside-img">
      <img :src="$t('m.wiee.mapUrl12')" v-if="id==='12'" alt="未来交通展示区"
           style="width: 100%"/>
      <img :src="$t('m.wiee.mapUrl9')" v-if="id==='9'" alt="未来生活展示区"
           style="height: 100vh"/>
      <img :src="$t('m.wiee.mapUrl10')" v-if="id==='10'" alt="未来居住展示区"
           style="width: 100%"/>
      <img :src="$t('m.wiee.mapUrl7')" v-if="id==='7'" alt="未来城市展示区"
           style="height: 100vh"/>
    </div>
    <div class="tips" v-if="id!=='12'">
      <span>拖动查看更多</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;

    .aside-img {
      font-size: 0;
      position: absolute;
      height: 100vh;
      overflow: auto;
      background-color: rgba(0, 0, 0, 1);
      width: 100%;
      top: 0;
    }

    .tips {
      position: absolute;
      width: 100%;
      bottom: 12px;
      text-align: center;

      span {
        width: 148px;
        height: 30px;
        background-color: rgb(0, 211, 193);
        color: #fff;
        font-size: 14px;
        border-radius: 15px;
        padding:5px 20px;
        box-shadow: 0px 2px 4px 0 rgba(0, 0, 0, .3);
      }
    }

  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';

  @Component({})
  export default class ActivateComponent extends Vue {
    id = '0';

    created() {
      this.id = this.$route.params['id'];
    }
  }
</script>
