import {Component, Input, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {VideoPlayerOption} from "./video-player.model";
import {LiveInfoModel, LiveStreamInfo} from "../../shared/api/live/live.model";

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})

export class VideoPlayerComponent implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @Input() option: VideoPlayerOption[];
  @Input() liveInfo: LiveInfoModel;
  @Input() streamInfo: LiveStreamInfo;
  private player: VideoJSPlayer;
  isPlayed = false;
  noProgressbar = false;

  constructor() {
  }

  ngOnDestroy() {
    if (this.player) this.player.dispose();
  }

  hasVideo() {
    if (this.streamInfo.streamSrc && this.streamInfo.streamSrc.length) {
      this.noProgressbar = this.streamInfo.streamSrc[0].src.toString().indexOf('rtmp://') !== -1;
    }

    return !this.liveInfo.isCreated() &&
      this.streamInfo &&
      ((this.streamInfo.streamSrc && this.streamInfo.streamSrc.length) ||
      (this.streamInfo.playbackSrc && this.streamInfo.playbackSrc.length));
  }

  play() {
    if (!this.hasVideo()) return;

    let opts = {
      nativeControlsForTouch: true,
      flash: {swf: '/assets/video-js.swf'}
    };
    if (!this.player) this.player = (<any>window).videojs(this.videoPlayer.nativeElement, opts); // ios不显示videojs控件, 避免跟原生控件冲突

    this.isPlayed = true;
    this.player.play();
  }
}
