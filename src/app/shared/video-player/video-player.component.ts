import {
  Component, Input, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges, Output,
  EventEmitter
} from '@angular/core';
import { VideoInfo, VideoPlayerOption } from "./video-player.model";
import { AnalyticsService, MediaType, MediaInfo, MediaQuality, MediaFormat, MediaPlayer } from "../analytics/analytics.service"

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

  private played: boolean;
  private startLoad: number;
  private buffering: number;
  private seeking: number;
  private lastOffset: number = 0;
  private seekingOffset: number = 0;
  private playDur: number = 0;

  constructor(private analytics: AnalyticsService) {
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
    let opt: TcPlayerOption = {
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
    if (this.player) this.player.destroy();
    if (this.videoPlayer) this.videoPlayer.nativeElement.innerHTML = '';
  }

  buildMediaInfo(): MediaInfo {
    var mediaInfo = new MediaInfo()
    if (!this.player || !this.player.video) {
      return mediaInfo
    }

    mediaInfo.mediaUrl = this.player.options.videoSource.curUrl
    mediaInfo.mediaType = MediaType.Video

    switch (this.player.options.videoSource.curDef) {
      case 'sd':
        mediaInfo.mediaQuality = MediaQuality.SD360P
        break
      case 'hd':
        mediaInfo.mediaQuality = MediaQuality.HD720P
        break
      default:
        mediaInfo.mediaQuality = MediaQuality.Original
    }

    switch (this.player.options.videoSource.curFormat) {
      case 'rtmp':
        mediaInfo.mediaFormat = MediaFormat.rtmp
        break
      case 'm3u8':
        mediaInfo.mediaFormat = MediaFormat.m3u8
        break
      case 'flv':
        mediaInfo.mediaFormat = MediaFormat.flv
        break
      default:
        mediaInfo.mediaFormat = MediaFormat.mp4
    }

    mediaInfo.mediaLive = this.player.options.live
    if (!mediaInfo.mediaLive) {
      mediaInfo.mediaOffset = _.toInteger(this.player.video.el.currentTime * 1e3)
      mediaInfo.mediaTotalDur = _.toInteger(this.player.video.el.duration * 1e3)
    }

    if (this.player.options.flash) {
      mediaInfo.mediaPlayer = MediaPlayer.flash
    } else {
      mediaInfo.mediaPlayer = MediaPlayer.h5
    }
    return mediaInfo
  }

  isPlaying(): boolean {
    if (!this.player || !this.player.video) {
      return false
    }
    return !this.buffering && this.player.video.playState == "PLAYING" && (this.player.video.seekState != "SEEKING")
  }

  private _onEvents(msg: TcPlayerOptionListenerMsg) {
    // first play point
    if (!this.played) {
      if (!this.startLoad && msg.type == "load") {
        this.startLoad = (new Date()).getTime()

      } else if (this.startLoad && msg.type == "error") {
        this.startLoad = (new Date()).getTime()

      } else if (this.startLoad && msg.type == "loadedmetadata") {
        this.played = true

        let mediaInfo = this.buildMediaInfo()
        let bufferDur = (new Date()).getTime() - this.startLoad
        this.analytics.eventMediaPlay(mediaInfo, bufferDur)
      }
    }

    // drag point
    if (!this.player.options.live) {
      if (msg.type == "seeking") {
        this.seeking = (new Date()).getTime()
        this.seekingOffset = this.lastOffset

      } else if (msg.type == "seeked") {
        let seekDur = (new Date()).getTime() - this.seeking
        let fromOffset = this.seekingOffset
        let toOffset = this.player.video.el.currentTime
        let mediaInfo = this.buildMediaInfo()
        this.analytics.eventMediaSeek(mediaInfo, fromOffset, toOffset, seekDur)
      }
      this.lastOffset = this.player.video.el.currentTime
    }

    // buffer point
    if (this.buffering && msg.type == "playing") {
      this.buffering = 0
    }

    if (msg.type == "buffering" && this.isPlaying()) {
      this.buffering = (new Date()).getTime()
      let mediaInfo = this.buildMediaInfo()
      this.analytics.eventMediaBuffer(mediaInfo)
    }


    this.onEvents.emit(msg);
  }
}
