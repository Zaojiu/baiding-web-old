import {Input, OnInit, OnDestroy, ViewChild, ElementRef, Component} from '@angular/core';
import {UtilsService} from '../utils/utils';

@Component({
  selector: 'single-player',
  templateUrl: './single-player.component.html',
  styleUrls: ['./single-player.component.scss'],
})
export class SinglePlayerComponent implements OnInit, OnDestroy {
  @Input() audioUrl: string;
  @Input() audioCover: string;
  isAudioPlaying = false;
  isAudioLoading = false;
  duration = moment.duration(0);
  remain = moment.duration(0);
  private cursorOrigin = 0;
  private mouseDownOrigin = 0;
  private isMouseDown = false;
  private seeking = false;
  private seekingTimer: any = null;
  @ViewChild('control') control: ElementRef;
  @ViewChild('cursor') cursor: ElementRef;
  @ViewChild('current') current: ElementRef;
  @ViewChild('audio') audio: ElementRef;
  @ViewChild('buffer') buffer: ElementRef;

  ngOnInit() {
    this.initEvent();
  }

  ngOnDestroy() {
    if (UtilsService.hasMouseEvent && !UtilsService.isiOS && !UtilsService.isAndroid) {
      document.removeEventListener('mousemove', this.cursorMoveHandler, false);
      document.removeEventListener('mouseup', this.cursorUpHandler, false);
    }
  }

  initEvent() {
    if (UtilsService.hasMouseEvent && !UtilsService.isiOS && !UtilsService.isAndroid) {
      document.addEventListener('mousemove', this.cursorMoveHandler, false);
      document.addEventListener('mouseup', this.cursorUpHandler, false);
    }
  }

  private backgroundDown(e: TouchEvent | MouseEvent) {
    const controlEl = this.control.nativeElement as HTMLElement;

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
    const cursorEl = this.cursor.nativeElement as HTMLElement;
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
    const controlEl = this.control.nativeElement as HTMLElement;
    const progressBarWidth = controlEl.getBoundingClientRect().width;
    let offsetX = eventX - this.mouseDownOrigin;
    offsetX += this.cursorOrigin;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > progressBarWidth) offsetX = progressBarWidth;
    return offsetX / progressBarWidth;
  }

  resetCursor(percent: number) {
    percent = UtilsService.parsePercent(percent);

    const cursorEl = this.cursor.nativeElement as HTMLElement;
    const currentEl = this.current.nativeElement as HTMLElement;
    cursorEl.style.left = `${percent * 100}%`;
    currentEl.style.width = `${percent * 100}%`;
  }

  private resetCurrentTime(percent: number) {
    percent = UtilsService.parsePercent(percent);

    const audioEl = this.audio.nativeElement as HTMLAudioElement;

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
    const audioEl = this.audio.nativeElement as HTMLAudioElement;
    const bufferEl = this.buffer.nativeElement as HTMLElement;
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
      const audioEl = this.audio.nativeElement as HTMLAudioElement;

      this.isAudioLoading = false;
      this.duration = moment.duration(audioEl.duration * 1000);
      this.remain = moment.duration((audioEl.duration - audioEl.currentTime) * 1000);
      this.resetCursor(audioEl.currentTime / audioEl.duration);
    }
  }

  mouseDown(e: MouseEvent) {
    if (UtilsService.hasMouseEvent && !UtilsService.isiOS && !UtilsService.isAndroid) {
      if ((e.target as HTMLElement).className === 'background') {
        this.backgroundDown(e);
      } else if ((e.target as HTMLElement).className === 'cursor') {
        this.cursorDown(e);
      }
    }
  }

  touchStart(e: TouchEvent) {
    if (UtilsService.hasMouseEvent && !UtilsService.isiOS && !UtilsService.isAndroid) return;

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
    const bufferEl = this.buffer.nativeElement as HTMLElement;
    bufferEl.style.width = `0%`;
    const audioEl = this.audio.nativeElement as HTMLAudioElement;
    this.remain = moment.duration(audioEl.currentTime * 1000);
  }

  seeked() {
    clearTimeout(this.seekingTimer);

    if (UtilsService.isiOS) {
      this.seekingTimer = setTimeout(() => this.seeking = false, 2000); // prevent ios seeking delay
    } else {
      this.seeking = false;
    }
  }

  togglePlay() {
    const audioEl = this.audio.nativeElement as HTMLAudioElement;

    if (audioEl.paused) {
      audioEl.play();
    } else {
      audioEl.pause();
    }
  }
}
