import {Component, ElementRef, ViewChild, Input, AfterViewInit} from '@angular/core';
import {VideoPlayerOption} from "./video-player.model";
import {LiveInfoModel, LiveStreamInfo} from "../api/live/live.model";
import {UtilsService} from "../utils/utils";

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})

export class VideoPlayerComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoPlayerEle: ElementRef;
  @Input() option: VideoPlayerOption[];
  @Input() liveInfo: LiveInfoModel;
  @Input() streamInfo: LiveStreamInfo;
  private player: VideoJSPlayer;
  isPlayed = false;
  isIOS = UtilsService.isiOS;

  constructor() {
  }

  ngAfterViewInit() {
    if (this.videoPlayerEle) {
      this.player = (<any>window).videojs(this.videoPlayerEle.nativeElement, { "controls": !this.isIOS }); // ios不显示videojs控件, 避免跟原生控件冲突
    }
  }

  play() {
    if (!this.player) return;
    this.isPlayed = true;
    this.player.play();
  }
}
