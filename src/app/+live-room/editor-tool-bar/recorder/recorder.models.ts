export class RecorderData {
  localId: string;
  audioData: Blob;
  duration: number;

  constructor(localId: string, audioData: Blob, duration: number) {
    this.localId = localId;
    this.audioData = audioData;
    this.duration = duration;
  }
}
