<template>
  <div class="audio-bar">
    <audio
      class="audio"
      ref="audio"
      :src="audioUrl"
      preload="metadata"
      @playing="isAudioPlaying = true"
      @ended="isAudioPlaying = false; resetProgressBar()"
      @pause="isAudioPlaying = false"
      @canplay="log('canplay')"
      @emptied="log('emptied')"
      @waiting="log('waiting')"
      @stalled="log('stalled')"
      @suspend="log('suspend')"
      @progress="log('progress'); resetBuffer();"
      @loadeddata="log('loadeddata'); isAudioLoading = false; resetBuffer();"
      @loadstart="log('loadstart'); isAudioLoading = true"
      @loadedmetadata="log('loadedmetadata'); isAudioLoading = false; timeupdate"
      @timeupdate="log('timeupdate'); timeupdate"
      @seeking="seeking = true"
      @seeked="seeked"
      @reset="resetProgressBar()"
    ></audio>
    <div class="cover" @click="togglePlay">
      <img :src="audioCover" @error="audioCover = '/assets/img/default-cover.jpg'" alt="封面">
      <div class="loading" v-if="isAudioLoading"><circle-loading class="abs-center"></circle-loading></div>
      <i class="bi bi-pause" v-else-if="isAudioPlaying"></i>
      <i class="bi bi-play-fill" v-else></i>
    </div>
    <div class="bar">
      <div class="background-image" :style="{'background-image': 'url(' + audioCover + ')'}"></div>
      <div class="duration">{{duration.format('mm:ss', {trim: false})}}</div>
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
    height: 44px;
    user-select: none;

    .cover {
      flex-shrink: 0;
      position: relative;
      width: 44px;
      height: 44px;

      img {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        object-fit: cover;
      }

      .loading {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .3);
      }

      .bi {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .3);

        &:before {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translateX(-50%) translateY(-50%);
          color: $color-w;
          font-size: 18px;
        }
      }
    }

    .bar {
      position: relative;
      flex-grow: 1;
      overflow: hidden;
      display: flex;

      .background-image {
        position: absolute;
        left: -40px;
        right: -40px;
        top: -40px;
        bottom: -40px;
        background-size: cover;
        background-position: center;
        filter: blur(15px) brightness(70%);
      }

      .duration, .control, .remain {
        position: relative;
      }

      .duration, .remain {
        flex-shrink: 0;
        font-size: 12px;
        color: $color-w;
        line-height: 44px;
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
          transform: translateY(-50%);
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          background-color: #d5d5d5;
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
          background-color: $color-brand;
          pointer-events: none;
        }

        .cursor {
          position: absolute;
          left: 0;
          top: 50%;
          width: 8px;
          height: 15px;
          transform: translateX(-50%) translateY(-50%);
          background-color: $color-w;
          box-shadow: 0 0 2px rgba(0, 0, 0, .5);
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
    props: ['audioUrl', 'audioCover'],
    components: {
      circleLoading: circleLoading,
    },
  })
  export default class AudioBarComponent extends Vue {
    audioUrl: string;
    audioCover: string;
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

      if (audioEl.duration) {
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

    log(data: any) {
      console.log(data);
    }

    togglePlay() {
      const audioEl = this.$refs['audio'] as HTMLAudioElement;

      if (audioEl.paused) {
        audioEl.play();
      } else {
        audioEl.pause();
      }
    }
  }
</script>
