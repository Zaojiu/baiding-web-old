<template>
  <div class="container">

    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {

  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class AddressComponent extends Vue {

    created() {
      this.initData();
    }

    async initData() {

    }
  }
</script>
