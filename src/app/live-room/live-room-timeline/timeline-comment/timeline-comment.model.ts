import { TimelineCommentType, TimelineCommentUserType } from './timeline-comment.enum';

export class PraisedUserModel {
  uid: string;
  commentId: string;
  avatar: string;
}

export class TimelineCommentUserInfoModel {
  uid: string;
  nick: string;
  avatar: string;
  role: TimelineCommentUserType;
}

export class TimelineCommentModel {
  id: string;
  user: TimelineCommentUserInfoModel;
  content: string;
  type: TimelineCommentType;
  hadPraised: boolean;
  praisedAmout: number;
  praisedAnimations: PraisedUserModel[];
  praisedAvatars: PraisedUserModel[];
  firstReply: TimelineCommentModel;
  createdAt: string;
}
