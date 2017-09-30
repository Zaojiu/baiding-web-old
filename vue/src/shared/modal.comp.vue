<template>
  <div class="modal" v-if="isOpened" @click="close()">
    <div class="content" @click.stop>
      <div class="body" v-html="content"></div>
      <div class="footer">
        <div class="button" @click="close()" v-if="hasCancelBtn">{{cancelText}}</div>
        <div class="button" v-if="!link" @click="confirm()">{{confirmText}}</div>
        <a class="button" v-if="link" :href="link" :target="target">{{confirmText}}</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    background-color: rgba(0, 0, 0, .6);
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;

    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      border-radius: 12px;
      border: solid 1px rgb(218, 218, 218);
      background-color: $color-w;
      padding: 0;
      text-align: center;
      width: calc(100% - 50px);

      .body {
        padding: 20px;
        color: $color-dark-gray;
        font-size: 16px;
      }

      .footer {
        display: flex;

        .button {
          list-style: none;
          padding: 18px;
          height: 53px;
          line-height: 1em;
          color: $color-brand;
          font-size: 17px;
          border-top: solid 1px rgb(218, 218, 218);
          cursor: pointer;
          flex-grow: 1;

          &:not(:first-child){
            border-left: solid 1px rgb(218, 218, 218);
          }
        }
      }
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {modalStore, confirmModal, cancelModal, ModalPopupStatus} from '../store/modal';

  @Component
  export default class ModalCompoent extends Vue {
    get isOpened() {
      return modalStore.state.status === ModalPopupStatus.Popup;
    }

    get content() {
      return modalStore.state.options.content;
    }

    get cancelText() {
      return modalStore.state.options.cancelText;
    }

    get confirmText() {
      return modalStore.state.options.confirmText;
    }

    get hasCancelBtn() {
      return modalStore.state.options.hasCancelBtn;
    }

    get link() {
      return modalStore.state.options.link;
    }

    get target() {
      return modalStore.state.options.target;
    }

    close() {
      if (this.hasCancelBtn) this.cancel();
    }

    confirm() {
      confirmModal();
    }

    cancel() {
      cancelModal();
    }
  }
</script>
