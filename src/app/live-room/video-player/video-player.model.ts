import {SafeUrl} from "@angular/platform-browser";

export class VideoPlayerSrc {
  src: SafeUrl;
  type: string;

  constructor(src: SafeUrl, type: string) {
    this.src = src;
    this.type = type;
  }
}

export class LiveStreamInfo {
  streamSrc: VideoPlayerSrc[] = [];
  playbackSrc: VideoPlayerSrc[] = [];
}

export class VideoPlayerOption {
  constructor() {
  }
}
