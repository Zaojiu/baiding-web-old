<template>
  <div class="error-screen">
    <slot>网络错误，请<a href="" @click.prevent="$emit('retry')">重试</a></slot>
  </div>
</template>

<style lang="scss"></style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';

  @Component
  export default class ErrorComponent extends Vue {}
</script>
