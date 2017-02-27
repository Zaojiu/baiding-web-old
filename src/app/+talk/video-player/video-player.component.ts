import {Component, Input, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {TalkInfoMediaModel} from "../../shared/api/talk/talk.model";

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})

export class VideoPlayerComponent implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @Input() videoInfo: TalkInfoMediaModel;
  private player: VideoJSPlayer;
  isPlaying = false;

  constructor() {
  }

  ngOnDestroy() {
    if (this.player) this.player.dispose();
  }

  hasVideo() {
    return this.videoInfo && this.videoInfo.hasVideo();
  }

  play() {
    if (!this.hasVideo()) return;

    let opts = {
      nativeControlsForTouch: true,
      controls: true,
      flash: {swf: '/assets/video-js.swf'}
    };
    if (!this.player) this.player = (<any>window).videojs(this.videoPlayer.nativeElement, opts); // ios不显示videojs控件, 避免跟原生控件冲突

    this.isPlaying = true;
    this.player.play();
  }
}
