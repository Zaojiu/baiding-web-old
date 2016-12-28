import {MessageModel} from "../api/message/message.model";
export class AudioListPlayerPosition {
  message: MessageModel;
  offset: number;

  constructor(message: MessageModel, offset = 0) {
    this.message = message;
    this.offset = offset;
  }
}
