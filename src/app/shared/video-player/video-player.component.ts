import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import {VideoPlayerOption} from "./video-player.model";
import {LiveInfoModel, LiveStreamInfo} from "../api/live/live.model";
import {UtilsService} from "../utils/utils";

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})

export class VideoPlayerComponent {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @Input() option: VideoPlayerOption[];
  @Input() liveInfo: LiveInfoModel;
  @Input() streamInfo: LiveStreamInfo;
  private player: VideoJSPlayer;
  isPlayed = false;
  isIOS = UtilsService.isiOS;

  constructor() {
  }

  hasVideo() {
    return !this.liveInfo.isCreated() &&
      this.streamInfo &&
      ((this.streamInfo.streamSrc && this.streamInfo.streamSrc.length) ||
      (this.streamInfo.playbackSrc && this.streamInfo.playbackSrc.length));
  }

  play() {
    if (!this.hasVideo()) return;
    if (!this.player) this.player = (<any>window).videojs(this.videoPlayer.nativeElement, {"controls": !this.isIOS}); // ios不显示videojs控件, 避免跟原生控件冲突

    this.isPlayed = true;
    this.player.play();
  }
}
