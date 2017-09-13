<template>

</template>

<style lang="scss" scoped>
  .main {
    header {
      position: relative;

      &.sticky {
        position: sticky;
        top: 0;
        z-index: $z-index-page-lv1;
      }

      &.played:before {
        height: 56.25vw;
      }

      &.played-landscape:before {
        height: 100vh;
      }

      &:before {
        content: "";
        display: block;
        height: 100vw;
        transition: height .5s;
      }

      @media (max-width: 1024px) and (orientation: landscape) {
        .video-container {
          .video {
            &:before {
              height: 100vh;
            }
          }
        }
      }

      .player {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }

      .live-cover {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column-reverse;
        pointer-events: none;

        .cover-thumbnail-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: $color-w;
          overflow: hidden;

          .cover-thumnail {
            position: absolute;
            top: -10px;
            left: -10px;
            width: calc(100% + 20px);
            height: calc(100% + 20px);
            background-position: center;
            background-size: cover;
            filter: blur(10px);
          }
        }

        .cover-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          text-indent: -10000px;
        }

        .big-play {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          background: url("/assets/icon/big-play.svg") center top no-repeat;
          pointer-events: none;
          min-width: 66px;
          padding-top: 74px;
          font-size: 14px;
          text-align: center;
          white-space: nowrap;
          color: $color-w;
          text-shadow: 0 0 2px $color-b;
        }
      }
    }

    .tab-nav {
      position: sticky;
      top: 0;
      z-index: $z-index-page-lv1;
      box-shadow: 0 2px 2px rgba(211, 211, 211, .5);
      display: flex;
      height: 44px;
      list-style: none;
      background-color: $color-w;

      &.stick-under-video {
        top: calc(56.25vw - 1px);
      }

      li {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $color-gray3;
        font-size: $font-size-md;

        &.active {
          color: $color-dark-gray;
          font-weight: bold;
        }
      }
    }

    .tab-content-container {
      overflow: hidden;

      .tab-content-inner {
        white-space: nowrap;
        transition: transform .3s;

        &.tab-one-active {
          transform: translateX(0);

          .tab-content:nth-child(1) {
            max-height: 1000000px;
          }
        }

        &.tab-two-active {
          transform: translateX(-100%);

          .tab-content:nth-child(2) {
            max-height: 1000000px;
          }
        }

        .tab-content {
          width: 100%;
          display: inline-block;
          vertical-align: top;
          max-height: 0;
          transition: max-height .3s 0s;
          white-space: normal;
        }
      }
    }

    .title {
      padding: 20px 15px 0px 15px;

      .categories {
        margin-bottom: 15px;
        font-size: 14px;
        color: rgb(80, 227, 194);
        font-weight: 400;
      }

      h1 {
        font-size: 24px;
        line-height: 1.25em;
        color: $color-b;
        padding-bottom: 15px;
        font-weight: 500;
        word-break: break-all;
      }

      .talk-info {
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-bottom: 24px;

        .author-info {
          flex-grow: 1;
          overflow: hidden;
          display: flex;
          align-items: center;

          .avatar {
            flex-shrink: 0;
            margin-right: 5px;
          }

          .nick {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 16px;
            color: $color-dark-gray;
            line-height: 1em;
          }
        }

        time {
          font-size: 14px;
          color: rgb(144, 144, 144);
          line-height: 1em;
        }
      }
    }

    .article {
      text-align: justify;
      font-size: $font-size-md;
      line-height: 1.75;
      color: $color-dark-gray;
    }

    .info {
      margin-top: 14px;
      padding: 12px;

      ul {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        li {
          display: flex;
          align-items: center;
          font-size: 17px;
          line-height: 1em;
          color: $color-dark-gray;

          &:last-child {
            &:after {
              display: none;
            }
          }

          &:after {
            margin-left: 6px;
            margin-right: 6px;
            content: ">";
            font-size: 20px;
          }
        }
      }

      .tags {
        display: flex;
        flex-wrap: wrap;

        small {
          flex-shrink: 0;
          min-width: 48px;
          padding: 9px 18px;
          margin-right: 10px;
          margin-top: 10px;
          border-radius: 4px;
          font-size: 12px;
          background-color: rgb(239, 239, 239);
          color: $color-dark-gray;
          line-height: 1em;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .comments {
      margin-top: 50px;
      padding: 0 15px;

      h2 {
        font-size: 18px;
        line-height: 1em;
        color: $color-dark-gray;
        font-weight: normal;
      }

      .comment {
        margin-top: 20px;

        .header {
          display: flex;
          align-items: center;
          overflow: hidden;
          margin-bottom: 6px;

          .author-info {
            flex-grow: 1;
            display: flex;
            align-items: center;
            overflow: hidden;

            .avatar {
              flex-shrink: 0;
              margin-right: 6px;
            }

            .nick {
              font-size: 14px;
              color: $color-dark-gray;
              line-height: 1em;
              font-weight: bold;
            }

            time {
              margin-left: 8px;
              flex-shrink: 0;
              font-size: 12px;
              color: rgb(144, 144, 144);
              line-height: 1em;
            }
          }

          .reply {
            line-height: 1em;
            padding: 5px;
            font-size: 12px;
            color: $color-gray;

            .bi-reply-comment {
              margin-right: 5px;
            }
          }
        }

        .content {
          margin-left: 31px;
          font-size: 14px;
          color: $color-dark-gray;
          line-height: 1.57em;
          white-space: pre-wrap;

          .quote {
            background-color: rgb(237, 237, 237);
            padding: 10px;
            margin-bottom: 6px;
            white-space: pre-wrap;

            .nick {
              font-weight: bold;
              margin-right: 6px;
            }
          }
        }
      }

      .no-comments, .more-comments, .comment-loading, .no-more-comments {
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;

        .bi-no-comment {
          font-size: 16px;
          margin-right: 8px;
        }
      }

      .no-comments, .no-more-comments {
        color: $color-gray;
      }

      .no-comments {
        font-size: 16px;
      }

      .more-comments {
        color: $color-dark-gray;
        font-size: 14px;
      }
    }

    .emphasis {
      padding: 15px 20px;
      border-top: solid .5px transparent;
      border-bottom: solid .5px transparent;

      &.active {
        background-color: #f0f0f0;
        border-top: solid .5px rgba(188, 188, 188, .5);
        border-bottom: solid .5px rgba(188, 188, 188, .5);
      }

      .start {
        font-size: $font-size-sm;
        color: $color-gray3;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .text {
        font-size: $font-size-md;
        color: $color-gray3;
        word-break: break-all;
        white-space: pre-wrap;
        line-height: 1.75em;
      }

      .cover {
        display: block;
        margin: 15px auto 0;
        max-width: 100%;
        height: auto;
      }
    }

    .footer-show {
      bottom: 0;
      transition: bottom 0.3s ease;
    }

    .footer-hide {
      bottom: -46px;
      transition: bottom 0.3s ease;
    }

    footer {
      display: flex;
      height: 46px;
      background-color: rgb(10, 10, 23);
      max-width: 1024px;
      width: 100%;

      .icon {
        line-height: 1em;
        font-size: $font-size-sm;
        color: $color-w;
        display: flex;
        align-items: center;
        padding-left: 15px;

        &:first-child {
          padding-left: 24px;
        }

        &:last-child {
          padding-right: 24px;
        }

        .bi {
          margin-right: 5px;

          &.active {
            color: $color-brand;
          }
        }

        .bi-praise {
          font-size: $font-size-lg;
        }

        .bi-favorite {
          font-size: $font-size-lg;
        }

        .bi-comment2 {
          font-size: $font-size-md;
        }
      }

      .view {
        flex-grow: 1;

        .bi {
          font-size: 16px;
        }
      }
    }
  }

  .loading, .no-content {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-content {
    font-size: 16px;
    color: $color-gray;
    line-height: 1em;
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';

  @Component
  export default class ContentComponent extends Vue {

  }
</script>
