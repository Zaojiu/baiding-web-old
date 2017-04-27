<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @import "../css/_variables";

  /* Reset */
  html, body, div {
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

  input, textarea {
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: none;
    margin: 0;
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
</style>
