<template>
  <router-view></router-view>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {isInWechat} from "../shared/utils/utils";
  import {host} from "../env/environment";
  import {initWechat} from "../shared/utils/wechat";
  import {setShareInfo} from '../shared/utils/share';

  @Component({})
  export default class BaseComponent extends Vue {

    created() {
       this.share();
    }

    async share() {
      if (isInWechat) {
        await initWechat();
      }
    }
  }
</script>
