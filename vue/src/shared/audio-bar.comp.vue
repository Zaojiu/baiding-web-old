<template>
  <div class="audio-bar">
    <audio
      class="audio"
      ref="audio"
      :src="audioUrl"
      preload="metadata"
      @play="isAudioPlaying = true; $emit($event.type, $event)"
      @playing="isAudioPlaying = true; $emit($event.type, $event)"
      @ended="isAudioPlaying = false; resetProgressBar(); $emit($event.type, $event)"
      @pause="isAudioPlaying = false; $emit($event.type, $event)"
      @canplay="isAudioLoading = false; $emit($event.type, $event)"
      @waiting="isAudioLoading = true; $emit($event.type, $event)"
      @progress="resetBuffer(); $emit($event.type, $event)"
      @loadeddata="isAudioLoading = false; resetBuffer(); $emit($event.type, $event)"
      @loadstart="isAudioLoading = true; $emit($event.type, $event)"
      @loadedmetadata="isAudioLoading = false; timeupdate(); $emit($event.type, $event)"
      @timeupdate="timeupdate(); $emit($event.type, $event)"
      @seeking="seeking = true; $emit($event.type, $event)"
      @seeked="seeked(); $emit($event.type, $event)"
      @reset="resetProgressBar(); $emit($event.type, $event)"
    ></audio>
    <div class="play-btn" @click="togglePlay">
      <circle-loading class="loading" v-if="isAudioLoading"></circle-loading>
      <i class="bi bi-pause" v-else-if="isAudioPlaying"></i>
      <i class="bi bi-play-fill" v-else></i>
    </div>
    <div class="bar">
      <!--<div class="duration">{{duration.format('mm:ss', {trim: false})}}</div>-->
      <div
        class="control"
        ref="control"
        @mousedown="mouseDown"
        @touchstart="touchStart"
        @touchmove="cursorMoveHandler"
        @touchend="cursorUpHandler"
      >
        <div class="background">
          <div class="buffer" ref="buffer"></div>
          <div class="current" ref="current"></div>
          <div class="cursor" ref="cursor"></div>
        </div>
      </div>
      <div class="remain">-{{remain.format('mm:ss', {trim: false})}}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .audio-bar {
    display: flex;
    height: 56px;
    border-radius: 8px;
    border: solid 1px rgb(237, 237, 242);
    background-color: rgb(250, 250, 250);
    user-select: none;

    .play-btn {
      flex-shrink: 0;
      position: relative;
      width: 36px;
      height: 36px;
      margin: 10px;
      background-color: $color-brand2;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      .loading {
        font-size: 19px;
        color: $color-w;
      }

      .bi-pause, .bi-play-fill {
        font-size: 12px;
        color: $color-w;
      }

      .bi-play-fill {
        margin-left: 2px;
      }
    }

    .bar {
      position: relative;
      flex-grow: 1;
      overflow: hidden;
      display: flex;

      .duration, .control, .remain {
        position: relative;
      }

      .duration, .remain {
        flex-shrink: 0;
        font-size: 12px;
        color: $color-gray6;
        line-height: 54px;
        text-align: center;
      }

      .duration {
        margin-left: 10px;
      }

      .remain {
        margin-right: 10px;
      }

      .control {
        margin-left: 10px;
        margin-right: 10px;
        flex-grow: 1;

        .background {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 3px;
          border-radius: 2px;
          transform: translateY(-50%);
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          background-color: rgb(216, 216, 216);
          cursor: pointer;
        }

        .buffer {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 0;
          background-color: #A8B4B3;
          pointer-events: none;
        }

        .current {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 0;
          background-color: $color-brand2;
          pointer-events: none;
        }

        .cursor {
          position: absolute;
          left: 0;
          top: 50%;
          width: 16px;
          height: 16px;
          transform: translateX(-50%) translateY(-51%);
          background-color: $color-w;
          border-radius: 50%;
          box-shadow: 0 1px 5px rgba(0, 0, 0, .2);
        }
      }
    }

    .audio {
      display: none;
    }
  }
</style>

