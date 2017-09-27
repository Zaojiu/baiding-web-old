<template>
  <i class="bi bi-loading"></i>
</template>

<style lang="scss" scoped>
  .bi-loading {
    overflow: hidden;

    &:before {
      font-size: 28px;
      color: $color-w;
      animation: loading-rotate 1.2s linear infinite;
    }
  }

  @keyframes loading-rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';

  @Component
  export default class CircleLoadingComponent extends Vue {
  }
</script>
