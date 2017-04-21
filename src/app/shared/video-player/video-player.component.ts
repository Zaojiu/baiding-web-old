import {
  Component, Input, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges, Output,
  EventEmitter
} from '@angular/core';
import {UtilsService} from "../utils/utils";
import {VideoInfo, VideoPlayerOption} from "./video-player.model";

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss'],
})

export class VideoPlayerComponent implements OnDestroy, OnChanges {
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @Input() videoInfo: VideoInfo;
  @Input() option: VideoPlayerOption;
  @Output() onEvents = new EventEmitter<TcPlayerOptionListenerMsg>();
  private player: TcPlayerInstance;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    let videos = changes['videoInfo'];

    if (videos) {
      if (videos.currentValue) {
        this.setPlayer();
      } else {
        this.destroy();
      }
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  setPlayer() {
    var opt: TcPlayerOption = {
      mp4: this.videoInfo.mp4,
      mp4_sd: this.videoInfo.mp4SD,
      mp4_hd: this.videoInfo.mp4HD,
      m3u8: this.videoInfo.m3u8,
      rtmp: this.videoInfo.rtmp,
      rtmp_sd: this.videoInfo.rtmpSD,
      rtmp_hd: this.videoInfo.rtmpHD,
      autoplay: this.option.isAutoPlay,
      live: this.option.isLive,
      width: '100%',
      height: '100%',
      listener: (msg: TcPlayerOptionListenerMsg) => this._onEvents(msg),
    };

    this.player = new TcPlayer('bd-player', opt);
  }

  destroy() {
    this.videoPlayer.nativeElement.innerHTML = '';
  }

  private _onEvents(msg: TcPlayerOptionListenerMsg) {
    this.onEvents.emit(msg);
  }
}
