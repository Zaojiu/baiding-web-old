type TcPlayerOptionWording = {[key: number]: string};

interface TcPlayerOptionListenerMsg{
  type: string;
  src: any;
  ts: number;
  detail: any;
}

interface TcPlayerOptionListener{
  (msg: TcPlayerOptionListenerMsg);
}

declare interface TcPlayerOptionCover {
  style: string;
  src: string;
}

declare interface TcPlayerOption {
  m3u8?: string;
  m3u8_hd?: string;
  m3u8_sd?: string;
  flv?: string;
  flv_hd?: string;
  flv_sd?: string;
  mp4?: string;
  mp4_hd?: string;
  mp4_sd?: string;
  rtmp?: string;
  rtmp_hd?: string;
  rtmp_sd?: string;
  width: number;
  height: number;
  live: boolean;
  autoplay?: boolean;
  coverpic?: string|TcPlayerOptionCover;
  controls?: string;
  x5_type?: string;
  x5_fullscreen?: string;
  wodring?: TcPlayerOptionWording;
  listener?: TcPlayerOptionListener;
}

declare interface TcPlayerStatic {
  new (id: string, option: TcPlayerOption): TcPlayerInstance;
}

declare interface TcPlayerInstance {
}

declare module "tcplayer" {
  export = TcPlayer;
}

declare var TcPlayer: TcPlayerStatic;
