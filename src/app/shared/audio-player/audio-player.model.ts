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

  constructor(type: AudioPlayerEventType, data: AudioPlayerData) {
    this.type = type;
    this.data = data;
  }

  isEnded(): boolean {
    return this.type === AudioPlayerEventType.End;
  }
}
