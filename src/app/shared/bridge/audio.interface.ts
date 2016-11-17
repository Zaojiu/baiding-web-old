export abstract class AudioBridge {
  playingVoiceId: string;

  abstract startRecord(): Promise<void>;
  abstract stopRecord(): Promise<string>;
  abstract cancelRecord(): Promise<void>;
  abstract autoCompelete(): Promise<string>; // 超过60s没有调用停止接口, 或者调用失败.
  abstract playVoice(id: string): Promise<string>;
  abstract stopVoice(id: string);
  abstract uploadVoice(id: string): Promise<string>;
  abstract translateVoice(id: string): Promise<string>;
}
