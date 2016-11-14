import {MessageModel} from "../../shared/api/message/message.model";
import {LiveInfoModel} from "../../shared/api/live/live.model";
import {MessageType} from "../../shared/api/message/message.enum";
import {LiveStatus} from "../../shared/api/live/live.enums";

export class HackMessages {
  // 需求不明确, 暂时注释掉
  // static hackLiveStartMessage(liveInfo: LiveInfoModel, messages: MessageModel[]) {
  //   if (!messages.length) return;
  //
  //   let beforeStartIndex = _.findIndex(messages, (message: MessageModel) => {
  //     return moment(message.createdAt).isBefore(moment(liveInfo.expectStartAt));
  //   });
  //
  //   if (beforeStartIndex !== -1) {
  //     let startMessage = new MessageModel();
  //     startMessage.id = '';
  //     startMessage.type = MessageType.LiveStart;
  //     startMessage.createdAt = liveInfo.expectStartAt;
  //     messages.splice(beforeStartIndex + 1, 0, startMessage);
  //   }
  // }

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
