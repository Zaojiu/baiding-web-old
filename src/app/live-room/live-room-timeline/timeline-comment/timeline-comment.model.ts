import { TimelineCommentType } from './timeline-comment.enum';
import { UserInfoModel } from '../../../shared/user-info/user-info.model'

export class TimelineCommentAudioModel {
  localId: string;
  serverId: string;
  translateResult: string;
}

export class TimelineCommentModel {
  id: string;
  isReceived: boolean; // 用于判断是否为服务器拉取下来的信息，或者是本地发送时的信息。
  user: UserInfoModel;
  content: string;
  type: TimelineCommentType;
  audio: TimelineCommentAudioModel;
  hadPraised: boolean;
  praisedAmount: number;
  praisedAnimations: UserInfoModel[];
  praisedAvatars: UserInfoModel[];
  reply: TimelineCommentModel[];
  createdAt: string;
}
