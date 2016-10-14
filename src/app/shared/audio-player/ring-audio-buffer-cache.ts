interface MessageAudioBuffer {
  msgId: string;
  buffer: AudioBuffer;
}

export class RingAudioBufferCache {

  private _cache: MessageAudioBuffer[];
  private _size: number;
  private _cur: number;

  constructor(size: number) {
    if (size <= 0) {
      throw new Error('cache size must large than zero');
    }
    this._size = size;
    this._cur = 0;
    this._cache = [];
  }

  set(msgId: string, buffer: AudioBuffer) {
    if (!this.get(msgId)) {
      this._cache[this._cur++ % this._size] = {msgId: msgId, buffer: buffer};
    }
  }

  get(msgId: string): AudioBuffer {

    for (let b of this._cache) {
      if (b.msgId === msgId) {
        return b.buffer;
      }
    }
    return null;
  }
}
