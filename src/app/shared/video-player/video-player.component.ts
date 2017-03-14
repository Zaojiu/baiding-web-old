import {Component, Input, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {UtilsService} from "../utils/utils";
import {VideoInfo, VideoPlayerOption} from "./video-player.model";

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})

export class VideoPlayerComponent implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @Input() videoInfo: VideoInfo;
  @Input() option: VideoPlayerOption;
  private player: VideoJSPlayer;
  isPlaying = false;

  constructor() {
  }

  ngOnDestroy() {
    if (this.player && this.player.dispose) this.player.dispose();
  }

  hasVideo(): boolean {
    if (!this.videoInfo) return false;

    return this.videoInfo.hasVideo;
  }

  play() {
    if (!this.hasVideo()) return;

    if (!this.player) {
      if (UtilsService.isiOS || UtilsService.isAndroid) {
        this.player = this.videoPlayer.nativeElement; // 移动端不使用videojs
        this.isPlaying = true;
        this.player.play();
      } else {
        System.import('video.js').then(videojs => {
          let opts: any = {
            nativeControlsForTouch: true,
            controls: true,
            flash: {swf: '/assets/video-js.swf'}
          };

          this.player = videojs(this.videoPlayer.nativeElement, opts);
          this.isPlaying = true;
          this.player.play();
        });
      }
    }
  }
}
