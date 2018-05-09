<template>
  <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
  <error class="abs-center" v-else-if="isNotFound">网络错误</error>
  <div class="container" v-else>
    <nav class="nav">
      <div
        @click="changeNav(0)"
        :class="{'active':navIndex===0}">
        介绍
      </div>
      <div
        @click="changeNav(1)"
        :class="{'active':navIndex===1}">
        演讲
      </div>
      <div
        @click="changeNav(2)"
        :class="{'active':navIndex===2}">
        花絮
      </div>
      <div
        @click="changeNav(3)"
        :class="{'active':navIndex===3}">
        画册
      </div>
      <!--<div
        @click="changeNav(4)"
        :class="{'active':navIndex===4}">
        评论
      </div>-->
    </nav>
    <section class="content">
      <transition :name="translation" v-if="navIndex===0">
        <div class="child-view" key="1">
          <div class="desc">
            <section class="guest">
              <div class="avatar">
                <img :src="`${speakerData.object.coverUrl}~1-1`"/>
              </div>
              <div class="desc">
                <h3 class="name">{{speakerData.object.subject}}</h3>
                <p class="description">{{speakerData.object.meta?speakerData.object.meta.title:''}}</p>
              </div>
              <div class="action">
                <button @click="goToGroup">联系嘉宾</button>
              </div>
            </section>
            <h1 class="title">嘉宾简介</h1>
            <p class="chinese">
              {{speakerData.object.desc}}
            </p>
          </div>
        </div>
      </transition>
      <transition :name="translation" v-if="navIndex===1">
        <div class="child-view" key="2">
          <div class="talk">
            <div class="talk-group" v-if="media.length>0">
              <div class="talk-item" v-for="item in media">
                <div class="img">
                  <img :src="item.coverUrl" @error="item.coverUrl = defaultImg"/>
                  <div class="tag">
                    <span>#{{item.tag}}</span>
                    <span>{{item.duration}}</span>
                  </div>
                  <div class="play">
                    <img src="https://og9s6vxbs.qnssl.com/wiee/detail/play.png"/>
                  </div>
                </div>
                <h3>{{item.subject}}</h3>
                <p>{{item.title}}</p>
              </div>
            </div>
            <div class="center">暂无演讲</div>
          </div>
        </div>
      </transition>
      <transition :name="translation" v-if="navIndex===2">
        <div class="child-view" key="3">
          <div class="high-lights">
            <div class="talk-group" v-if="media.length>0">
              <div class="talk-item" v-for="item in media">
                <div class="img">
                  <img :src="item.coverUrl" @error="item.coverUrl = defaultImg"/>
                  <div class="play">
                    <img src="https://og9s6vxbs.qnssl.com/wiee/detail/play.png"/>
                  </div>
                </div>
                <h3>{{item.subject}}</h3>
              </div>
            </div>
            <div class="center">暂无花絮</div>
          </div>
        </div>
      </transition>
      <transition :name="translation" v-if="navIndex===3">
        <div class="child-view" key="4">
          <div class="images">
            <div class="talk-group" v-if="imgList.length>0">
              <div class="talk-item" v-for="item in imgList">
                <div class="img">
                  <img :src="item" @error="item = defaultImg"/>
                </div>
              </div>
            </div>
            <div class="center">暂无照片</div>
          </div>
        </div>
      </transition>

    </section>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    height: 100%;
    background-color: #000;
    $nav-height: 48px;

    .nav {
      display: flex;
      justify-content: space-around;
      align-items: center;
      color: rgb(166, 166, 166);
      height: 48px;
      font-size: 14px;
      line-height: 16px;

      > div {
        width: 18%;
        text-align: center;
      }

      .active {
        color: rgb(0, 211, 193);
        font-weight: bold;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          width: 100%;
          margin: 0;
          height: 2px;
          background-color: rgb(0, 211, 193);
          bottom: -14px;
          left: 0;
          display: block;
        }
      }
    }

    .content {
      background-color: #000;
      height: calc(100vh - #{$nav-height});
      overflow: hidden;
      position: relative;
      font-size: 14px;

      .center {
        text-align: center;
        color: #6b6b6b;
      }
    }

    .desc {
      overflow-y: auto;
      padding: 25px 20px 0 20px;

      .guest {
        display: flex;
        align-items: center;
        margin-bottom: 28px;

        .avatar {
          height: 56px;
          width: 56px;
          border-radius: 28px;
          background-color: #000;
          overflow: hidden;

          img {
            width: 100%;
          }
        }

        .desc {
          margin-left: 8px;
          width: calc(100% - 120px);
          padding: 0 16px 0 8px;

          .name {
            color: rgb(244, 244, 244);
            font-size: 16px;
            line-height: 16px;
          }
          .description {
            font-size: 12px;
            line-height: 20px;
            color: rgb(204, 204, 204)
          }
        }

        .action {
          button {
            width: 64px;
            height: 26px;
            text-align: center;
            color: rgb(0, 211, 193);
            border: 1px solid rgb(0, 211, 193);
            border-radius: 4px;
            font-size: 12px;
          }
        }
      }

      .title {
        margin-top: 48px;
        color: rgb(242, 242, 242);
        font-size: 18px;
        line-height: 18px;
        text-align: left;
        margin-bottom: 12px;
      }

      .chinese {
        font-size: 14px;
        line-height: 23px;
        color: rgb(204, 204, 204);
      }

      .english {
        margin-top: 30px;
        font-size: 14px;
        line-height: 23px;
        color: rgb(204, 204, 204);
      }
    }

    .talk {
      overflow-y: auto;
      padding: 25px 20px 0 20px;

      .talk-group {
        .talk-item {
          margin-bottom: 35px;

          .img {
            padding-top: 56.25%;
            font-size: 0;
            position: relative;
            background-color: #1A1A1A;

            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }

          .play {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            height: 48px;
            width: 48px;

            img {
              width: 100%;
            }
          }

          .tag {
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 8px;
            color: #fff;
            font-size: 12px;
            line-height: 12px;
            background-color: transparent;
            display: flex;
            justify-content: space-between;
            padding: 0 16px;
          }

          h3 {
            color: #fff;
            font-size: 16px;
            line-height: 22px;
            text-align: left;
            margin-top: 12px;
          }
          p {
            margin-top: 4px;
            color: rgb(166, 166, 166);
            font-size: 14px;
            line-height: 16px;
            text-align: left;
          }
        }
      }
    }

    .high-lights {
      overflow-y: auto;
      padding: 25px 20px 0 20px;

      .talk-group {
        .talk-item {
          margin-bottom: 35px;

          .img {
            padding-top: 56.25%;
            font-size: 0;
            position: relative;
            background-color: #1A1A1A;

            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }

            .play {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translateX(-50%) translateY(-50%);
              height: 48px;
              width: 48px;

              img {
                width: 100%;
              }
            }

          }

          h3 {
            color: #fff;
            font-size: 16px;
            line-height: 22px;
            text-align: left;
            margin-top: 12px;
          }
        }
      }
    }

    .images {
      overflow-y: auto;
      padding: 25px 20px 0 20px;

      .talk-group {
        .talk-item {
          margin-bottom: 35px;

          .img {
            font-size: 0;
            position: relative;
            background-color: #1A1A1A;

            img {
              width: 100%;
            }

            img[src=""] {
              opacity: 0;
            }

          }

        }
      }
    }

    .child-view {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100% - #{$nav-height});
      transition: all .5s cubic-bezier(.55, 0, .1, 1);
    }
    .slide-left-enter, .slide-right-leave-active {
      opacity: 0;
      transform: translate(30px, 0);
    }
    .slide-left-leave-active, .slide-right-enter {
      opacity: 0;
      transform: translate(30px, 0);
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getSpeakerInfo, getSpeakerMedia, SpeakerMedia} from '../api'

  @Component({})
  export default class ActivateComponent extends Vue {
    navIndex = 0;
    translation = '';
    id = '';
    speakerData: any;
    isLoading = true;
    isNotFound = false;
    defaultImg = '/assets/img/default-cover.jpg';
    imgList: string[] = [];
    media: SpeakerMedia[] = [];

    created() {
      this.init();
    }

    @Watch('$route.name')
    routerChange() {
      this.init();
    }

    async init() {
      this.isLoading = true;
      this.id = this.$route.params['id'];
      try {
        this.speakerData = await getSpeakerInfo(this.id);
        this.media = await getSpeakerMedia(this.id);
        this.imgList = (this.speakerData.object &&
          this.speakerData.object.meta &&
          this.speakerData.object.meta.photo) ?
          this.speakerData.object.meta.photo : [];
      } catch (e) {
        this.isNotFound = true;
      } finally {
        this.isLoading = false;
      }
    }

    changeNav(navIndex: number) {
      if (navIndex > this.navIndex) {
        this.translation = 'slide-left'
      } else {
        this.translation = 'slide-right'
      }
      this.navIndex = navIndex;
    }

    goToGroup() {
      this.$router.push({path: '/wv/wiee/group/5aec2ad12cfc070001746a4d'});
    }
  }
</script>
