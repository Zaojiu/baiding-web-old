<template>
  <div class="container">
    <div v-if="type === 'text'" class="container-post">
      <div class="top">
        <i class="btn-x bi bi-close-b" @click="closePage()"></i>
        <span class="btn-post" @click="postMsg()">发布</span>
      </div>
      <p class="title">发布内容</p>
      <div class="bottom">
        <textarea class="textarea" autofocus v-model="content">{{ content }}</textarea>
      </div>
    </div>
    <div v-if="type === 'image'" class="container-post container-post-img">
      <div class="top">
        <i class="btn-x bi bi-close-b" @click="closePage()"></i>
        <span class="btn-post" @click="postImgMsg()">发布</span>
      </div>
      <p class="title">发布内容</p>
      <div class="bottom">
        <textarea class="textarea" autofocus v-model="content">{{ content }}</textarea>
        <hr/>
        <div class="form-group">
          <div class="image-wrapper">

            <div class="web-img-group" v-if="!isInWechat">
              <label for="image-selector" class="web-file">
                <input
                  accept="image/png,image/gif,image/jpeg"
                  class="file-selector"
                  id="image-selector"
                  type="file"
                  @change="fileChange"
                >
              </label>
              <div class="edit-btn" v-if="!avatarSrc"><span class="edit-btn"><i class="bi bi-edit"></i></span></div>
              <div v-if="avatarSrc" class="choose-img">
                <img :src="avatarSrc"/>
              </div>
              <div v-if="avatarSrc" class="delete" @click="deleteImg()"><i class="bi bi-delete"></i></div>
            </div>
            <div class="img-group" v-if="isInWechat">
              <div class="img-item" v-if="wxLocalId.length>0" v-for="item in wxLocalId">
                <div class="delete" @click="deleteImg(item)"><i class="bi bi-delete"></i></div>
                <img :src="item"/>
              </div>
              <div class="img-item add">
                <div class="file-selector" @click="selectImages()">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .container {
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: #fff;

    .container-post {

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .btn-x {
          height: 12px;
          width: 12px;
          margin-left: 20px;
        }
        .btn-post {
          color: rgb(0, 211, 193);
          font-size: 17px;
          line-height: 24px;
          margin: 12px 20px;
        }
      }

      .title {
        padding: 0 0 20px 20px;
        font-size: 28px;
        line-height: 28px;
        color: black;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        font-weight: bold;
      }

      .bottom {
        position: absolute;
        top: 92px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;

        .textarea {
          display: block;
          width: 100%;
          height: 100%;
          outline: none;
          border: none;
          resize: none;
          font-size: 16px;
          line-height: 24px;
        }
      }
    }

    .container-post-img {

      .bottom {
        position: absolute;
        top: 92px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;

        .textarea {
          display: block;
          width: 100%;
          height: 200px;
          outline: none;
          border: none;
          resize: none;
          font-size: 16px;
          line-height: 24px;
        }

        .form-group {
          margin: 0;

          .web-img-group {
            position: relative;
            border: 1px solid #eee;
            margin-top: 10px;

            .web-file {
              position: relative;
              margin: 0;
              width: 100%;
              height: 120px;
              background-color: #eee;

              .file-selector {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                padding: 0;
              }
            }

            .edit-btn {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translateX(-50%) translateY(-50%);
            }

            .choose-img {
              position: absolute;
              top: 0;
              right: 0;
              width: 100%;

              img {
                width: 100%;
              }
            }

            .delete {
              position: absolute;
              top: 0;
              right: 0;
              font-size: 14px;
              padding: 2px 4px;
              background-color: #fff;
              color: #000;
            }

          }

          .img-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;

            .img-item {
              position: relative;
              width: 30%;
              height: 20vw;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #2b333f;
              margin-top: 10px;
              overflow: hidden;

              .delete {
                position: absolute;
                top: 0;
                right: 0;
                font-size: 14px;
                color: #fff;
                padding: 2px 4px;
              }

              img {
                width: 100%;
              }
            }

            .add {
              width: 30%;
              height: 80px;
              line-height: 80px;
              font-size: 50px;
              font-weight: 100;
              color: #787878;
              text-align: center;
              background-color: #eee;
            }

          }
        }

      }
    }
  }
</style>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import {isInWechat} from "../../../shared/utils/utils";
  import {initWechat} from "../../../shared/utils/wechat";
  import {chooseImages, uploadWxImage, uploadToQiniu} from '../../../shared/utils/upload-image';
  import {postTextMessage, postImgMessage, getQiNiuToken} from '../../../shared/api/group.api';
  import {FileReaderEvent} from '../../../shared/api/group.model';
  import {showTips} from '../../../store/tip';

  @Component
  export default class CommentComponent extends Vue {
    content = '';
    groupId = '';
    type = '';
    avatarSrc: any = '';
    isInWechat = false;// todo 微信后台尚未完成
    wxLocalId: string[] = [];
    chooseImg: any;
    qiNiuKey: string;

    created() {
      this.groupId = this.$route.params['groupId'];
      this.type = this.$route.query['type'];
    }

    async initData() {

    }

    deleteImg(delItem?: string) {
      if (delItem) {
        this.wxLocalId = this.wxLocalId.filter((item) => {
          return delItem !== item
        })
      } else {
        this.avatarSrc = '';
        this.chooseImg = '';
      }
    }

    closePage() {
      this.$router.back();
    }

    async fileChange(file: any) {
      this.chooseImg = file.target.files[0];
      let that = this;
      let reader = new FileReader();
      reader.onload = function (e: FileReaderEvent) {
        //base64码
        that.avatarSrc = e.target['result'];
      };
      reader.readAsDataURL(this.chooseImg);
    }

    async selectImages() {
      await initWechat();
      let localIds = await chooseImages();
      this.wxLocalId = localIds.map((item: any) => {
        return item as string;
      });
    }

    async postImgMsg() {
      if (!this.content) {
        showTips('内容不能为空！');
        return;
      }

      // 微信环境
      if (this.isInWechat) {

        // 没有选择图片
        if (this.wxLocalId.length <= 0) {
          this.postMsg();
          return
        }

        // 有图片
        try {
          // await uploadImage();
          await postImgMessage(this.groupId, this.content, []);
          showTips('内容提交成功！');
          this.closePage();
        } catch (e) {
          showTips('网络错误！');
        }
        return;
      }

      // 非微信web环境
      //无图
      if (!this.chooseImg) {
        this.postMsg();
        return
      }

      // 有图
      try {
        let result = await getQiNiuToken(this.groupId, 1);
        let qiNiuKey = await uploadToQiniu(this.chooseImg, result[0].key, result[0].token);
        await postImgMessage(this.groupId, this.content, [{"qiniuKey": qiNiuKey}]);
        showTips('内容提交成功！');
        this.closePage();
      } catch (e) {
        showTips('网络错误！');
      }
    }

    async postMsg() {
      if (this.content) {
        try {
          await postTextMessage(this.groupId, this.content);
          showTips('内容提交成功！');
          this.closePage();
        } catch (e) {
          showTips('网络错误！');
        }
      } else {
        showTips('内容不能为空！');
      }
    }

  }
</script>
