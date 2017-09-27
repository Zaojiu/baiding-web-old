<template>
  <div class="sk-three-bounce">
    <div class="sk-child sk-bounce1"></div>
    <div class="sk-child sk-bounce2"></div>
    <div class="sk-child sk-bounce3"></div>
  </div>
</template>

<style lang="scss" scoped>
  $spinkit-spinner-margin: 0 auto !default;
  $spinkit-size: 17px !default;
  $spinkit-spinner-color: $color-brand !default;

  .sk-three-bounce {
    $animationDuration: 1.4s;
    $delayRange: 0.32s;
    display: inline-flex;
    margin: $spinkit-spinner-margin;

    .sk-child {
      width: $spinkit-size / 2;
      height: $spinkit-size / 2;
      background-color: $spinkit-spinner-color;
      margin-left: 2px;
      border-radius: 100%;
      animation: sk-three-bounce $animationDuration ease-in-out 0s infinite both;

      &:first-child {
        margin-left: 0;
      }
    }

    .sk-bounce1 {
      animation-delay: -$delayRange;
    }
    .sk-bounce2 {
      animation-delay: -$delayRange / 2;
    }
  }

  @keyframes sk-three-bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1.0);
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';

  @Component
  export default class BdLoadingComponent extends Vue {}
</script>
