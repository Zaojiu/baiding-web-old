export class VideoInfo {
  m3u8: string;
  mp4SD: string;
  mp4HD: string;
  mp4: string;
  rtmpSD: string;
  rtmpHD: string;
  rtmp: string;

  constructor(m3u8 = '', mp4SD = '', mp4HD = '', mp4 = '', rtmpSD = '', rtmpHD = '', rtmp = '') {
    this.m3u8 = m3u8;
    this.mp4SD = mp4SD;
    this.mp4HD = mp4HD;
    this.mp4 = mp4;
    this.rtmpSD = rtmpSD;
    this.rtmpHD = rtmpHD;
    this.rtmp = rtmp;
  }

  get hasVideo(): boolean {
    for (let key of Object.keys(this)) {
      if (this[key] !== '') return true;
    }

    return false;
  }

  get hasM3u8(): boolean {
    return !!this.m3u8;
  }

  get hasRtmp(): boolean {
    return !!this.rtmpSD && !!this.rtmpHD && !!this.rtmp;
  }
}

export class VideoPlayerOption {
  isLive: boolean;
  isAutoPlay: boolean;

  constructor(isLive = false, isAutoPlay = false) {
    this.isLive = isLive;
    this.isAutoPlay = isAutoPlay;
  }
}
