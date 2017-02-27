import {SafeUrl} from "@angular/platform-browser";

export class VideoPlayerSrc {
  src: SafeUrl;
  type: string;

  constructor(src: SafeUrl, type: string) {
    this.src = src;
    this.type = type;
  }
}

export class VideoInfo {
  src: VideoPlayerSrc[] = [];

  hasVideo(): boolean {
    return this.src && this.src.length
  }
}

export class VideoPlayerOption {
  constructor() {
  }
}
