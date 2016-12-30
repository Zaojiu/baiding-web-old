import {MessageModel} from "../api/message/message.model";

export class AudioListPlayerPosition {
  message: MessageModel;
  offset: number;

  constructor(message: MessageModel, offset = 0) {
    this.message = message;
    this.offset = offset;
  }
}

export enum AudioListPlayerEventType {
  Play = 0,
  Pause,
  Loading,
  Abort,
  End,
}

export class AudioListPlayerEvent {
  type: AudioListPlayerEventType;
  data: AudioListPlayerPosition;

  constructor(type: AudioListPlayerEventType, data: AudioListPlayerPosition) {
    this.type = type;
    this.data = data;
  }
}
