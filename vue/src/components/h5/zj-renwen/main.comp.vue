<template>
  <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
  <error class="abs-center" v-else-if="isNotFound">网络错误</error>
  <div class="container"
       v-else
       ref="container"
  >
    <nav class="nav">
      <div style="width: 21%;height: 117px"
           @click="changeNav(0)">
        <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/nav-1.jpg"/>
      </div>
      <div style="width: 11%;height: 59px;"
           @click="changeNav(1)"
           :class="{'active':navIndex===1}">
        <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/nav-2.png"/>
      </div>
      <div style="width: 11%;height: 59px"
           @click="changeNav(2)"
           :class="{'active':navIndex===2}">
        <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/nav-3.png"/>
      </div>
      <div
        style="width: 11%;height: 59px"
        @click="changeNav(3)"
        :class="{'active':navIndex===3}">
        <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/nav-4.png"/>
      </div>
      <div
        style="width: 11%;height: 59px"
        @click="changeNav(4)"
        :class="{'active':navIndex===4}">
        <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/nav-5.png"/>
      </div>
    </nav>
    <section class="content">
      <transition :name="translation" v-if="navIndex===0">
        <div class="child-view" key="1">
          <div class="index">
            <div class="image-1-1">
              <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/1-c.jpg"/>
            </div>
            <p>
              「造就」是一家致力于「发现最有创造力思想」的剧院式演讲平台，创立于 2015 年底，已经成为中国首屈一指的文化创新品牌。造就的听众是来自于各个行业的精英群体，他们对于知识的传播和分享有着热切的渴望。
              <br/>
              <br/>
              「造就人文」是造就团队与 SMG LIVE 战略合作，整合资源，在 2018 年全新推出的艺术人文线内容产品。
            </p>
            <div class="bold-block">
              区别于造就主场以科技、科学等硬知识为主的演讲活动，「造就人文」想要通过不同领域领军者对于同一个主题的不同的认知、思考和发散，呈现这个世界的多样性、多元丰富，更富人文关怀。
            </div>
            <p>
              造就目前已经邀请超过 350
              位嘉宾登上演讲舞台，分享他们作为行业领军者所观察到的未来趋势。作为中国首家剧院场景体验的演讲平台，造就致力于发现世界上最有创造力的思想，寻找最有创见性的思想和实践，相信世界是多维度的生长，追寻在科技、经济、文化等多重领域的前行者。
              <br/>
              <br/>
              造就人文会从「视觉」、「听觉」、「味觉」等人类最基础的感知出发，去探索艺术与文化的内涵与边界。
            </p>
            <div class="btn-group">
              <div class="btn-img" @click="changeNav(1)">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/link-1.png"/>
              </div>
              <div class="btn-img" @click="changeNav(2)">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/link-2.png"/>
              </div>
              <div class="btn-img" @click="changeNav(3)">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/link-3.png"/>
              </div>
              <div class="btn-img" @click="changeNav(4)">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/link-4.png"/>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition :name="translation" v-if="navIndex===1">
        <div class="child-view" key="2">
          <div class="b-s">
            <div class="image-1-1">
              <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/2-c.jpg"/>
            </div>
            <p>
              最简单的、最普通的词语「声」出发，去探索声音的形状，去感受声音的力量，去体验声音的魅力，去探寻声音的价值……通过不同艺术、科技领域的领军者对于声音这一主题的不同认知和阐释，展现世界的多元、多维、辨证和美好。</p>
            <div class="guest-group">
              <h3 style="height: 31px">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/voice-1.png"/>
              </h3>
              <div class="img-group">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/zzq.jpg" align="left" width="140px" height="166px"/>
                <b>朱哲琴 · 跨界音乐家、看见造物创始人兼艺术总监</b>
                <p>
                  二十多年来朱哲琴从音乐出发，开始其漫长的艺术探索之旅，近年其工作与创作已经大量介入到声音、视觉、表演，设计、传媒、公众、社群等领域。不再局限于歌唱家这个标签，朱哲琴不再局限于声音的即有维度；经过宇宙、自然与人之间关系的思考，将声音作为材料，用以表现艺术家本人的艺术与精神世界。而作为介质而存在的声音脱离了物理意义，以一种饱含意义，无边无形的自由展现“艺术”。
                </p>
              </div>
            </div>
            <div class="guest-group">
              <h3 style="height: 29px">
                <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/voice-2.png"/>
              </h3>
              <div class="img-group">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/jpd.jpg" align="left" width="104px" height="138px"/>
                <b>金培达 · 香港著名作曲家</b>
                <p>香港著名作曲家。11 次荣获香港电影金像奖最佳原创音乐与最佳原创歌曲，其中包括广为传唱的《星语心愿》和《如果·爱》。音乐对于电影情节的推动和情绪的渲染达到了出神入化之境。2008
                  年香港政府为他颁发了荣誉勋章，肯定其音乐成就及艺术领域的卓越贡献。
                </p>
              </div>
            </div>
            <div class="guest-group">
              <h3 style="height: 27px">
                <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/voice-3.png"/>
              </h3>
              <div class="img-group">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/hy.jpg" align="left" width="97px" height="138px"/>
                <b>黄英 · 女高音艺术家</b>
                <p>
                  国际音乐权威人士称黄英的演唱极富内涵，音色柔和甜美，花腔技巧灵活，演唱充满激情，堪称中国音乐界最杰出歌唱家之一。《纽约时报》说：黄英柔和优美的音色是最适合演唱莫扎特音乐风格的歌唱家。
                </p>
              </div>
            </div>
            <div class="guest-group">
              <h3 style="height: 36px">
                <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/voice-4.png"/>
              </h3>
              <div class="img-group">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/shb.jpg" align="left" width="106px" height="76px"/>
                <b>时海波 · 上海市第六人民医院耳鼻咽喉科行政副主任、 副主任医师、硕导</b>
                <p>从事耳鼻咽喉头颈外科医疗工作 20 余年，2006 年获日本九州大学博士学位，2010 年赴美国 House 耳科研究所、2014 年赴德国德累斯顿工业大学附属医院临床进修。2013
                  年首批入选上海市卫计委新一轮“百人计划”，2015 年首批入选上海市教委“高峰高原学科建设项目”，2017 年入选上海市领军人才。
                </p>
              </div>
              <div class="desc">
                <p>
                  <b>活动时间：</b>2018年06月24日 19:00
                </p>
                <p>
                  <b>活动地点：</b>兰心大戏院
                </p>
                <p>
                  <b>详细地址：</b>上海市黄浦区茂名南路57号，近长乐路
                </p>
              </div>
            </div>
            <div class="button" @click="goToTicket">
              立即购票
            </div>
          </div>
        </div>
      </transition>
      <transition :name="translation" v-if="navIndex===2">
        <div class="child-view" key="3">
          <div class="w-t">
            <div class="image-1-1">
              <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/3-c.jpg"/>
            </div>
            <p>造就之舞·感知与经历的旋涡
              ——台下十年功，台上十分钟，每一位在舞台上的艺术家，都融入了他从小的梦想，入行后的坚忍以及毕生对舞台的信仰。舞台从来没有变过，当时在它上面上演的内容却不断在变，从古老的到现代的，从东方的到西方的，穿插、交织、更替…从没有一刻间断过在发生变化。今天，舞台的表现形式也发生了巨大的变化，AR、VR，多空间叙事……一切有高科技产生的能量加持这舞台的力量，让我们一起来看看这新的力量下的舞台会给我们什么不可思议的感官刺激？</p>
            <div class="guest-group">
              <h3 style="height: 26px">
                <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/title-tc.png"/>
              </h3>
              <div class="img-group">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/csq.jpg" align="left" width="120px" height="156px"/>
                <b>陈少琪 · 著名填词人，制作人，监制</b>
                <p>
                  香港著名音乐人及多方位创作人，涉足音乐、影视、广告、视频节目、艺术等领域。活跃乐坛三十余年，其个人音乐作品超过三千首，代表作《石头记》、《风继续吹》、《夕阳之歌》、《画心》等。亦曾出版小说、散文，撰写电影及舞台剧剧本，举办过多次摄影绘画作品展。横跨30多年的旺盛创造力，跨界艺术如何捕捉灵感？在造就人文的舞台上，他将讲述自己的艺术跨界心路，更有众多巨星合作故事曝光。
                </p>
              </div>
              <div class="b-desc">
                “艺术是生活的升华。如果你看到平凡而无特点的东西，能否从中看到不一样的地方？”
              </div>
              <div class="video" @click="goToTalk('5b0fa585b2c4470001e7e331')">
                <img class="cover" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/csq-c.jpg"/>
                <img class="play" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/play.png"/>
              </div>
              <p class="video-text">
                陈少琪演讲：当风再起时，我希望出现在你们歌单里的，不只有我的粤语老歌
              </p>
            </div>
            <div class="guest-group">
              <h3 style="height: 29px">
                <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/title-dt.png"/>
              </h3>
              <div class="img-group">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/gsf.jpg" align="left" width="120px" height="156px"/>
                <b>高山峰 · 动感101及欧美流行音乐电台KFM981频率总监&主持人</b>
                <p>
                  主持广播节目多年，曾担任《彩铃真精彩》、《九点人来疯》、《只爱一点》、《101人来疯》等节目的独立主持工作。其中《九点人来疯》获得“第四届广播娱乐节目评析研讨”全国一等奖。同时曾担任《为何逗》、《光阴的歌》等电视节目的主持人。
                </p>
              </div>
              <div class="b-desc">
                “广播的魅力在于，你永远都不知道下一首播放的是什么样的歌曲”
              </div>
              <div class="video" @click="goToTalk('5b208588b2c4470001e7e4ee')">
                <img class="cover" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/gsf-c.jpg"/>
                <img class="play" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/play.png"/>
              </div>
              <p class="video-text">
                高山峰演讲：从打杂小朋友，到东方风云榜总导演，小人物也能实现大大的梦想
              </p>
            </div>
            <div class="guest-group">
              <h3 style="height: 40px">
                <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/title-wd.png"/>
              </h3>
              <div class="img-group">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/ty.jpg" align="left" width="131px" height="156px"/>
                <b>陶冶 · 陶身体剧场艺术总监、编舞</b>
                <p>
                  陶冶出生于重庆，曾在上海金星舞蹈团和北京现代舞团担任舞者。23岁创立陶身体剧场，以个
                  人舞蹈风格开发建立了圆运动训练体系。27岁受邀在世界顶级艺术节美国纽约林肯艺术中心演出。2012年被权威机构英国Sadler’s Wells评选为New Wave
                  Assciates世界六位编舞家其中之一。曾应邀跨界电影、戏剧、服装设计、影像等艺术形式。
                  <br/>
                  <br/>
                  你真的了解你的身体吗？从生到死，身体才是我们理解万事万物的载体。在重力的枷锁下，我们的身体如何突破极限，抵达生命中最单纯的圆满？这一次，陶冶为我们讲述那份舞台上流逝的永恒。
                </p>
              </div>
              <div class="b-desc">
                “瞬间即永恒，舞蹈就是这么一个遗憾的艺术，每一个瞬间都会逝去，我一直告诫舞者不要迷恋在舞台上那一刻的表达，当大幕落下，你又变成一个孤独的个体。”
              </div>
              <div class="video" @click="goToTalk('5b0fa3f042a2dc0001cc51c4')">
                <img class="cover" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/ty-c.jpg"/>
                <img class="play" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/play.png"/>
              </div>
              <p class="video-text">
                陶冶演讲：我用舞蹈对抗人生最终极的一种恐惧
              </p>
            </div>
            <div class="guest-group">
              <h3 style="height: 43px">
                <img class="img" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/title-kq.png"/>
              </h3>
              <div class="img-group">
                <img src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/zj.jpg" align="left" width="112px" height="125px"/>
                <b>张军 · 昆曲艺术家、联合国教科文组织和平艺术家、 国家一级演员</b>
                <p>
                  实验昆曲，如何演绎人类亘古不变的情感神话？昆曲长生不老，至今
                  仍能直抵人心的秘诀是什么？对爱不同层次，不同阶段的理解，如何影响了张军对昆曲的理解和演绎？
                  <br/>
                  <br/>
                  台上人浅唱低吟的正是台下一对对眷侣并肩缱绻的那一刻，从古至今，人们内心深处对幽微曲折情感的诉求都未改变。若你还没未爱上昆曲，一定是还不够了解它。
                </p>
              </div>
              <div class="b-desc">
                “所有伟大的艺术都在给我们一次机会，久别重逢。”
              </div>
              <div class="video" @click="goToTalk('5af26baf5c638100014c82e8')">
                <img class="cover" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/zj-c.jpg"/>
                <img class="play" src="https://og9s6vxbs.qnssl.com/zaojiu_renwen/play.png"/>
              </div>
              <p class="video-text">
                张军演讲：我们从厅堂唱到万人会场，只为证明自己要活着！
              </p>
            </div>
            <p class="text">
              从文字、声音、视觉到舞台综合艺术，四位不同领域的艺术家们跨领域共同呈现了造就人文首场精彩talk。人文艺术本身所具有的强烈共情能力让现场观众无不入戏三分，回味无穷。造就人文的创办宗旨，也正是在无数喧嚣技术向我们承诺美好未来的当下，让我们保持清醒，思考生活的核心内涵——人文价值。
            </p>
          </div>
        </div>
      </transition>
      <transition :name="translation" v-if="navIndex===3">
        <div class="child-view" key="4">
          <div class="z-g">敬请期待</div>
        </div>
      </transition>
      <transition :name="translation" v-if="navIndex===4">
        <div class="child-view" key="5">
          <div class="z-g">敬请期待</div>
        </div>
      </transition>

    </section>
  </div>
