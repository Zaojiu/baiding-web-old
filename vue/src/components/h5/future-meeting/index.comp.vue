<template>
  <article class="container"
           ref="container"
           @touchstart="touchStart" @touchmove="touchMove" @scroll="touchMove"
  >
    <header
      class="header"
      :class="{'bg-black':changeNav}"
    >
      <div class="head-content">
        <div class="img">
          <img src="https://og9s6vxbs.qnssl.com/futrue/logo-new.png"/></div>
        <div class="right">
          <span @click="showMenuSide" style="cursor: pointer;" class="font-set font-14"><i
            class="bi bi-menu"></i></span>
        </div>
      </div>
    </header>
    <section class="content">

      <div class="img-cover">
        <img src="https://og9s6vxbs.qnssl.com/futrue/banner-new.jpg"/>
      </div>

      <p class="desc font-14">
        科技的应用出现了令人惊叹的突破，原先看似疯狂的想法逐渐变为现实，未来已经被颠覆。最先进的技术元素，与产业变革有关，更与人类的未来与福祉息息相关。未来已来，让我们一同踏入充满奇思妙想的新纪元。
      </p>

      <div id="city" class="title-content">
        <div class="dots">
          <div class="text">
            <h3>未来城市：虚拟与物理，两个层面的城市将同时存在</h3>
            <p class="font-14">
              “城市的形态”是不断优化，还是彻底颠覆? 是跃迁升级的科幻世界，还是电缆之中的虚拟国度? 我们看到的是充满惊喜的“应许之地” 还是必将离开的“厌弃之城”? 未来城市，必将颠覆你的“视”界
            </p>
            <div class="time font-14 color-text-3">时间：7.28 13:30-15:30</div>
          </div>
        </div>
        <div class="img" style="background-image: url('https://og9s6vxbs.qnssl.com/futrue/chengshi.jpg')"></div>
      </div>
      <div class="guest-content">
        <div class="panel">
          <img :src="guestsActiveMap.cityList.picture"/>
          <div class="text color-3">
            <h4>{{guestsActiveMap.cityList.name}}</h4>
            <p class="font-14">{{guestsActiveMap.cityList.desc[0]}}</p>
          </div>
        </div>
        <div class="control">
          <div class="guest-item" v-for="(item,index) in cityList"
               :class="{'active':guestsIndexMap.cityList===index}"
               @click="activeGuest('cityList',index)">
            <img :src="item.Thumbnail"/>
          </div>
        </div>
      </div>

      <div id="recreation" class="title-content">
        <div class="dots">
          <div class="text">
            <h3>未来娱乐：ACGN百亿量级市场如何产业化</h3>
            <p class="font-14">
              动画、影视、漫画、游戏、轻小说、ACGN和数字娱乐行业随着次世代的来临地覆天翻的变化着。手游为王？主机消亡？中国的网络文学与日本轻小说孰优孰劣？国产影视注定五毛特效？未来ACGN产业化会如何发展？我们是否触碰到了次世代的边界？
            </p>
            <div class="time font-14 color-text-5">时间：7.29 11:20-13:20</div>
          </div>
        </div>
        <div class="img" style="background-image: url('https://og9s6vxbs.qnssl.com/futrue/yule.jpg')"></div>
      </div>
      <div class="guest-content">
        <div class="panel">
          <img :src="guestsActiveMap.designList.picture"/>
          <div class="text color-5">
            <h4>{{guestsActiveMap.designList.name}}</h4>
            <p class="font-14">{{guestsActiveMap.designList.desc[0]}}</p>
          </div>
        </div>
        <div class="control">
          <div class="guest-item" v-for="(item,index) in designList"
               :class="{'active':guestsIndexMap.designList===index}"
               @click="activeGuest('designList',index)">
            <img :src="item.Thumbnail"/>
          </div>
        </div>
      </div>

      <div id="explore" class="title-content">
        <div class="dots">
          <div class="text">
            <h3>未来探索：外太空和深海探测，将重塑新的家园</h3>
            <p class="font-14">
              陆地到海洋，再到天空、大气层，终至星空瀚海，人类一直在不断努力扩展自身的生存空间。人类活动范围的每一次扩展，都增强了人类认知和改造自然的能力促进了生产力和社会的发展。
            </p>
            <div class="time font-14 color-text-4">时间：7.28 15:40-17:40</div>
          </div>
        </div>
        <div class="img" style="background-image: url('https://og9s6vxbs.qnssl.com/futrue/tansuo.jpg')"></div>
      </div>
      <div class="guest-content">
        <div class="panel">
          <img :src="guestsActiveMap.spaceList.picture"/>
          <div class="text color-4">
            <h4>{{guestsActiveMap.spaceList.name}}</h4>
            <p class="font-14">{{guestsActiveMap.spaceList.desc[0]}}</p>
          </div>
        </div>
        <div class="control">
          <div class="guest-item" v-for="(item,index) in spaceList"
               :class="{'active':guestsIndexMap.spaceList===index}"
               @click="activeGuest('spaceList',index)">
            <img :src="item.Thumbnail"/>
          </div>
        </div>
      </div>

      <div id="intelligent" class="title-content">
        <div class="dots">
          <div class="text">
            <h3>未来智能：智能与人工的边界是什么</h3>
            <p class="font-14">
              伴随着大数据、AI人工智能的应用化研究，此刻我们正踏入万物互联的“未来智能”红海。而当信息化的“数字空间”与现实世界的“物理空间”相连接“未来”的轮廓也将愈发明晰。
            </p>
            <div class="time font-14 color-text-1">时间：7.28 9:00-11:10</div>
          </div>
        </div>
        <div class="img" style="background-image: url('https://og9s6vxbs.qnssl.com/futrue/zhineng.jpg')">
        </div>
      </div>
      <div class="guest-content">
        <div class="panel">
          <img :src="guestsActiveMap.intelligentList.picture"/>
          <div class="text color-1">
            <h4>{{guestsActiveMap.intelligentList.name}}</h4>
            <p class="font-14">{{guestsActiveMap.intelligentList.desc[0]}}</p>
          </div>
        </div>
        <div class="control">
          <div class="guest-item" v-for="(item,index) in intelligentList"
               :class="{'active':guestsIndexMap.intelligentList===index}"
               @click="activeGuest('intelligentList',index)">
            <img :src="item.Thumbnail"/>
          </div>
        </div>
      </div>

      <div id="live" class="title-content">
        <div class="dots">
          <div class="text">
            <h3>未来生命：人造生物将会对医疗产生什么颠覆性影响</h3>
            <p class="font-14">
              世纪是生物科学的世纪。大脑思维机理、癌症防治、基因测序
              就像其他基础学科一样，生命科学的成果是用于指导人类的生产活动 探索神秘的自然界和人类本身的过程就是最本质的、最大的乐趣和回报
            </p>
            <div class="time font-14 color-text-2">时间：7.28 11:20-13:20 </div>
          </div>
        </div>
        <div class="img" style="background-image: url('https://og9s6vxbs.qnssl.com/futrue/shengming.jpg')"></div>
      </div>
      <div class="guest-content">
        <div class="panel">
          <img :src="guestsActiveMap.lifeList.picture"/>
          <div class="text color-2">
            <h4>{{guestsActiveMap.lifeList.name}}</h4>
            <p class="font-14">{{guestsActiveMap.lifeList.desc[0]}}</p>
          </div>
        </div>
        <div class="control">
          <div class="guest-item" v-for="(item,index) in lifeList"
               :class="{'active':guestsIndexMap.lifeList===index}"
               @click="activeGuest('lifeList',index)">
            <img :src="item.Thumbnail"/>
          </div>
        </div>
      </div>

      <div id="space" class="title-content">
        <div class="dots">
          <div class="text">
            <h3>未来空间：如何通过未来设计打造一个未来天堂</h3>
            <p class="font-14">
              “在地球上创造一个天堂是设计师的任务。”我们的世界正在以光速迭代，新的设计层出不穷，我们不停创造的同时，也被设计的力量裹挟。或许，是时候了，我们应该坐下来谈一谈什么是设计？我们在为谁而设计？我们又在设计什么？
            </p>
            <div class="time font-14 color-text-6">时间：7.29 9:00-11:10</div>
          </div>
        </div>
        <div class="img" style="background-image: url('https://og9s6vxbs.qnssl.com/futrue/kongjian.jpg')"></div>
      </div>
      <div class="guest-content">
        <div class="panel">
          <img :src="guestsActiveMap.recreationList.picture"/>
          <div class="text color-6">
            <h4>{{guestsActiveMap.recreationList.name}}</h4>
            <p class="font-14">{{guestsActiveMap.recreationList.desc[0]}}</p>
          </div>
        </div>
        <div class="control">
          <div class="guest-item" v-for="(item,index) in recreationList"
               :class="{'active':guestsIndexMap.recreationList===index}"
               @click="activeGuest('recreationList',index)">
            <img :src="item.Thumbnail"/>
          </div>
        </div>
      </div>

      <div id="business" class="title-content">
        <div class="dots">
          <div class="text">
            <h3>
              未来商业：新零售及区块链会对传统商业带来何种冲击是的
            </h3>
            <p class="font-14">
              便利店是最合理的线下店模式吗？大型超市还会继续存在下去吗？区块链可能会完全颠覆现有的商业结构；人工智能让金融变得更加智能与普惠；商业世界正在迎接有史以来的最大进化。
            </p>
            <div class="time font-14 color-text-7">时间：7.29 13:30-15:30</div>
          </div>
        </div>
        <div class="img" style="background-image: url('https://og9s6vxbs.qnssl.com/futrue/shangye.jpg')"></div>
      </div>
      <div class="guest-content">
        <div class="panel">
          <img :src="guestsActiveMap.saleList.picture"/>
          <div class="text color-7">
            <h4>{{guestsActiveMap.saleList.name}}</h4>
            <p class="font-14">{{guestsActiveMap.saleList.desc[0]}}</p>
          </div>
        </div>
        <div class="control">
          <div class="guest-item" v-for="(item,index) in saleList"
               :class="{'active':guestsIndexMap.saleList===index}"
               @click="activeGuest('saleList',index)">
            <img :src="item.Thumbnail"/>
          </div>
        </div>
      </div>

      <div id="me" class="title-content">
        <div class="dots">
          <div class="text">
            <h3>未来的我：信息爆炸时代如何寻找自由公平的个人价值</h3>
            <p class="font-14">
              人类从未经历过如此急速变迁和信息爆炸的时代，人的心灵境况面临巨大挑战，我们呼唤自由、公平、团结，我们却受困于孤独、茫然、困惑。社会需要被重新理解和读取，人类需要找到新的存在价值与意义。
            </p>
            <div class="time font-14 color-text-8">时间：7.29 15:40-17:40</div>
          </div>
        </div>
        <div class="img" style="background-image: url('https://og9s6vxbs.qnssl.com/futrue/wo.jpg')"></div>
      </div>
      <div class="guest-content">
        <div class="panel">
          <img :src="guestsActiveMap.humanList.picture"/>
          <div class="text color-8">
            <h4>{{guestsActiveMap.humanList.name}}</h4>
            <p class="font-14">{{guestsActiveMap.humanList.desc[0]}}</p>
          </div>
        </div>
        <div class="control">
          <div class="guest-item" v-for="(item,index) in humanList"
               :class="{'active':guestsIndexMap.humanList===index}"
               @click="activeGuest('humanList',index)">
            <img :src="item.Thumbnail"/>
          </div>
        </div>
      </div>

      <div class="other-space">
        <h2>
          <img class="img" src="https://og9s6vxbs.qnssl.com/futrue/icon-1.png"/>
          <span>外部空间</span>
        </h2>
        <h3>
          你！为什么一定要来参加？
        </h3>
        <p class="font-14">
          未来大会聚焦于科学，科技、商业领域的前沿话题，追寻其中的前行者。构建一个让观念见解、实践经验乃至奇思妙想可以自由而快速传播的平台，从而让最前沿思想者的声音被更多人听到，让最有创造力的思想得到最广泛的传播。
          <br/>
          <br/>
          你除了可以把握到最新的技术、最前沿的科学、最符合时代脉搏的趋势和最具爆炸增长的可能，更重要的是，
          <span>亲眼见到漫威动画的手稿</span>！
          漫威迷们！你们的福利来了！你们将看到资深漫画师Billy为Marvel漫画公司创作的许多作品的原手稿，如《蜘蛛侠》、《X战警》、《新复仇者联盟》、《雷神托尔》等！更有机会预先浏览新作《他她英雄》的部分手稿哦！
          <img src="https://og9s6vxbs.qnssl.com/futrue/other-space-1.jpg"/>
          家长们带领您的孩子观看机器人大战！了解如何给机器人编程？提高孩子的智力，打开“想象力和创造力”世界的大门！
          <img src="https://og9s6vxbs.qnssl.com/futrue/other-space-2.jpg"/>
          亲身体验“百度”用纯熟的AI技术打造的“小度智能音箱”。
          <img src="https://og9s6vxbs.qnssl.com/futrue/other-space-3.jpg"/>
        </p>
      </div>

      <!--<div id="map" class="map">
        <h2>
          <img class="img" src="https://og9s6vxbs.qnssl.com/futrue/icon-2.png"/>
          <span>大会地址</span>
        </h2>
        <div class="map-content">
          <img src="https://og9s6vxbs.qnssl.com/futrue/map.jpg"/>
        </div>
      </div>-->
    </section>
    <div class="menu font-14" v-if="showMenu">
      <div class="menu-list">
        <div class="close" @click="closeMenuSide">
          <i class="bi bi-close"></i>
        </div>
        <ul class="menu-ul">
          <li @click="jumpTo('intelligent')">
            <div class="icon">
              <img src="https://og9s6vxbs.qnssl.com/futrue/icon-3.png"/>
            </div>
            <div class="text">
              <h4>未来智能</h4>
              <div class="font-14">INTELLIGENCE</div>
            </div>
          </li>
          <li @click="jumpTo('live')">
            <div class="icon">
              <img src="https://og9s6vxbs.qnssl.com/futrue/icon-4.png"/>
            </div>
            <div class="text">
              <h4>未来生命</h4>
              <div class="font-14">LIFE</div>
            </div>
          </li>
          <li @click="jumpTo('city')">
            <div class="icon">
              <img src="https://og9s6vxbs.qnssl.com/futrue/icon-5.png"/>
            </div>
            <div class="text">
              <h4>未来城市</h4>
              <div class="font-14">CITY</div>
            </div>
          </li>
          <li @click="jumpTo('explore')">
            <div class="icon">
              <img src="https://og9s6vxbs.qnssl.com/futrue/icon-6.png"/>
            </div>
            <div class="text">
              <h4>未来探索</h4>
              <div class="font-14">EXTREME</div>
            </div>
          </li>
          <li @click="jumpTo('recreation')">
            <div class="icon">
              <img src="https://og9s6vxbs.qnssl.com/futrue/icon-7.png"/>
            </div>
            <div class="text">
              <h4>未来娱乐</h4>
              <div class="font-14">ESCAPE</div>
            </div>
          </li>
          <li @click="jumpTo('space')">
            <div class="icon">
              <img src="https://og9s6vxbs.qnssl.com/futrue/icon-8.png"/>
            </div>
            <div class="text">
              <h4>未来空间</h4>
              <div class="font-14">LIMITED UNLIMITED</div>
            </div>
          </li>
          <li @click="jumpTo('business')">
            <div class="icon">
              <img src="https://og9s6vxbs.qnssl.com/futrue/icon-9.png"/>
            </div>
            <div class="text">
              <h4>未来商业</h4>
              <div class="font-14">REVALUE</div>
            </div>
          </li>
          <li @click="jumpTo('me')">
            <div class="icon">
              <img src="https://og9s6vxbs.qnssl.com/futrue/icon-10.png"/>
            </div>
            <div class="text">
              <h4>未来的我</h4>
              <div class="font-14">I HUMAN</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer-btn">
    </div>
    <div class="btn-cover" @click="goToTicket()">
    </div>
  </article>
