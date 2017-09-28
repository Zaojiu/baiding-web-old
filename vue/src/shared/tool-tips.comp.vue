<template>
  <div class="operation-tips" :class="{'is-opened':isOpened}">{{message}}</div>
</template>

<style lang="scss" scoped>
  .operation-tips {
    position: fixed;
    left: 50%;
    bottom: 80px;
    border-radius: 3px;
    padding: 10px;
    color: $color-w;
    background: rgba(76, 76, 76, 0.90);
    max-width: 90vw;
    font-size: 14px;
    pointer-events: none;
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity .5s;
    line-height: 1.5em;
    text-align: center;

    &.is-opened {
      opacity: 1;
    }
  }

</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {tipStore} from '../store/tip';

  @Component
  export default class ToolTipsComponent extends Vue {
    get isOpened(): boolean {
      return tipStore.state.errorMessage !== '' && tipStore.state.status;
    }

    get message(): string {
      return tipStore.state.errorMessage || '';
    }
  }
</script>
