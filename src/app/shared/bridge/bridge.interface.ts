export class AudioModel {
  localId: string;
  serverId: string;
  translateResult: string;
  duration: number;
}


export declare abstract class ShareBridge {
  abstract share(title: string, desc: string, cover: string, link: string, liveId?: string);
}

export declare abstract class AuthBridge {
  abstract auth(redirectTo: string);
}

export declare abstract class AudioBridge {
  playingVoiceId: string;

  abstract startRecord(): Promise<void>;
  abstract stopRecord(duration: number): Promise<AudioModel>;
  abstract cancelRecord(): Promise<void>;
  abstract autoCompelete(): Promise<string>; // 超过60s没有调用停止接口, 或者调用失败.
  abstract playVoice(id: string): Promise<string>;
  abstract stopVoice(id: string);
  abstract uploadVoice(id: string): Promise<string>;
  abstract translateVoice(id: string): Promise<string>;
}
