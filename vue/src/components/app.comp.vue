<template>
  <div>
    <router-view></router-view>
    <payment></payment>
    <modal></modal>
    <tool-tips></tool-tips>
  </div>
</template>

<style lang="scss">
  @import "../css/_utils";

  /* Reset */
  html,
  body,
  div {
    border: 0;
  }

  /* Box-sizing border-box */
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  /* Set up a default font and some padding to provide breathing room */
  body {
    font-family: "Alright Sans LP", "Avenir Next", "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Source Han Sans SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi MicroHei", sans-serif;
    font-size: 16px;
    color: $color-dark-gray;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-overflow-scrolling: touch;
  }

  button {
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    background-color: transparent;
  }

  a {
    text-decoration: none;
    color: rgb(33, 150, 243);
    outline: none;
    line-height: 1em;
  }

  ul, ol, li {
    list-style: none;
    padding-left: 0;
  }

  .bi {
    /* 避免before之后有一个空行 */
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    justify-content: center;

    &:before {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-style: normal;
      font-variant: normal;
      font-weight: normal;
      /* speak: none; only necessary if not using the private unicode range (firstGlyph option) */
      text-decoration: none;
      text-transform: none;
    }
  }

  @media screen and (min-width: 1024px) {
    body {
      width: 1024px;
      min-height: 100%;
      margin: 0 auto;
      position: relative;
      background-color: rgb(255, 255, 255);
    }

    html {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: $color-dark-gray;
    }
  }

  @import "../css/_hack";
  @import "../css/_button";
  @import "../css/_form";
  @import "../css/_avatar";
  @import "../css/_article";
  @import "../css/_clickable-block";
</style>

<script lang="ts">
  import toolTips from '../shared/tool-tips.comp.vue';
  import payment from '../shared/payment.comp.vue';
  import modal from '../shared/modal.comp.vue';

  export default {
    components: {
      toolTips,
      payment,
      modal,
    }
  }
</script>
