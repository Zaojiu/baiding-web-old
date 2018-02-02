<template>
  <div class="container">
    <bd-loading class="abs-center" v-if="isLoading"></bd-loading>
    <error class="abs-center" v-else-if="isError" @retry="initData()"></error>
    <div class="main" v-else>
      <div class="banner">
        <div class="fs28 setting tac" @click="goToAppStore">
          去App Store设置
        </div>
      </div>
      <div class="wrap">
        <p class="slogan fs26 mt20">
          绑定{{desc}},在「造就」里充值消费更简单更方便。
        </p>
        <div class="mt20 fs32">
          绑定{{desc}},如何设置?
        </div>
        <div class="item mt20">
          1.进入App Store，滑动到首页（“精品推荐”页面）底部
        </div>
        <div class="tac mt20">
          <!--<img class="step1" src="./充值流程_files/step1.png">-->

        </div>
        <div class="item mt20">
          2. 选择“绑定{{desc}}”
        </div>
        <div class="tac mt20">
          <!--<img class="step2" src="./充值流程_files/step2.png">-->

        </div>
        <div class="item mt20">
          3. 按要求填写你的Apple ID密码，点击继续
        </div>
        <div class="tac mt20">
          <!--<img class="step3" src="./充值流程_files/yl-step3.png">-->

        </div>
        <div class="item mt20">
          4. 填写你的{{desc}}信息，然后点击“完成”
        </div>
        <div class="tac mt20">
          <!--<img class="step3" src="./充值流程_files/step3.png">-->

        </div>
        <div class="tac mt20">
          <!--<img class="step4" src="./充值流程_files/step4.png">-->

        </div>
        <div class="line mt20">
        </div>
        <div class="title mt20">
          注意事项：
        </div>
        <p class="fs26 mt15" index="1.">
          充值前请确保你的App内购买项目访问限制为“开启”状态（在“设置”－“通用”－“访问限制”中进行设置）；
        </p>
        <p class="fs26 mt15" index="2.">
          请确认你的苹果设备未越狱；
        </p>
        <p class="fs26 mt15" index="3.">
          若绑定不成功，请确认你的{{desc}}信息填写无误，确认后再次进行绑定；
        </p>
        <p class="fs26 mt15" index="4." v-if="type === 0">
          绑定支付宝账号时，会验证你的手机号，请按提示填写信息；
        </p>
        <p class="fs26 mt15" :index="type !== 0?'4.':'5.'">
          海外用户如遇充值问题，可以到“造就”微信公众号向我们反馈你的问题，我们会为你解决。
        </p>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    .wrap {
      padding: 0 6.67vw 6.67vw 6.67vw;
      box-sizing: border-box;
    }
    .tac {
      text-align: center;
    }
    .fs25 {
      font-size: 3.33vw;
    }
    .fs26 {
      font-size: 3.4667vw;
    }
    .fs28 {
      font-size: 3.7333vw;
    }
    .fs32 {
      font-size: 4.3667vw;
    }
    .mt20 {
      margin-top: 30px;
    }
    .mt15 {
      margin-top: 15px;
    }
    .item {
      color: #606060;
      font-size: 3.4667vw;
      line-height: 5vw;
    }
    .line {
      height: 0;
      border-bottom: 1px solid #ddd;
    }
    p {
      color: #606060;
      line-height: 5vw;
      padding-left: 17px;
      position: relative;
      &:before {
        content: attr(index);
        position: absolute;
        left: 0;
      }
    }
    .banner {
      height: 57.33333vw;
      position: relative;
      background: rgb(0, 170, 238) url(https://staticcdn.igetget.com/docker/iget-h5-node/images/guide/zfb.png) center 8vw no-repeat;
      background-size: 50.53333vw auto;

      .fixed {
        position: fixed;
        top: 10px;
      }
    }
    .setting {
      box-shadow: 0 0 0 2px rgba(0, 61, 85, .2);
      border-radius: 4px;
      background: #ffa42f;
      position: absolute;
      bottom: 7.46667vw;
      width: 45.86667vw;
      height: 10.5vw;
      line-height: 10.5vw;
      z-index: 24;
      left: 50%;
      margin-left: -22.9vw;
      color: #fff;
      transition: width .1s linear;
      -webkit-transition: width .1s linear;
      font-weight: 600;
    }
    .slogan {
      color: #00aaee;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABXElEQVQ4ja3Tv0ocURTH8c8uothZCbHRKq5KwMJGUqkgiJ3NPkBeQdBCSOUzmMoHsBBTBtuApYWN/yKuLIIp0i4psqaYMzA7zrozuj+4zJ3fPec7Zw7n1hz9UVKfUcPPMsEjZanYjedQwZ+wmdlfDEqolwTvSNpQi/1AlQHPoJl5b4b3bvC23paNhPeqagOmYhL3GM/5HUnVv/slZiupYxof0cAslgugwvuBM1zhEtdooZuCv2IrQGOvlZ/TYqys/saHjus4wGhFaD+NBetbXdKnNdwMAXwbrKd0Kh6xirt3QO+wEqyecWsHvPUG6EPktlMjP8ctya+0lVdhQUUX5BdOKoC/R06P+t28uQrgRpE5DPB8WfAEpiqAP0TOQHBRBR3sx+oUnC9UBXdxKOnjXqxGeN1M3IvWFYHToFMs4YtkTlM9hLcUMfli+oKfsYF1nBecpzqPmA38yx/+B/QEPrZYchbjAAAAAElFTkSuQmCC') left center no-repeat;
      background-size: 2.933vw 2.933vw;
      padding-left: 3.4vw;
    }
    .step1 {
      width: 40vw;
    }
    .step2 {
      width: 45.33vw;
      margin-left: 5.667vw;
    }
    .step3 {
      width: 57.333vw;
      margin-left: 10vw;
    }
    .step4 {
      width: 37.33333vw;
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import appDownloadTips from '../../shared/app-download-tips.comp.vue';
  import {setTitle} from '../../shared/utils/title';
  import {callHandler, initIOS} from "../../shared/utils/ios";
  import {isInApp, isiOS} from '../../shared/utils/utils';

  @Component({
    components: {
      appDownloadTips: appDownloadTips,
    }
  })
  export default class AppPayGuideComponent extends Vue {
    isLoading = false;
    isError = false;
    type: number = 0;
    id = '';
    desc = '支付宝';

    created() {
      setTitle('购买绑定流程');
      this.initData();
    }

    async initData() {
      this.id = this.$route.params['id'];
      switch (this.id) {
        case 'alipay':
          this.type = 0;
          this.desc = '支付宝';
          break;
        case 'wechat':
          this.type = 1;
          this.desc = '微信支付';
          break;
        case 'unionpay':
          this.type = 2;
          this.desc = '银行卡';
          break;
        default:
          this.$router.push({path: '/404'});
      }
    }

    async goToAppStore() {
      if (isInApp && isiOS) {
        await initIOS();
        callHandler('purchaseMember', this.id);
      } else {
        return;
      }
    }

  }
</script>
