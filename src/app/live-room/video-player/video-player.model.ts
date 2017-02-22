import {SafeUrl} from "@angular/platform-browser";

export class VideoPlayerSrc {
  src: SafeUrl;
  type: string;

  constructor(src: SafeUrl, type: string) {
    this.src = src;
    this.type = type;
  }
}

export class VideoPlayerOption {
  constructor() {
  }
}
