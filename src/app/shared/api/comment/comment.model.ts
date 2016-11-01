import { UserInfoModel } from '../user-info/user-info.model'

export class PostCommentModel {
  content: string;
  toUids: number[];
}

export enum CommentType {
  Text = 0,
  AudienceJoined,
  CommentPushed
}

export class CommentModel {
  id: string;
  user: UserInfoModel;
  content: string;
  type: CommentType;
  eventData: any = null;
  msgId: string;
  createdAt: string;
  toUsers: UserInfoModel[] = [];
  toUids: number[] = [];
}
