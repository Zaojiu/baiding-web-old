<template>
  <div class="member-activate">
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>

  .member-activate {
    background-color: rgb(26, 26, 26);
    padding:0 20px;
    overflow: hidden;
    height: 100vh;
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';

  @Component({})
  export default class MarsComponent extends Vue {

  }
</script>
