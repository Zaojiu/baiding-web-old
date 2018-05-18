<template>
  <article class="wiee-container"
           @touchstart="touchStart" @touchmove="touchMove" @scroll="touchMove"
  >
    <header class="header">
      <div class="img" @click="goToNextPage('detail')"><img
        src="https://og9s6vxbs.qnssl.com/wiee/index/home-right.png?t=1"/></div>
      <div class="right">
        <span class="language" @click="changeLang()">
          <span class="zh">中</span>
          <span class="en">EN</span>
        </span>
        <span @click="showMenu = true" style="cursor: pointer;" class="font-set"><i class="bi bi-menu"></i></span>
      </div>
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
                <h4>日程</h4>
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
            <li @click="goTo('live')" v-if="liveInfoListAll.length>0">
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
              互动专区
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="content"
             :style="{overflow:showMenu?'hidden':'auto'}"
    >
      <div class="index">
        <img src="https://og9s6vxbs.qnssl.com/wiee/index/index-bg.jpg"/>
        <div class="index-action">
          <div class="img-wiee">
            <img src="https://og9s6vxbs.qnssl.com/wiee/index/wiee-zaojiu.png"/>
          </div>
          <div class="img" style="cursor: pointer;" @click="goTo('index')">
            <img src="https://og9s6vxbs.qnssl.com/wiee/index/down.png"/>
          </div>
        </div>
      </div>

      <div id="index" class="zao-detail">
        <h2><img src="https://og9s6vxbs.qnssl.com/wiee/detail/ZAO.png"/></h2>
        <p>
          笛卡尔说：“我思故我在。”思考使人类真正获得了存在的价值，思想则是人类思考绽放出的耀眼火花。
        </p>
        <p ref="guests">
          随着科技的飞速进步，它越来越深刻地改变着我们所处的世界。商业的价值转化发生了巨大的改变，城市的发展越来越依赖技术化的规划，教育的形态变得更加丰富多彩，文化与艺术则越来越多地与技术手段相结合。
        </p>
        <p>
          我们走到了一个值得深刻思考的十字路口，科技与人文在此交汇、碰撞，时间与空间的冲突、变革愈发频繁。我们试图在这个路口汇聚当下走在最前面的一群思想者，去探讨未来趋势的方向，去辩谈城市的构造与包容，去深思教育的未来形态，去诠释艺术的全新面貌。
        </p>
      </div>

      <div class="video-content">
        <header :class="{
        'sticky': isVideoPlayed && !isLandscape && !isOnScreen,
        'played': isVideoPlayed,
        'played-landscape': isVideoPlayed && isLandscape
      }">
          <div class="player" id="player" @click="isVideoPlayed = true"></div>

          <div class="live-cover" v-if="!isVideoPlayed">
            <img
              class="cover-image"
              alt="话题间封面"
              :src="coverUrl"
              @error="coverUrl = defaultImg"
            >

            <div class="big-play"></div>
          </div>
        </header>
      </div>

      <div id="guests" class="guest">
        <h2>
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/guests.png"/>
        </h2>
        <div class="guest-show">
          <img :src="guestObj.url"/>
          <div class="action">
            <div class="action-text">
              <h3>{{guestObj.name}}</h3>
              <p v-for="item in guestObj.desc">{{item}}</p>
            </div>
          </div>
          <div class="button-group">
            <button @click="goToSpeaks(guestObj.id)">详情</button>
            <button @click="goToGroup()">提问</button>
          </div>
        </div>
        <div class="guest-control">
          <div class="guest-item" v-for="item in guestArray" :class="{'active':guestIndex===item.index}"
               @click="chooseGuest(item.index)">
            <img :src="item.cover"/>
          </div>
        </div>
      </div>

      <div id="plan" class="plan">
        <h2>
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/agenda.png"/>
        </h2>
        <nav class="plan-nav">
          <span class="item" :class="{'active':planIndex === 0}" @click="choosePlan(0)">5月19日</span>
          <span class="item" :class="{'active':planIndex === 1}" @click="choosePlan(1)">5月20日</span>
          <span class="item" :class="{'active':planIndex === 2}" @click="choosePlan(2)">5月21日</span>
          <span class="item" :class="{'active':planIndex === 3}" @click="choosePlan(3)">5月22日</span>
        </nav>
        <div class="plan-content">
          <section class="plan-content">
            <h3 v-for="item in planData.desc">{{item}}</h3>
            <div class="step-item" v-for="(content,index) in planData.content">
              <div class="line" :class="{first: index===0,last: index===(planData.content.length - 1)}"></div>
              <div class="line-text" :class="{'other-text-top':!content.status}">
                <p class="start">{{content.start}}</p>
                <p class="end">{{content.end}}</p>
              </div>
              <div class="cycle" :class="{'other-top':!content.status}"></div>
              <div class="desc-content" :class="{'other-color':!content.status}">
                <div class="desc">
                  <h4 v-for="h4 in content.title">{{h4}}</h4>
                  <p>{{content.desc}}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div id="map" class="map">
        <h2>
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/map.png"/>
        </h2>
        <div class="map-content">
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/map-detail.png"/>
        </div>
        <div class="map-btn">
          <button @click="goToNextPage('navigation')">
            查看场馆信息
          </button>
        </div>
      </div>

      <div id="live" class="live" v-if="liveInfoListAll.length>0">
        <h2>
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/live.png"/>
        </h2>
        <header class="live-banner">
          <img class="img" :src="liveInfo.cover169Url" @error="liveInfo.cover169Url = defaultImg"/>
          <div class="play" @click="goToLiveRoom(liveInfo.id)">
            <img src="https://og9s6vxbs.qnssl.com/wiee/detail/play.png"/>
          </div>
          <div class="tips" v-if="liveInfo.isStarted">正在直播：{{liveInfo.subject}}</div>
        </header>
        <div class="live-content">
          <div class="item" v-for="item in liveInfoList" @click="goToLiveRoom(item.id)">
            <div class="item-banner">
              <img :src="item.cover169Url" @error="item.cover169Url = defaultImg"/>
            </div>
            <div class="text-content">
              <div class="item-text">
                <h3>{{item.subject}}</h3>
                <p>{{liveTime[liveInfo.id]}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="live-btn">
          <button @click="goToNextPage('live')">
            查看全部直播
          </button>
        </div>
      </div>

      <div id="enter" class="enter">
        <h2><img src="https://og9s6vxbs.qnssl.com/wiee/detail/enter.png"/></h2>
        <p>
          为了维护安全、文明、有序的参观环境，请认真阅读以下条款，并在参观“创博会”时遵照执行
        </p>
        <p>
          一、“博览会”园区将在上午8:30分开放入场，20:00时停止入场，所有人员进入场馆前必须经过安全检查，为确保观众准时入场参加论坛演讲，请充分考虑交通与安检排队所需时间，尽可能选择公共交通，提早抵达场馆。
        </p>
        <p>
          二、为维护场馆秩序，方便他人愉快地参观园区，请注意不要携带以下物品，以免在安检时耽误您的宝贵时间：易碎品与各类容器；锣鼓、喇叭、口哨等各类乐器；体积较大、不方便带入坐席区的箱包、手提袋等随身物品；各类旗帜；任何横幅、标语、传单等宣传品与展示品；任何未经授权的专业摄像设备；刀具、球棒、长柄伞、长棍、照相机与摄像机支架等尖锐物，或其它容易造成人身伤害的物品；打火机、火柴等点火器具；动物（导盲犬除外）；除婴儿车与轮椅之外的任何代步工具；未经授权的对讲机、扩音器、收音机、激光装置、无线电设备等干扰园区电子信号的物品。枪支、弹药、弩、匕首等管制器具；烟花爆竹等易燃物品；腐蚀性与放射性物品等国家法律法规明令禁止的物品。
        </p>
        <p>
          三、场馆内必须对区入座，请您根据手环显示区域位置就座，如有需要，可向服务志愿者寻求帮助。
        </p>
        <p>
          四、为了他人能够愉悦地参观园区，以下行为在场馆中将被视作不当行为并予以制止：在园区内吸烟；翻越护栏、踩踏座椅；携带婴儿车或轮椅进入非无障碍坐席；进入贵宾区、工作区等非参观区域；在坐席区内撑伞、长时间站立等遮挡他人视线或影响他人体验论坛演讲的行为；刻意展示、宣传服饰及随身物品上的商业标识；集体穿戴含有相同或相似设计图案、色彩组合或商业标志的服饰；其它分散参观人员注意力，影响创博会顺利进行或妨碍他人参观的行为，包括明显处于醉酒状态进入场馆，不服从工作人员管理等。
        </p>
        <p>
          五、未经授权，禁止在场馆内开展任何宣传、推广、展示或筹集资金的活动，包括商业、环保、动物保护等内容；禁止在场馆内分发促销品或带有企业标识的任何产品；未经授权，禁止在场馆内进行电视转播报道或使用专业设备录像。
        </p>
        <p>
          六、严禁围攻参观人员或者其他工作人员；严禁任何形式的赌博行为；严禁任何游行、酒后滋事、及其他扰乱现场活动秩序和违反我国法律法规的行为。
        </p>
      </div>

      <div class="collaboration" id="a">
        <h5>合作单位</h5>
        <div class="co-content">
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/link-1.png"/>
        </div>
      </div>
      <div class="collaboration padding-60">
        <h5>赞助单位</h5>
        <div class="co-content">
          <img src="https://og9s6vxbs.qnssl.com/wiee/detail/link-2.png"/>
        </div>
      </div>
    </section>
    <div class="footer-btn" v-if="showBtn" @click="goToTicket()">
      立即购票
    </div>
  </article>
</template>

<style lang="scss" scoped>
  .wiee-container {
    height: 100vh;
    background-color: #000;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

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

      .right {

        .language {
          margin-right: 24px;
          position: relative;
          top: 2px;

          .zh {
            font-size: 14px;
            line-height: 14px;
            padding-right: 4px;
            font-weight: 700;

            &::after {
              content: "";
              display: block;
              position: absolute;
              width: 1px;
              height: 14px;
              background-color: #fff;
              top: -12px;
              right: 25px;
            }
          }

          .en {
            color: rgb(128, 128, 128);
            padding-left: 6px;
            font-size: 15px;
            line-height: 15px;
            font-weight: 600;
          }
        }
      }

      .img {
        font-size: 0;

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
        z-index: 3;
        overflow: hidden;
        font-size: 14px;

        .menu-list {
          background-color: rgb(0, 0, 0);
          position: absolute;
          top: 0;
          right: 0;
          border-left: solid 1px rgb(26, 26, 26);
          height: 100vh;
          display: flex;
          flex-direction: column;

          .close {
            text-align: right;
            padding: 20px 20px 30px 0;
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
              width: 18px;
              font-size: 0;
              margin-right: 13px;

              &:nth-child(1) {
                font-size: 19px;
              }

              &:nth-child(1) {
                font-size: 19px;
              }

              img {
                width: 100%;
              }
            }

            @media (min-height: 412px) {
              .icon {
                width: 20px;

                &:nth-child(1) {
                  font-size: 21px;
                }

                &:nth-child(1) {
                  font-size: 21px;
                }
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
              line-height: 44px;
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

    .footer-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 52px;
      background-color: rgb(0, 211, 193);
      text-align: center;
      justify-content: center;
      align-items: center;
      color: #fff;
      line-height: 52px;
      font-weight: bold;
      z-index: 2;
      font-size: 18px;

      img {
        position: relative;
        top: 1px;
        width: 17px;
        height: 17px;
        margin-right: 8px;
      }
    }

    .video-content {
      margin: 20px auto 0 auto;
      width: calc(100% - 40px);
      flex-shrink: 0;
      position: relative;
      font-size: 0;
      background-color: #0A0A17;
      padding-top: calc(56.25% - 22.5px);

      .video {
        position: absolute;
        top: 0;
        right: 0;
        height: 56.25vw;
        width: 100%;
      }

      header {
        position: absolute;
        top:0;
        left: 0;
        height: 100%;
        width: 100%;

        /*&.sticky {
          position: sticky;
          top: 0;
          z-index: $z-index-page-lv1;
        }*/

        &.played:before {
          height: 56.25vw;
        }

        &.played-landscape:before {
          height: 100vh;
        }

        &:before {
          content: "";
          display: block;
          height: 240px;
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
          font-size: 0;
          background: #000;

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
            background: url("https://og9s6vxbs.qnssl.com/wiee/detail/play.png") center top no-repeat;
            background-size: 100% 100%;
            pointer-events: none;
            height: 48px;
            width: 48px;
            color: $color-w;
            text-shadow: 0 0 2px $color-b;
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
      color: #fff;

      > div {
        background-color: #000;
      }

      .index {
        height: 100%;
        position: relative;
        font-size: 0;

        > img {
          margin-top: 34px;
          width: 100%;
        }
        .index-action {
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 15px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .img-wiee {
            margin-bottom: 28px;
            height: 29px;
            font-size: 0;
            img {
              height: 100%;
            }
          }

          .img {
            height: 55px;
            font-size: 0;
            cursor: pointer;

            img {
              height: 100%;
            }
          }

          @media (min-height: 412px) {
            .img-wiee {
              height: 32px;
            }
            .img {
              height: 61px;
            }
          }
        }

      }

      .zao-detail {
        padding: 35px 20px 0 20px;

        h2 {
          height: 44px;
          font-size: 0;
          margin-bottom: 15px;

          img {
            height: 100%;
          }
        }

        p {
          font-size: 16px;
          line-height: 26px;
          letter-spacing: 1.6px;
          font-weight: bold;

          & + p {
            margin-top: 30px;
          }
        }
      }

      .guest {
        padding-top: 36px;

        h2 {
          height: 27px;
          padding: 0 20px;
          font-size: 0;

          img {
            height: 100%;
          }
        }

        .guest-show {
          font-size: 0;
          position: relative;
          padding-top: 77.8%;
          font-size: 0;
          margin-top: 9px;

          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }

          .action {
            padding-right: 20px;
            width: 168px;
            font-size: 14px;
            position: absolute;
            top: 72px;
            right: 0;
            z-index: 1;

            .action-text {

              .h3 {
                font-size: 18px;
                line-height: 18px;
              }

              p {
                margin-top: 7px;
                font-size: 13px;
                line-height: 18px;
                color: rgb(166, 166, 166);
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical;
              }
            }

          }

          .button-group {
            position: absolute;
            width: 168px;
            bottom: 41px;
            right: 0;

            display: flex;
            align-items: center;
            margin-top: 60px;

            button {
              color: #fff;
              font-size: 12px;
              line-height: 12px;
              padding: 9px 0;
              width: 69px;
              text-align: center;
              border: 0;
              // border: 1px solid rgb(255, 255, 255);
              border-radius: 40px;
              background: url("https://og9s6vxbs.qnssl.com/wiee/detail/guest-btn.jpg") no-repeat;
              background-size: 100% 100%;

              &:first-child {
                margin-right: 10px;
              }
            }
          }
        }

        .guest-control {
          overflow-x: scroll;
          width: 100%;
          white-space: nowrap;
          font-size: 0;

          .guest-item {
            position: relative;
            display: inline-block;
            height: 70px;
            width: 60px;
            background-color: #1A1A1A;

            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }

            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              height: 70px;
              width: 60px;
              background-color: rgba(0, 0, 0, .5);
            }
          }

          .active {
            &::after {
              background-color: rgba(0, 0, 0, 0);
            }
          }
        }

      }

      .plan {
        padding: 50px 20px 0 20px;

        h2 {
          height: 23px;
          font-size: 0;

          img {
            height: 100%;
          }
        }

        .plan-nav {
          margin: 24px 0 32px 0;
          font-size: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          .item {
            font-size: 14px;
            line-height: 14px;
            padding-bottom: 8px;
            color: #fff;
            flex: 1;
            text-align: center;
            border-bottom: 2px solid rgb(216, 216, 216);
          }

          .active {
            position: relative;
            color: rgb(0, 211, 193);
            border-bottom: 2px solid rgb(0, 211, 193);

            &::after {
              content: '';
              display: block;
              position: absolute;
              left: 50%;
              bottom: -8px;
              width: 0;
              height: 0;
              transform: translateX(-50%);
              border-left: 5px solid transparent;
              border-top: 6px solid rgb(0, 211, 193);
              border-right: 5px solid transparent;
            }
          }
        }

        .plan-content {

          .first {
            top: 25px !important;
          }

          .last {
            height: 20px !important;
          }

          h3 {
            font-size: 20px;
            line-height: 20px;
            color: rgb(242, 242, 242);
            letter-spacing: 1px;
            margin-bottom: 0;

            & + h3 {
              margin-top: 6px;
            }
          }

          .step-item {
            display: flex;
            align-items: baseline;
            vertical-align: top;
            position: relative;
            padding: 0 13px 0 0;

            .line {
              position: absolute;
              left: 58px;
              top: -8px;
              height: 100%;
              width: 1px;
              background-color: rgb(230, 230, 230);
              padding: 38px 0 6px;
            }

            .line-text {
              position: absolute;
              top: 29px;
              text-align: right;

              .start {
                font-size: 14px;
                line-height: 14px;
                color: rgb(242, 242, 242);
                font-weight: bold;
                margin-bottom: 4px;
              }

              .end {
                font-size: 13px;
                line-height: 13px;
                color: rgb(166, 166, 166);
              }
            }

            .other-text-top {
              top: 42px;
            }

            .cycle {
              margin-left: 50px;
              border: 1px solid rgb(255, 255, 255);
              background-color: rgb(255, 255, 255);
              width: 16px;
              height: 16px;
              line-height: 16px;
              text-align: center;
              border-radius: 16px;
              position: absolute;
              top: 25px;
              z-index: 1;
            }

            .desc-content {
              position: relative;
              margin: 0 0 0 77px;
              flex-grow: 1;
              .desc {
                background-color: transparent;
                border-radius: 4px;
                padding: 24px 0 0 0;

                h4 {
                  font-size: 14px;
                  padding-bottom: 6px;
                }

                p {
                  font-size: 14px;
                  line-height: 20px;
                  color: rgb(166, 166, 166)
                }
              }
            }

            .other-top {
              top: 40px;
            }

            .other-color {
              top: 10px;

              .desc {
                padding: 10px 18px;
                background: url("https://og9s6vxbs.qnssl.com/wiee/detail/rest.png") repeat;
                background-size: 100% 100%;
                margin: 20px 0;

                h4 {
                  padding: 0;
                }
              }
            }

          }

        }

      }

      .map {
        padding-top: 50px;

        h2 {
          height: 24px;
          font-size: 0;
          padding: 0 20px;

          img {
            height: 100%;
          }
        }

        .map-content {
          font-size: 0;

          img {
            font-size: 0;
            width: 100%;
          }
        }

        .map-btn {
          text-align: center;
          font-size: 0;
          padding: 12px 0 38px 0;

          button {
            color: #fff;
            height: 46px;
            width: 226px;
            border: 0;
            border-radius: 23px;
            font-size: 17px;
            font-weight: bold;
            background: url("https://og9s6vxbs.qnssl.com/wiee/detail/live-style.png?t=1") no-repeat;
            background-size: 100% 100%;
          }
        }

      }

      .live {
        padding: 40px 20px 16px 20px;

        h2 {
          margin-bottom: 21px;
          height: 25px;
          font-size: 0;

          img {
            height: 100%;
          }
        }

        .live-banner {
          position: relative;
          padding-top: 56.25%;
          background-color: #1A1A1A;
          font-size: 0;

          .tips {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            font-size: 12px;
            line-height: 12px;
            padding: 8px 16px;
            color: #fff;
            background-color: rgba(56, 56, 56, 0.8);
          }

          .play {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            height: 48px;
            width: 48px;
            font-size: 0;

            img {
              width: 100%;
            }
          }

          > .img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }

        .live-content {
          padding: 24px 0 20px 0;

          .item {
            display: flex;
            justify-content: left;
            align-items: center;
            margin-bottom: 20px;
            font-size: 0;

            .item-banner {
              width: 37%;
              padding-top: 20.81%;;
              background-color: #1A1A1A;
              font-size: 0;
              position: relative;

              img {
                border: 0;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
              }
            }

            .text-content {
              width: 63%;
              position: relative;
              font-size: 0;
              padding-top: 18%;

              .item-text {
                padding-left: 12px;
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;

                h3 {
                  font-size: 16px;
                  line-height: 20px;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                }

                p {
                  font-size: 12px;
                  color: rgb(128, 128, 128);
                  white-space: pre-line;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                }
              }
            }
          }
        }

        .live-btn {
          text-align: center;

          button {
            color: #fff;
            height: 46px;
            line-height: 46px;
            width: 226px;
            border: 0;
            border-radius: 23px;
            font-size: 17px;
            font-weight: bold;
            background: url("https://og9s6vxbs.qnssl.com/wiee/detail/live-style.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }

      .enter{
        padding: 35px 20px 15px 20px;

        h2 {
          height: 25px;
          font-size: 0;
          margin-bottom: 15px;

          img {
            height: 100%;
          }
        }

        p {
          font-size: 16px;
          line-height: 26px;
          letter-spacing: 1.6px;
          font-weight: bold;

          & + p {
            margin-top: 30px;
          }
        }
      }

      .collaboration {
        padding: 31px 20px 0 20px;

        h5 {
          font-size: 16px;
          line-height: 16px;
        }

        .co-content {
          padding-top: 12px;
          font-size: 0;

          img {
            width: 100%;
          }
        }
      }

      .padding-60 {
        padding-bottom: 60px;
      }

    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {UserInfoModel} from '../../shared/api/user.model'
  import {isInApp, isInWechat} from "../../shared/utils/utils";
  import {host} from "../../env/environment";
  import {guests, PlanList} from './wiee.data';
  import {setShareInfo} from '../../shared/utils/share';
  import {LiveInfoModel} from "../../shared/api/lives.model";
  import {listNow} from './api';
  import {praseLiveTime} from '../../shared/utils/utils';
  import {isOnLargeScreen, isAndroid, isiOS} from '../../shared/utils/utils';
  import {ZaojiuPlayer, ZaojiuPlayerInstance, PlayerEvent} from "zaojiu-player";

  @Component({})
  export default class ActivateComponent extends Vue {
    navIndex = 0;
    userInfo: UserInfoModel;
    isInApp = isInApp;
    originX: number;
    moveClientX: number;
    originY: number;
    moveClientY: number;
    showBtn = false;
    guestDom: any;
    guestIndex = 0;
    planIndex = 0;
    guestObj: { name: string, desc: string[], url: string } = guests[0];
    guestArray = guests;
    showMenu = false;
    planData: any = PlanList[0];
    liveInfo: LiveInfoModel;
    liveInfoList: LiveInfoModel[] = [];
    liveInfoListAll: LiveInfoModel[] = [];
    defaultImg = '/assets/img/default-cover.jpg';
    liveTime: { [liveId: string]: string } = {};
    lang = 'zh';
    isOnScreen = isOnLargeScreen;
    isVideoPlayed = false;
    isLandscape = false;
    coverUrl = 'https://og9s6vxbs.qnssl.com/wiee/video-cover.jpg';
    seeking = false;
    player: ZaojiuPlayerInstance;


    @Watch('$route.name')
    setNavIndex() {
      this.init();
    }

    created() {
      this.share();
      this.init();
      this.prepareVideo();
      this.$nextTick(() => {
        this.guestDom = this.$refs['guests'];
      })
    }

    async share() {
      if (isInWechat) {
        setShareInfo(
          '造就思想节：发现最有创造力的思想',
          `科技与人文交汇的十字路口`,
          'https://og9s6vxbs.qnssl.com/wiee/wiee-share.jpg',
          `${host.self}/wv/wiee`
        );
      }
    }

    async init() {
      this.lang = this.$route.query['lang'];
      if (this.lang === 'en') {
        this.$i18n.locale = 'en';
      } else {
        this.$i18n.locale = 'zh';
      }

      try {
        this.liveInfoListAll = await listNow('', 4);
      } catch (e) {

      }
      for (let liveInfo of this.liveInfoListAll) {
        this.liveTime[liveInfo.id] = praseLiveTime(liveInfo);
      }
      this.liveInfo = this.liveInfoListAll[0];
      this.liveInfoList = this.liveInfoListAll.slice(1, 4);

    }

    goTo(tab: string) {
      this.showMenu = false;
      location.href = `/wv/wiee/index#${tab}`;
    }

    goToGroup() {
      this.$router.push({path: '/wv/wiee/group/5aec2ad12cfc070001746a4d'});
    }

    goToNextPage(page: string) {
      if (page !== 'live') {
        this.$router.push({path: `/wv/wiee/${page}`})
      } else {
        window.location.href = 'https://www.zaojiu.com/lives/wiee';
      }
    };

    goToSpeaks(id: string) {
      this.$router.push({path: `/wv/wiee/guests/${id}`})
    };

    touchStart(e: TouchEvent) {

    }

    touchMove() {
      let guestDom = (this.guestDom as HTMLElement);
      let rect = guestDom.getBoundingClientRect();
      let top = rect.top;

      if (top <= (document.documentElement.clientHeight - 70)) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    }

    chooseGuest(index: number) {
      this.guestIndex = index;
      this.guestObj = guests[index];
    }

    choosePlan(index: number) {
      this.planIndex = index;
      switch (index) {
        case 0:
          this.planData = PlanList[0];
          break;
        case 1:
          this.planData = PlanList[1];
          break;
        case 2:
          this.planData = PlanList[2];
          break;
        case 3:
          this.planData = PlanList[3];
          break;
      }
    }

    goToTicket() {
      this.$router.push({path: '/events/5ad9bc0e11bc18000139cc8e/tickets'});
    }

    changeLang() {
      this.$router.push({path: '/wv/wiee/index/en'});
    }

    goToLiveRoom(id: number) {
      location.href = `https://www.zaojiu.com/lives/${id}/info`;
    }

    prepareVideo() {
      System.import('zaojiu-player').then((player: ZaojiuPlayer) => {
        this.player = new player({
          element: 'player',
          playList: [{
            src: '',// todo url
            quality: '标清',
            mimetype: 'video/mp4'
          }, {
            src: 'https://og9s6vxbs.qnssl.com/wiee/video.mp4',
            quality: '高清',
            mimetype: 'video/mp4'
          }],
        });
        this.player.event$.subscribe((e: PlayerEvent) => {
          switch (e.type) {
            case 'play':
              break;
            case 'error':
              this.isVideoPlayed = true;
              break;
            case 'seeking':
              this.seeking = true;
              break;
            case 'playing':
              this.seeking = false;
              break;
          }
        });
      });

      // 横竖屏polyfill
      System.import('o9n').then((o9n: any) => {
        this.isLandscape = o9n.orientation.type.indexOf('landscape') !== -1 && (isAndroid || isiOS);
        o9n.orientation.onchange = (evt: any) => {
          this.isLandscape = evt.target.type.indexOf('landscape') !== -1 && (isAndroid || isiOS);
        }
      });
    }

  }
</script>
