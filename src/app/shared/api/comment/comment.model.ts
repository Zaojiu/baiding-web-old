import { UserInfoModel } from '../user-info/user-info.model'

export class PostCommentModel {
  content: string;
}

export class CommentModel {
  id: string;
  user: UserInfoModel;
  content: string;
  msgId: string;
  createdAt: string;
}
