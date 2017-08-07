<template>
  <div class="columns">
    <div class="cover">
      <img src="/assets/img/default-cover.jpg" alt="">
    </div>

    <header class="block">
      <h1 class="title">设计师孙晓曦:书籍设计是一种建造</h1>
      <p class="period">音频专栏|共100期</p>
      <div class="info">
        <img class="avatar avatar-round avatar-lg" src="/assets/img/default-cover.jpg" alt="头像">
        <div class="intro">
          <strong class="nick">张三疯</strong>
          <p class="content">薛定谔指出了应用量子力学的哥本哈根诠释于宏观物体会产生的问题，以及这问题与物理常识之间的矛盾。在这思想实验里，由于先前发生事件的随机性质，猫会处于生存与死亡的叠加态。</p>
        </div>
      </div>
    </header>

    <section class="columns-intro block">
      <div class="head">
        <h2>专栏简介</h2>
        <a href="" @click.prevent="isIntroCollape=!isIntroCollape">{{isIntroCollape ? '展开' : '折叠'}}</a>
      </div>
      <p class="intro" v-bind:class="{'collaped': isIntroCollape}">
        薛定谔猫（英语：Schrödinger’s Cat）是奥地利物理学者埃尔温·薛定谔于1935年提出的一个思想实验。通过这思想实验，薛定谔指出了应用量子力学的哥本哈根诠释于宏观物体会产生的问题，以及这问题与物理常识之间的矛盾。在这思想实验。
      </p>
    </section>

    <section class="columns-list block">
      <div class="head">
        <h2>专栏列表</h2>
        <span>10/100</span>
      </div>
      <ul class="list">
        <li>
          <div class="item-detail">
            <h3 class="item-title">001 | 舞台去哪了？</h3>
            <p class="item-intro">薛定谔猫是奥地利物理学者埃尔温薛定是奥地利物理学者埃尔温·薛定谔于1935年提出的一个思想实验。</p>
            <time>5月21日</time>
          </div>
          <div class="operation-area">
            <i class="bi bi-paper3"></i>
            <span class="duration">06‘43“</span>
            <span class="tips">试读</span>
          </div>
        </li>
        <li>
          <div class="item-detail">
            <h3 class="item-title">002 | 舞台去哪了？</h3>
            <p class="item-intro">薛定谔猫是奥地利物理学者埃尔温薛定是奥地利物理学者埃尔温·薛定谔于1935年提出的一个思想实验。</p>
            <time>5月21日</time>
          </div>
          <div class="operation-area">
            <i class="bi bi-wave2"></i>
            <span class="duration">06‘43“</span>
            <span class="tips">试读</span>
          </div>
        </li>
        <li>
          <div class="item-detail">
            <h3 class="item-title">003 | 舞台去哪了？</h3>
            <p class="item-intro">薛定谔猫是奥地利物理学者埃尔温薛定是奥地利物理学者埃尔温·薛定谔于1935年提出的一个思想实验。</p>
            <time>5月21日</time>
          </div>
          <div class="operation-area">
            <i class="bi bi-video2"></i>
            <span class="duration">06‘43“</span>
            <span class="tips">试读</span>
          </div>
        </li>
        <li>
          <div class="item-detail">
            <h3 class="item-title">004 | 舞台去哪了？</h3>
            <p class="item-intro">薛定谔猫是奥地利物理学者埃尔温薛定是奥地利物理学者埃尔温·薛定谔于1935年提出的一个思想实验。</p>
            <time>5月21日</time>
          </div>
          <div class="operation-area">
            <i class="bi bi-paper4"></i>
            <span class="duration">06‘43“</span>
            <span class="tips">试读</span>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .columns {
    background-color: rgb(251, 251, 251);

    .cover {
      position: relative;

      &:before {
        content: "";
        display: block;
        padding-top: 56.2%;
      }

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .block {
      padding: 20px 15px;
      box-shadow: 0 2px 2px rgb(236, 236, 236);
      margin-bottom: 10px;
      background-color: $color-w;

      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;

        h2 {
          font-size: $font-size-lg;
          color: $color-dark-gray;
          font-weight: normal;
        }

        a, span {
          flex-shrink: 0;
          font-size: $font-size-sm;
          color: $color-dark-gray;
        }

        a {
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    header {
      .title {
        font-size: $font-size-xxlg;
        color: $color-dark-gray;
        line-height: 1.25em;
        margin-bottom: 15px;
      }

      .period {
        font-size: $font-size-sm;
        color: $color-gray3;
        margin-bottom: 20px;
      }

      .info {
        display: flex;

        .avatar {
          flex-shrink: 0;
          margin-right: 10px;
        }

        .intro {
          .nick {
            display: block;
            font-size: $font-size-sm;
            color: $color-dark-gray;
            margin-bottom: 5px;
          }

          .content {
            font-size: $font-size-sm;
            color: $color-gray3;
            line-height: 1.57em;
            word-break: break-all;
            white-space: pre-wrap;
            text-align: justify;
          }
        }
      }
    }

    .columns-intro {
      .intro {
        font-size: $font-size-md;
        color: $color-gray3;
        line-height: 1.75em;

        &.collaped {
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
    }

    .columns-list {
      .head {
        margin-bottom: 20px;
      }

      .list {
        li {
          padding-bottom: 20px;
          border-bottom: solid 1px rgb(236, 236, 236);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          color: $color-gray3;

          .item-detail {
            overflow: hidden;

            .item-title {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: $font-size-md;
              margin-bottom: 5px;
            }

            .item-intro {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: $font-size-sm;
              margin-bottom: 5px;
            }

            time {
              font-size: $font-size-xsm;
              line-height: 1em;
            }
          }

          .operation-area {
            display: flex;
            flex-direction: column;
            align-items: center;

            .bi {
              margin-bottom: 7px;
              font-size: 22px;
            }

            .duration, .tips {
              font-size: $font-size-xsm;
              line-height: 1em;
            }

            .duration {
              margin-bottom: 12px;
            }
          }
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue, {ComponentOptions} from "vue";

  interface ColumnsComponent extends Vue {
    isIntroCollape: boolean;
  }

  export default {
    data () {
      return {
        isIntroCollape: true,
      }
    }
  } as ComponentOptions<ColumnsComponent>;
</script>