</template>

<style lang="scss" scoped>
  @font-face {
    font-family: zjrw_songti;
    src: url("https://og9s6vxbs.qnssl.com/zaojiu_renwen/SourceHanSerifCN-Regular.ttf")
  }

  .container {
    font-family: zjrw_songti;
    height: 100vh;
    background-color: #fff;
    color: #000;
    $nav-height: 130px;
    $font-p: 16px;
    $lineHeight: 29px;
    $font-title: 20px;
    $lineHeght-t: 28px;
    $font-l: 22px;
    $lineHeght-l: 37px;

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      color: rgb(166, 166, 166);
      height: $nav-height;
      font-size: $font-p;
      line-height: 16px;
      padding: 12px 20px 0 20px;

      > div {
        max-height: $nav-height;
        text-align: center;

        & + div {
          margin-top: 6px;
        }

        > img {
          height: 100%;
        }
      }

      .active {
        color: rgb(0, 0, 0);
        font-weight: bold;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          margin: 0;
          height: 6px;
          width: 6px;
          border-radius: 3px;
          background-color: rgb(0, 0, 0);
          bottom: -8px;
          left: calc(50% - 3px);
          display: block;
        }
      }
    }

    .content {
      background-color: #fff;
      //height: calc(100vh - #{$nav-height});
      position: relative;
      font-size: $font-p;

      p {
        margin-top: 12px;
        font-size: $font-p;
        line-height: $lineHeight;
        text-align: left;
        letter-spacing: 0;
      }

      .image-1-1 {
        background-color: #eee;
        height: 0;
        font-size: 0;
        position: relative;
        padding-top: 100%;

        .img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
      }
    }

    .index {
      padding: 30px 20px 0 20px;
      height: 100%;

      .bold-block {
        font-size: 20px;
        text-align: left;
        line-height: 34px;
        letter-spacing: 0;
        padding: 12px;
        margin: 16px 0;
        background-color: rgb(247, 247, 247);
      }

      .btn-group {
        display: flex;
        flex-wrap: wrap;
        font-size: 0;
        align-items: center;
        justify-content: space-around;
        padding-bottom: 80px;

        .btn-img {
          margin-top: 40px;
          width: 40%;
          min-height: 40px;

          img {
            width: 100%;
          }
        }
      }
    }

    .b-s {
      padding: 30px 20px 0 20px;

      .guest-group {

        h3 {
          height: 24px;
          margin: 60px 0 24px;
          text-align: center;

          img {
            height: 100%;
          }
        }

        .img-group {
          margin-top: 15px;

          img {
            margin: 4px 11px 0 0;
          }

          p {
            margin-top: 6px;
          }

          b {
            font-size: $font-title;
            text-align: left;
            line-height: $lineHeght-t;
          }
        }

        .music {
          margin: 4px -10px 0 -10px;
        }

        .desc {
          margin: 28px 0 92px 0;
          background-color: rgb(247, 247, 247);
          padding: 12px;
          p {
            margin: 0;
            padding: 0;
          }
        }
      }

      .button {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgb(0, 211, 193);
        color: #fff;
        height: 52px;
        font-size: 18px;
        line-height: 52px;
        text-align: center;
        font-weight: bold;
      }
    }

    .w-t {
      padding: 30px 20px 0 20px;

      .guest-group {

        h3 {
          height: 24px;
          margin: 60px 0 24px 0;
          text-align: center;

          img {
            height: 100%;
          }
        }

        .img-group {
          margin-top: 15px;

          img {
            margin: 4px 11px 0 0;
          }

          p {
            margin-top: 1px;
          }

          b {
            font-size: 18px;
            text-align: left;
            line-height: 26px;
          }
        }

        .b-desc {
          margin: 16px 0 20px 0;
          background-color: rgb(247, 247, 247);
          padding: 12px;
          font-size: $font-l;
          line-height: $lineHeght-l;
        }

        .video {
          position: relative;
          font-size: 0;
          padding-top: 56.25%;
          background-color: #eee;

          .cover {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }

          .play {
            height: 48px;
            width: 48px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
          }

        }

        .video-text {
          margin-top: 6px;
          font-size: 13px;
          line-height: 17px;
          color: rgb(128, 128, 128);
          text-align: center;
        }
      }

      .text {
        margin: 36px 0;
      }
    }

    .z-g {
      height: 100%;
      line-height: 70vh;
      text-align: center;
      font-size: 24px;
      letter-spacing: 5px;
    }

    .child-view {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      //height: calc(100vh - #{$nav-height});
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
  import {isInWechat} from '../../../shared/utils/utils';
  import {initWechat} from '../../../shared/utils/wechat';
  import {setShareInfo} from '../../../shared/utils/share';
  import {host} from '../../../env/environment'

  @Component({})
  export default class MainComponent extends Vue {
    navIndex = 0;
    translation = '';
    isLoading = false;
    isNotFound = false;
    defaultImg = '/assets/img/default-cover.jpg';
    originX: number;
    originY: number;
    moveClientX: number;
    moveClientY: number;
    container: HTMLElement;

    created() {
      this.init();
    }

    @Watch('navIndex')
    scrollTop() {
      this.container.scrollTop = 0;
    }

    async init() {
      this.share();
      this.container = document.documentElement || document.body;
    }

    async share() {
      if (isInWechat) {
        await initWechat();
        setShareInfo('造就人文', 'www.zaojiu.com', 'https://og9s6vxbs.qnssl.com/reservation/zaojiu-logo.png', `${host.self}/wv/zaojiu-renwen`);
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

    goToTicket() {
      this.$router.push({path: '/events/59cb0b2d94f498000140bb7f'});
    }

    goToTalk(id: string) {
      location.href = `https://www.zaojiu.com/talks/${id}`
    }
  }
</script>
