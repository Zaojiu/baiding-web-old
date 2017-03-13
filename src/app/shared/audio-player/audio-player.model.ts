import {MessageModel} from "../api/message/message.model";

export class AudioPlayerData {
  message: MessageModel;
  offset: number;

  constructor(message: MessageModel, offset = 0) {
    this.message = message;
    this.offset = offset;
  }
}

export enum AudioPlayerEventType {
  Play = 0,
  Pause,
  Loading,
  Abort,
  End,
}

export class AudioPlayerEvent {
  type: AudioPlayerEventType;
  data: AudioPlayerData;
  isEnded: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  isAbort: boolean;
  isPause: boolean;

  constructor(type: AudioPlayerEventType, data: AudioPlayerData) {
    this.type = type;
    this.data = data;
    this.isEnded = this.type === AudioPlayerEventType.End;
    this.isPlaying = this.type === AudioPlayerEventType.Play;
    this.isAbort = this.type === AudioPlayerEventType.Abort;
    this.isPause = this.type === AudioPlayerEventType.Pause;
    this.isLoading = this.type === AudioPlayerEventType.Loading;
  }
}
