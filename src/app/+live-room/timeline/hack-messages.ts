import {MessageModel} from "../../shared/api/message/message.model";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {MessageType} from "../../shared/api/message/message.enum";
import {LiveStatus} from "../../shared/api/live/live.enums";

export class HackMessages {
  static hackLiveEndMessage(liveInfo: LiveInfoModel, messages: MessageModel[]) {
    if (liveInfo.status === LiveStatus.Ended) {
      let endMessage = new MessageModel();
      endMessage.id = '';
      endMessage.type = MessageType.LiveEnd;
      endMessage.createdAt = liveInfo.closedAt;
      messages.push(endMessage);
    }
  }

  static hackLiveInfoMessage(liveInfo: LiveInfoModel, messages: MessageModel[]) {
      let infoMessage = new MessageModel();
      infoMessage.id = '';
      infoMessage.type = MessageType.LiveRoomInfo;
      infoMessage.createdAt = liveInfo.createdAt;
      messages.unshift(infoMessage);
  }
}
