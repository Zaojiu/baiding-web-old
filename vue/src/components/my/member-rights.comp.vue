<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <div class="error-screen abs-center" v-else-if="!right">
      网络错误，请<a href="" @click.prevent="initData()">重试</a>
    </div>
    <div class="main" v-else>
      <h1>{{right.title}}</h1>
      <h2>权益说明</h2>
      <div v-html="right.desc" v-once></div>
      <div class="codes">
        <div class="header">
          <span>可用权益：{{right.availableAmount}}</span>
          <span>共{{right.totalAmount}}个权益</span>
        </div>
        <div class="content" v-for="code in unusedCodes">
          过期时间：{{code.expiredAt.format('YYYY-MM-DD')}}
        </div>
        <div class="content" v-if="!unusedCodes.length">暂无可用权益</div>
      </div>

      <div class="codes">
        <div class="header">
          <span>已使用权益：{{right.totalAmount - right.availableAmount}}</span>
          <span>共{{right.sharedAmount}}个权益</span>
        </div>
        <div class="content" v-for="code in usedCodes">
          过期时间：{{code.usedAt.format('YYYY-MM-DD')}}
        </div>
        <div class="content" v-if="!usedCodes.length">暂无已用权益</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: auto;
    background-color: $color-w;
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {getUserInfoCache} from "../../shared/api/user.api";
  import {getMemberRight, listMemberRightsCode} from '../../shared/api/member.api';
  import {MemberRight, MemberRightsCode} from "../../shared/api/member.model";
  import bdLoading from '../../shared/bd-loading.comp.vue';

  @Component({
    components: {
      bdLoading,
    },
  })
  export default class MemberRightsComponent extends Vue {
    id = '';
    userInfo = getUserInfoCache();
    isLoading = false;
    unusedCodes: MemberRightsCode[] = [];
    usedCodes: MemberRightsCode[] = [];
    right: MemberRight|null = null;

    created() {
      this.id = this.$route.params['id'];

      this.initData();
    }

    async initData() {
      this.isLoading = true;
      this.right = await getMemberRight(this.id);
      const codes = await listMemberRightsCode(this.id);
      this.unusedCodes = codes.filter((code) => !code.isStatusUsed);
      this.usedCodes = codes.filter((code) => code.isStatusUsed);
      this.isLoading = false;
    }
  }
</script>
