import { TimelineCommentType } from './timeline-comment.enum';
import { UserInfoModel } from '../../../shared/user-info/user-info.model'

export class TimelineCommentAudioModel {
  localId: string;
  serverId: string;
  translateResult: string;
}

export class TimelineCommentReplyModel {
  id: string;
  parentId: string;
  user: UserInfoModel;
  content: string;
  createdAt: string;
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
  praisedAnimations: UserInfoModel[] = [];
  praisedAvatars: UserInfoModel[] = [];
  replies: TimelineCommentReplyModel[] = [];
  createdAt: string;

  getPraisedAvatars(currentUser: UserInfoModel) {
    let avatars = this.praisedAvatars.filter((item, index) => item.uid != currentUser.uid)
    if (this.hadPraised) {
      avatars = avatars.slice(0, 4)
      avatars.push(currentUser)
    } else {
      avatars = avatars.slice(0, 5)
    }
    return avatars
  }

  pushPraisedUser(user: UserInfoModel) {
    this.praisedAnimations.push(user)
    console.log(this.praisedAvatars)
    this.praisedAvatars.unshift(user)
    if (this.praisedAvatars.length > 5) {
      this.praisedAvatars.pop()
    }
  }
}
