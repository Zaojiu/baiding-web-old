import { UserInfoModel } from '../user-info/user-info.model'

export class PostCommentModel {
  content: string;
  toUids: number[];
}

export class CommentModel {
  id: string;
  user: UserInfoModel;
  content: string;
  msgId: string;
  createdAt: string;
  toUsers: UserInfoModel[];
}
