<template>
  <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
  <error class="abs-center" v-else-if="isNotFound">网络错误</error>
  <div class="container" v-else>
    <section class="guest">
      <div class="avatar">
        <img :src="`${data.object.coverUrl}~1-1`"/>
      </div>
      <div class="desc">
        <h3>{{data.object.subject}}</h3>
        <p>{{data.object.meta?data.object.meta.title:''}}</p>
      </div>
      <div class="action">
        <button @click="goToGroup">联系嘉宾</button>
      </div>
    </section>
    <h1>嘉宾简介</h1>
    <p class="chinese">
      {{data.object.desc}}
    </p>
    <p class="english">

    </p>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100%;
    background-color: #000;
    overflow-y: auto;
    padding: 25px 20px 0 20px;

    .guest {
      display: flex;
      align-items: center;
      margin-bottom: 28px;

      .avatar {
        height: 56px;
        width: 56px;
        border-radius: 28px;
        background-color: #fff;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .desc {
        margin-left: 8px;
        width: calc(100% - 120px);
        padding: 0 16px 0 8px;

        h3 {
          color: rgb(244, 244, 244);
          font-size: 16px;
          line-height: 16px;
        }
        p {
          font-size: 12px;
          line-height: 20px;
          color: rgb(204, 204, 204)
        }
      }

      .action {
        button {
          width: 64px;
          height: 26px;
          text-align: center;
          color: rgb(0, 211, 193);
          border: 1px solid rgb(0, 211, 193);
          border-radius: 4px;
          font-size: 12px;
        }
      }
    }

    h1 {
      margin-top: 48px;
      color: rgb(242, 242, 242);
      font-size: 18px;
      line-height: 18px;
      text-align: left;
      margin-bottom: 12px;
    }
    .chinese {
      font-size: 14px;
      line-height: 23px;
      color: rgb(204, 204, 204);
    }
    .english {
      margin-top: 30px;
      font-size: 14px;
      line-height: 23px;
      color: rgb(204, 204, 204);
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getSpeakerInfo} from '../api'

  @Component({})
  export default class ActivateComponent extends Vue {
    list = [
      {
        name: 'Constantinos Terzidis',
        url: '',
        desc: '同济大学设计创意学院教授,同济大学设计创意学院教授'
      }
    ];
    id: string;
    data: any;
    isLoading = true;
    isNotFound = false;

    created() {
      //this.id = this.$route.params['id'];
      this.id = '58b8d8724b5b3479f27ea091';
      this.init();
    }

    async init() {
      this.isLoading = true;
      try {
        this.data = await getSpeakerInfo(this.id);
      } catch (e) {
        this.isNotFound = true;
      } finally {
        this.isLoading = false;
      }
    }

    goToGroup() {
      this.$router.push({path: '/group/5aec2ad12cfc070001746a4d/cover'});
    }

  }
</script>
