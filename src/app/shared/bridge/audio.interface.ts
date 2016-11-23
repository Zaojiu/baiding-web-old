export abstract class AudioBridge {
  playingVoiceId: string;

  abstract startRecord(): Promise<void>;
  abstract stopRecord(): Promise<string|Blob>;
  abstract cancelRecord(): Promise<void>;
  abstract autoCompelete(): Promise<string|Blob>; // 超过60s没有调用停止接口, 或者调用失败.
  abstract playVoice(data: string): Promise<string>;
  abstract stopVoice(data: string);
  abstract uploadVoice(data: string): Promise<string>;
  abstract encodeVoice(data: Blob): Promise<Blob>;
}
