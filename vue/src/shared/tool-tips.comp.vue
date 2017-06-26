<template>
  <div class="operation-tips" v-bind:class="{'is-opened':isOpened}">{{message}}</div>
</template>

<style lang="scss">
  @import "../css/_variables";

  .operation-tips {
    position: absolute;
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
    opacity: 0;
    transition: all 1s;

    &.is-opened {
      opacity: 1;
      transition: opacity 1s;
    }
  }

</style>

<script>
  export default{
    computed: {
      isOpened(){
        if (this.$store.state.tip.errorMessage) return this.$store.state.tip.status
      },
      message(){
        return this.$store.state.tip.errorMessage || ''
      }
    }
  }

</script>
