<template>
  <div class="container">
    <header class="header">
      <div class="img" @click="goToNextPage('index')"><img
        src="https://og9s6vxbs.qnssl.com/wiee/zao/back-home.png"/></div>
      <!--<span @click="showMenu = true" class="font-set"><i class="bi bi-menu"></i></span>
      <div class="menu" v-if="showMenu">
        <div class="menu-list">
          <div class="close" @click="showMenu = false">
            <i class="bi bi-close"></i>
          </div>
          <ul class="menu-ul">
            <li @click="goTo('index')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu01.png"/>
              </div>
              <div class="text">
                <h4>首页</h4>
                <div>HOME</div>
              </div>
            </li>
            <li @click="goTo('guests')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu02.png"/>
              </div>
              <div class="text">
                <h4>嘉宾</h4>
                <div>GUESTS</div>
              </div>
            </li>
            <li @click="goTo('plan')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu03.png"/>
              </div>
              <div class="text">
                <h4>行程</h4>
                <div>AGENDA</div>
              </div>
            </li>
            <li @click="goTo('map')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu04.png"/>
              </div>
              <div class="text">
                <h4>地图</h4>
                <div>MAP</div>
              </div>
            </li>
            <li @click="goTo('live')">
              <div class="icon">
                <img src="https://og9s6vxbs.qnssl.com/wiee/index/menu05.png"/>
              </div>
              <div class="text">
                <h4>直播</h4>
                <div>LIVE</div>
              </div>
            </li>
          </ul>
          <div class="footer" @click="goToGroup">
            <div class="btn">
            </div>
          </div>
        </div>
      </div>-->
    </header>
    <section class="content">
      <img src="https://og9s6vxbs.qnssl.com/wiee/zao/detail.png"/>
    </section>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100vh;
    background-color: #000;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      width: 100%;
      height: 56px;
      top: 0;
      left: 0;
      padding: 0 20px;
      color: #fff;

      .img {
        font-size: 0;
        width: 100px;

        img {
          height: 24px;
        }
      }

      .font-set {
        font-size: 13px;
      }

      @media (min-height: 412px) {
        .img {
          font-size: 0;

          img {
            height: 26px;
          }
        }

        .font-set {
          font-size: 14px;
        }
      }

      button {
        color: #fff;
      }

      .menu {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, .8);
        z-index: 1;
        overflow: hidden;

        .menu-list {
          background-color: rgb(0, 0, 0);
          position: absolute;
          top: 0;
          right: 0;
          border-left: solid 1px rgb(56, 56, 56);
          height: 100vh;
          display: flex;
          flex-direction: column;

          .close {
            text-align: right;
            padding: 20px 20px 30px 0;
            font-size: 14px;
          }

          .menu-ul {
            padding: 0 65px 0 26px;
          }

          li {
            text-align: center;
            color: #fff;
            display: flex;
            align-items: baseline;
            justify-content: flex-start;
            margin-bottom: 46px;

            .icon {
              height: 18px;
              width: 18px;
              font-size: 0;
              margin-right: 13px;

              img {
                width: 100%;
              }
            }

            .text {
              text-align: left;

              h4 {
                font-size: 24px;
                line-height: 24px;
                letter-spacing: 9px;
                margin-bottom: 4px;
              }

              div {
                font-size: 16px;
                line-height: 16px;
                letter-spacing: 1.9px;
                font-weight: 600;
                padding-left: 1px;
              }
            }

          }

          .footer {
            text-align: center;
            flex: 1;
            position: relative;

            .btn {
              width: 170px;
              font-weight: bold;
              background: url("https://og9s6vxbs.qnssl.com/wiee/index/side-btn.png") no-repeat;
              background-size: 100% 100%;
              font-size: 17px;
              line-height: 17px;
              left: 50%;
              transform: translateX(-50%);
              height: 44px;
              position: absolute;
              bottom: 12px;
            }

          }
        }
      }

    }

    .content {
      position: absolute;
      width: 100%;
      height: calc(100vh - 56px);
      top: 56px;
      left: 0;
      font-size: 0;

      img {
        width: 100%;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';

  @Component({})
  export default class ActivateComponent extends Vue {
    showMenu = false;

    created() {
      this.init();
    }

    async init() {
    }

    goToNextPage(tab: string) {
      this.$router.back();
    }

    goTo(tab: string) {
      this.showMenu = false;
      location.href = `/wv/wiee#${tab}`;
    }

    goToGroup() {
      this.$router.push({path: '/wv/wiee/group/5aec2ad12cfc070001746a4d'});
    }
  }
</script>