<script lang="ts">
  import Vue from "vue";
  import {Component, Watch} from 'vue-property-decorator';
  import circleLoading from './circle-loading.comp.vue';
  import {hasMouseEvent, parsePercent, isiOS, isAndroid} from './utils/utils';

  @Component({
    props: ['audioUrl'],
    components: {
      circleLoading: circleLoading,
    },
  })
  export default class AudioBarComponent extends Vue {
    audioUrl: string;
    isAudioPlaying = false;
    isAudioLoading = false;
    duration = moment.duration(0);
    remain = moment.duration(0);
    private cursorOrigin = 0;
    private mouseDownOrigin = 0;
    private isMouseDown = false;
    private seeking = false;
    private seekingTimer: any = null;

    mounted() {
      this.initEvent();
    }

    destroyed() {
      if (hasMouseEvent && !isiOS && !isAndroid) {
        document.removeEventListener('mousemove', this.cursorMoveHandler, false);
        document.removeEventListener('mouseup', this.cursorUpHandler, false);
      }
    }

    initEvent() {
      if (hasMouseEvent && !isiOS && !isAndroid) {
        document.addEventListener('mousemove', this.cursorMoveHandler, false);
        document.addEventListener('mouseup', this.cursorUpHandler, false);
      }
    }

    private backgroundDown(e: TouchEvent | MouseEvent) {
      const controlEl = this.$refs['control'] as HTMLElement;

      let offsetX: number;
      if (e instanceof MouseEvent) {
        offsetX = (e as MouseEvent).offsetX;
      } else {
        const elRect = controlEl.getBoundingClientRect();
        offsetX = (e as TouchEvent).targetTouches[0].pageX - elRect.left;
      }

      const percent = offsetX / controlEl.getBoundingClientRect().width;

      this.resetCursor(percent);
      this.resetCurrentTime(percent);
    }

    private cursorDown(e: TouchEvent | MouseEvent) {
      const target = this.getTouchTarget(e as TouchEvent);
      const cursorEl = this.$refs['cursor'] as HTMLElement;
      this.mouseDownOrigin = (e instanceof MouseEvent) ? (e as MouseEvent).x : (target ? target.pageX : 0);
      this.cursorOrigin = cursorEl.offsetLeft;
      this.isMouseDown = true;
    }

    private cursorMove(e: TouchEvent | MouseEvent) {
      const target = this.getTouchTarget(e as TouchEvent);
      if (this.isMouseDown) {
        const mouseX = (e instanceof MouseEvent) ? (e as MouseEvent).x : (target ? target.pageX : 0);
        const percent = this.caclulateOffsetX(mouseX);
        this.resetCursor(percent);
        this.seeking = true;
      }
    }

    private cursorUp(e: TouchEvent | MouseEvent) {
      const target = this.getTouchTarget(e as TouchEvent);
      if (this.isMouseDown) {
        const mouseX = (e instanceof MouseEvent) ? (e as MouseEvent).x : (target ? target.pageX : 0);
        const percent = this.caclulateOffsetX(mouseX);
        this.resetCurrentTime(percent);
        this.isMouseDown = false;
        this.seeking = false;
      }
    }

    private caclulateOffsetX(eventX: number): number {
      const controlEl = this.$refs['control'] as HTMLElement;
      const progressBarWidth = controlEl.getBoundingClientRect().width;
      let offsetX = eventX - this.mouseDownOrigin;
      offsetX += this.cursorOrigin;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > progressBarWidth) offsetX = progressBarWidth;
      return offsetX / progressBarWidth;
    }

    resetCursor(percent: number) {
      percent = parsePercent(percent);

      const cursorEl = this.$refs['cursor'] as HTMLElement;
      const currentEl = this.$refs['current'] as HTMLElement;
      cursorEl.style.left = `${percent * 100}%`;
      currentEl.style.width = `${percent * 100}%`;
    }

    private resetCurrentTime(percent: number) {
      percent = parsePercent(percent);

      const audioEl = this.$refs['audio'] as HTMLAudioElement;

      if (audioEl && audioEl.duration) {
        audioEl.currentTime = audioEl.duration * percent;
      }
    }

    private getTouchTarget(e: TouchEvent): Touch|null {
      if (!e || !(e.touches && e.targetTouches && e.changedTouches)) return null;

      if (e.touches && e.touches.length) {
        return e.touches.item(0);
      }

      if (e.targetTouches && e.targetTouches.length) {
        return e.targetTouches.item(0);
      }

      if (e.changedTouches && e.changedTouches.length) {
        return e.changedTouches.item(0);
      }

      return null;
    };

    resetBuffer() {
      const audioEl = this.$refs['audio'] as HTMLAudioElement;

      if (!audioEl) return;

      const bufferEl = this.$refs['buffer'] as HTMLElement;
      const lastBufferIndex = audioEl.buffered.length - 1;
      const duration = audioEl.duration;

      if (lastBufferIndex >= 0) {
        // const start = audioEl.buffered.start(0);
        // this.bufferedEl.style.left = `${start / duration * 100}%`;

        const end = audioEl.buffered.end(lastBufferIndex);
        bufferEl.style.width = `${end / duration * 100}%`;
      }
    };

    timeupdate() {
      if (!this.seeking) {
        const audioEl = this.$refs['audio'] as HTMLAudioElement;

        if (!audioEl) return;

        this.isAudioLoading = false;
        this.duration = moment.duration(audioEl.duration * 1000);
        this.remain = moment.duration((audioEl.duration - audioEl.currentTime) * 1000);
        this.resetCursor(audioEl.currentTime / audioEl.duration);
      }
    }

    mouseDown(e: MouseEvent) {
      if (hasMouseEvent && !isiOS && !isAndroid) {
        if ((e.target as HTMLElement).className === 'background') {
          this.backgroundDown(e);
        } else if ((e.target as HTMLElement).className === 'cursor') {
          this.cursorDown(e);
        }
      }
    }

    touchStart(e: TouchEvent) {
      if (hasMouseEvent && !isiOS && !isAndroid) return;

      this.backgroundDown(e);
      this.cursorDown(e);
    }

    cursorMoveHandler(e: TouchEvent | MouseEvent) {
      this.cursorMove(e);
    }

    cursorUpHandler(e: TouchEvent | MouseEvent) {
      this.cursorUp(e);
    }

    resetProgressBar() {
      this.resetCursor(0);
      const bufferEl = this.$refs['buffer'] as HTMLElement;
      bufferEl.style.width = `0%`;
      const audioEl = this.$refs['audio'] as HTMLAudioElement;
      this.remain = moment.duration(audioEl.currentTime * 1000);
    }

    seeked() {
      clearTimeout(this.seekingTimer);

      if (isiOS) {
        this.seekingTimer = setTimeout(() => this.seeking = false, 2000); // prevent ios seeking delay
      } else {
        this.seeking = false;
      }
    }

    togglePlay() {
      const audioEl = this.$refs['audio'] as HTMLAudioElement;

      if (!audioEl) return;

      if (audioEl.paused) {
        audioEl.play();
      } else {
        audioEl.pause();
      }
    }
  }
</script>
