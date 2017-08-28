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
  import Component from 'vue-class-component';

  @Component
  export default class EditAddressComponent extends Vue {

    created() {
      this.initData();
    }

    async initData() {

    }
  }
</script>
