<template>
  <div class="container">
    <div class="pack">
      <h3>火星计划联名卡《信息授权协议》</h3>
      <p>
        &nbsp;&nbsp;&nbsp;&nbsp;
        请在购买、使用我们的产品、服务前，仔细阅读本内容，对本内容的同意将构成您对我们收集、处理、使用您的相关个人信息的授权。
        <br/>
        <br/>
        1. 购买本联名卡，需要您提供必要的个人信息，包括：姓名、电话、住址；
        <br/>
        <br/>
        2. 您在观看专享的深度访谈及幕后花絮时，我们会在您的计算机或移动设备上储存名为cookie的小数据文件，借助于cookie网站能够存储您的偏好。
        <br/>
        <br/>
        3. 我们将会对您的个人信息进行妥善保存，采取符合业界标准的安全防护措施进行保护。对您的个人信息的处理和使用仅限于让您能够充分享受到本卡权益内容的范围。
        <br/>
        <br/>
        4. 依据您的观看记录我们会分析您的偏好，在您选择观看内容时依据您的偏好向您推荐相应类型的视频和产品，除此之外我们不会将您的偏好信息作其他使用，不会擅自转让给其他任何第三方。
        <br/>
        <br/>
        5. 您可以通过登陆自己的个人中心网页，查询您的服务使用记录，并可以查询到您所提供的个人用户信息数据；
        <br/>
        <br/>
        6. 如果您发现您的个人信息出现错误，您有权要求我们进行更正，您可以在个人中心网页中找到相应的选项，在线向我们提出更正申请；
        <br/>
        <br/>
        7.
        您有权申请撤回或要求我们删除您的全部或部分个人信息，但会影响到您使用联名卡的权益内容。我们充分尊重您的个人意愿，在您的要求之下我们会及时办理个人信息的撤回、删除事宜，但因此造成联名卡权益的无法使用的后果由您个人承担，您购卡时所支付的金额不予退还。
        <br/>
        <br/>
        在此向您明确提示，在此打勾视为您对本内容的充分知悉和同意，您
        充分授权我们根据本内容收集、使用、处理、保存您的个人信息。
      </p>
    </div>
    <div class="control">
      <input type="checkbox" v-model="isChecked"/>
      <span class="tips">我已仔细阅读，并同意以上协议</span>
    </div>
    <div class="footer">
      <button class="button" :class="isChecked?'button-primary':'button-gray'" @click="agreePact">继 续</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    width: 100%;
    padding: 20px 20px 60px 20px;

    .pack {

      h3 {
        text-align: center;
        margin-bottom: 10px;
      }
    }

    .control {
      margin-top: 15px;

      .tips {
        padding-left: 6px;
      }
    }

    .button-gray {
      background-color: gray;
      color: #fff;
    }

    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #00ECD8;
      font-size: 20px;

      button {
        font-weight: bold;
      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Watch} from 'vue-property-decorator';
  import {getUserInfoCacheDiyRedirectTo} from "../../shared/api/user.api";
  import {UserInfoModel} from '../../shared/api/user.model';
  import {isInWechat} from "../../shared/utils/utils";
  import {initWechat} from "../../shared/utils/wechat";
  import {setShareInfo} from "../../shared/utils/share";
  import {host} from "../../env/environment";
  import {showTips} from "../../store/tip";

  @Component
  export default class IntroMarsComponent extends Vue {
    userInfo: UserInfoModel | null = null;
    isChecked = false;

    created() {
      this.share();
    }

    // 点击接受直接进入
    // @Watch('isChecked')
    /*checker() {
      if (this.isChecked){
        this.agreePact();
      }
    }*/

    async share() {
      if (isInWechat) {
        await initWechat();
        let url = `${host.self}/wv/pact`;
        let title = '用户协议';
        setShareInfo(
          title,
          '一起探索科技创新与未来的前沿',
          'https://og9s6vxbs.qnssl.com/zaojiu-logo.jpg',
          url
        );
      }
    }

    agreePact() {
      if (!this.isChecked) {
        showTips('同意协议后我们才能继续为您服务喔！');
        return;
      }
      // 微信中如果没有登录，直接在这里授权登录，如果已经登录则进入下一页面，如果不在微信，进入下一页面再用手机号登录
      if (isInWechat) {
        this.userInfo = getUserInfoCacheDiyRedirectTo(true, `${host.self}/wv/aia-intro-mars`);
        if (this.userInfo) {
          this.$router.push({path: `/wv/aia-intro-mars`});
        }
        return;
      }
      this.$router.push({path: `/wv/aia-intro-mars`});
    }

  }
</script>
