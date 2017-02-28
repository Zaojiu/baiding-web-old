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

  constructor(src: VideoPlayerSrc[]) {
    this.src = src;
  }

  get hasVideo(): boolean {
    return this.src && !!this.src.length
  }

  get hasM3u8(): boolean {
    if (!this.src || !this.src.length) return false;

    for (let item of this.src) {
      if (item.src.toString().indexOf('.m3u8') !== -1) return true;
    }

    return false;
  }

  get hasRtmp(): boolean {
    if (!this.src || !this.src.length) return false;

    for (let item of this.src) {
      if (item.src.toString().indexOf('rtmp://') !== -1) return true;
    }

    return false;
  }
}

export class VideoPlayerOption {
  progessBar: boolean;

  constructor(progressBar: boolean) {
    this.progessBar = progressBar;
  }
}