</template>

<style lang="scss" scoped>

  .container {
    overflow: hidden;
    background-color: #000;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    .font-14 {
      font-size: 0.875rem;
    }

    .menu {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 1);
      z-index: 3;

      .menu-list {
        background-color: rgb(0, 0, 0);
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        border-left: solid 1px rgb(26, 26, 26);
        height: 100vh;
        display: flex;
        flex-direction: column;

        .close {
          text-align: right;
          padding: 13px 20px 13px 0;
          color: #fff;
        }

        .menu-ul {
          padding: 0 40px 0 13vw;
        }

        li {
          text-align: center;
          color: #fff;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          margin-bottom: 4.7vh;

          .icon {
            width: 2rem;
            font-size: 0;
            margin-right: 13px;

            img {
              width: 100%;
            }
          }

          .text {
            text-align: left;

            h4 {
              font-size: 1.25rem;
              line-height: 1;
              letter-spacing: 2px;
              margin-bottom: 4px;
            }

            div {
              line-height: 1;
              letter-spacing: 2px;
              font-weight: 600;
              padding-left: 1px;
            }
          }
        }

      }
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3;
      width: 100%;
      padding: 0 20px;
      color: #fff;
      background-color: transparent;
      transition: background-color .3s;

      &.bg-black {
        background-color: rgba(0, 0, 0, .5);
      }

      .head-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 960px;
        margin: auto;
        min-height: 62px;
      }

      .img {
        font-size: 0;

        img {
          height: 2rem;
        }
      }

      .font-set {
      }

      button {
        color: #fff;
      }

    }

    @keyframes circle-opacity {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.2);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .footer-btn {
      position: fixed;
      bottom: 20px;
      right: 14px;
      height: 4.12rem;
      width: 4.12rem;
      background-color: #00ac9c;
      border-radius: 17.6vw;
      box-shadow: 4px 4px 8px 0px #000;
      animation: circle-opacity 2s infinite;
      animation-delay: .6s;
    }

    .btn-cover {
      position: fixed;
      height: 3.5rem;
      width: 3.5rem;
      bottom: calc(20px + 0.31rem);
      right: calc(14px + 0.31rem);
      background-color: rgb(0, 211, 193);
      justify-content: center;
      align-items: center;
      z-index: 2;
      padding: 10px;
      border-radius: 56px;
      background: url("https://og9s6vxbs.qnssl.com/futrue/btn.png") no-repeat;
      background-size: 100% 100%;
    }

    .content {
      width: 100%;
      color: #fff;

      > div {
        background-color: #000;
      }

      .title-content {
        position: relative;
        padding: 31% 0 0 35%;

        .dots {
          padding: 15px 26px 0 14px;
          background: #000;
          background-image: linear-gradient(#000 4.5px, transparent 0), linear-gradient(90deg, #383838 1.5px, transparent 0);
          background-size: 6px 6px, 6px 6px;
          color: #fff;

          h3 {
            font-size: 1.5rem;
            line-height: 1.25;
            position: relative;
            z-index: 2;
          }

          p {
            margin-top: 8px;
            position: relative;
            z-index: 2;
            line-height: 1.72;
            letter-spacing: -0.1px;
            color: rgb(242, 242, 242);
          }

          .time {
            display: inline-block;
            margin: 12px 0;
            line-height: 1.14vw;
          }
        }
        .img {
          position: absolute;
          width: calc(100% - 40px);
          font-size: 0;
          left: 20px;
          top: 0;
          height: calc(56.25vw - 23px);
          max-height: 427px;
          border-top-right-radius: 80px;
          background-size: 100%;
          background-repeat: no-repeat;
        }
      }

      .color-1 {
        background-color: rgba(185, 77, 42, .9);
      }

      .color-2 {
        background-color: rgba(83, 178, 184, .9);
      }

      .color-3 {
        background-color: rgba(183, 94, 40, .9);
      }

      .color-4 {
        background-color: rgba(219, 119, 55, .9);
      }

      .color-5 {
        background-color: rgba(242, 186, 65, .9);
      }

      .color-6 {
        background-color: rgba(64, 197, 214, .9);
      }

      .color-7 {
        background-color: rgba(95, 237, 216, .9);
      }

      .color-8 {
        background-color: rgba(101, 198, 190, .9);
      }

      .color-text-1 {
        color: rgba(185, 77, 42, 1);
      }

      .color-text-2 {
        color: rgba(83, 178, 184, 1);
      }

      .color-text-3 {
        color: rgba(183, 94, 40, 1);
      }

      .color-text-4 {
        color: #DB7737;
      }

      .color-text-5 {
        color: rgba(242, 186, 65, 1);
      }

      .color-text-6 {
        color: rgba(64, 197, 214, 1);
      }

      .color-text-7 {
        color: rgba(95, 237, 216, 1);
      }

      .color-text-8 {
        color: rgba(101, 198, 190, 1);
      }

      .img-cover {
        font-size: 0;
        height: 0;
        padding-top: 178%;
        position: relative;

        img {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      .desc {
        line-height: 1.85;
        text-align: center;
        color: #e5e5e5;
        padding: 28px 20px 56px 20px;
      }

      .guest-content {
        margin-bottom: 72px;

        .panel {
          position: relative;
          font-size: 0;
          margin: auto;
          height: 0;
          padding-top: 75.5%;
          width: calc(100% - 40px);
          background-color: #000;

          > img {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
          }

          .text {
            position: absolute;
            min-height: 9.375rem;
            width: 9.375rem;
            bottom: 0;
            left: 0;
            border-top-right-radius: 40px;
            border-bottom-left-radius: 40px;
            padding: 12px 8px 25px 8px;

            h4 {
              //font-size: 4.8vw;
              font-size: 1.125rem;
              line-height: 1;
            }

            p {
              margin-top: 6px;
              line-height: 1.28;
              word-break: break-word;
            }
          }
        }

        .control {
          width: calc(100% - 40px);
          margin: 40px auto 64px auto;
          overflow-x: scroll;
          white-space: nowrap;
          font-size: 0;

          .guest-item {
            position: relative;
            display: inline-block;
            height: 75px;
            width: 67px;
            background-color: #1A1A1A;

            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }

            &::after {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              height: 75px;
              width: 67px;
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

      .other-space {
        padding: 0 20px;
        margin-top: 99px;

        h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          line-height: 1;

          .img {
            //rem
            /*width: 6.66vw;
            height: 7.73vw;*/
            width: 1.56rem;
            height: 1.81rem;
            margin-right: 6px;
          }
        }

        h3 {
          margin-top: 36px;
          font-size: 1.25rem;
        }

        p {
          margin-top: 12px;
          line-height: 1.71;

          span {
            color: rgb(1, 235, 216);
            font-weight: bold;
          }

          img {
            width: 100%;
            margin: 16px 0;
          }
        }
      }

      .map {
        padding-top: 50px;

        h2 {
          line-height: 1;
          font-size: 1.25rem;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          .img {
            //rem
            /*width: 10.13vw;
            height: 8vw;*/
            height: 1.875rem;
            width: 2.375rem;
          }

          span {
            padding-left: 8px;
          }

        }

        .map-content {
          font-size: 0;

          img {
            font-size: 0;
            width: 100%;
          }
        }

      }

    }
  }

</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {UserInfoModel} from '../../../shared/api/user.model'
  import {isInApp, isInWechat, isAndroid} from "../../../shared/utils/utils";
  import {host} from "../../../env/environment";
  import {
    intelligentList,
    lifeList,
    cityList,
    spaceList,
    designList,
    recreationList,
    saleList,
    humanList
  } from './data';
  import {setShareInfo} from '../../../shared/utils/share';
  import {initWechat} from '../../../shared/utils/wechat';

  @Component({})
  export default class ActivateComponent extends Vue {
    userInfo: UserInfoModel;
    isInApp = isInApp;
    guestDom: HTMLElement;
    showMenu = false;
    defaultImg = '/assets/img/default-cover.jpg';
    lang = 'zh';
    coverUrl = 'https://og9s6vxbs.qnssl.com/wiee/video-cover.jpg';
    changeNav = false;
    scrollTop = 0;
    guestsIndexMap: { [key: string]: number } = {
      'intelligentList': 0,
      'lifeList': 0,
      'cityList': 0,
      'spaceList': 0,
      'designList': 0,
      'recreationList': 0,
      'saleList': 0,
      'humanList': 0
    };
    guestsActiveMap: { [key: string]: any } = {
      'intelligentList': intelligentList[0],
      'lifeList': lifeList[0],
      'cityList': cityList[0],
      'spaceList': spaceList[0],
      'designList': designList[0],
      'recreationList': recreationList[0],
      'saleList': saleList[0],
      'humanList': humanList[0]
    };
    intelligentList = intelligentList;
    lifeList = lifeList;
    cityList = cityList;
    spaceList = spaceList;
    designList = designList;
    recreationList = recreationList;
    saleList = saleList;
    humanList = humanList;
    imgList: any = {};


    @Watch('$route')
    setNavIndex() {
      this.share();
    }

    created() {
      this.init();
      this.$nextTick(() => {
        this.guestDom = this.$refs['container'] as HTMLElement;
      })
    }

    mounted() {
      setTimeout(() => {
        this.preLoadImg(intelligentList[1].picture);
        this.preLoadImg(lifeList[1].picture);
        this.preLoadImg(cityList[1].picture);
        this.preLoadImg(spaceList[1].picture);
        this.preLoadImg(recreationList[1].picture);
        this.preLoadImg(designList[1].picture);
        this.preLoadImg(humanList[1].picture);
      }, 10);
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        setShareInfo(
          '2018张江·造就未来大会',
          `为你打开通向未知和未来的大门`,
          'https://og9s6vxbs.qnssl.com/zaojiu-logo.jpg',
          `${host.self}/wv/future`
        );
      }
    }

    async init() {
      this.share();
      this.lang = this.$route.query['lang'];
      if (this.lang === 'en') {
        this.$i18n.locale = 'en';
      } else {
        this.$i18n.locale = 'zh';
      }

    }

    showMenuSide() {
      let guestDom = (this.guestDom as HTMLElement);
      let rect = guestDom.getBoundingClientRect();
      this.scrollTop = rect.top;
      this.showMenu = true;
      document.body.style.position = 'fixed';
    }

    closeMenuSide() {
      this.showMenu = false;
      document.body.style.position = '';
      document.body.scrollTop = Math.abs(this.scrollTop);
      document.documentElement.scrollTop = Math.abs(this.scrollTop);
    }

    jumpTo(tab: string) {
      this.closeMenuSide();
      this.changeNav = true;
      location.href = `/wv/future#${tab}`;
    }

    touchStart(e: TouchEvent) {

    }

    touchMove() {
      let guestDom = (this.guestDom as HTMLElement);
      let rect = guestDom.getBoundingClientRect();
      let top = rect.top;

      if (top === 0) {
        this.changeNav = false;
      } else {
        this.changeNav = true;
      }
    }

    activeGuest(category: string, index: number) {
      this.guestsIndexMap[category] = index;
      switch (category) {
        case 'intelligentList':
          this.guestsActiveMap[category] = intelligentList[index];
          if (index < this.intelligentList.length - 1) {
            this.preLoadImg(intelligentList[index + 1].picture);
          }
          break;
        case 'lifeList':
          this.guestsActiveMap[category] = lifeList[index];
          if (index < this.lifeList.length - 1) {
            this.preLoadImg(lifeList[index + 1].picture);
          }
          break;
        case 'cityList':
          this.guestsActiveMap[category] = cityList[index];
          if (index < this.cityList.length - 1) {
            this.preLoadImg(cityList[index + 1].picture);
          }
          break;
        case 'spaceList':
          this.guestsActiveMap[category] = spaceList[index];
          if (index < this.spaceList.length - 1) {
            this.preLoadImg(spaceList[index + 1].picture);
          }
          break;
        case 'designList':
          this.guestsActiveMap[category] = designList[index];
          if (index < this.designList.length - 1) {
            this.preLoadImg(designList[index + 1].picture);
          }
          break;
        case 'recreationList':
          this.guestsActiveMap[category] = recreationList[index];
          if (index < this.recreationList.length - 1) {
            this.preLoadImg(recreationList[index + 1].picture);
          }
          break;
        case 'saleList':
          this.guestsActiveMap[category] = saleList[index];
          if (index < this.saleList.length - 1) {
            this.preLoadImg(saleList[index + 1].picture);
          }
          break;
        case 'humanList':
          this.guestsActiveMap[category] = humanList[index];
          if (index < this.humanList.length - 1) {
            this.preLoadImg(humanList[index + 1].picture);
          }
          break;
      }
    }

    goToTicket() {
      this.$router.push({path: '/events/5b28d3aa42a2dc0001cc532c/tickets'});
    }

    preLoadImg(url: string) {
      let img = new Image();
      img.src = url;
      if (!this.imgList[url]) {
        this.imgList[url] = img;
      }
    }

  }
</script>

