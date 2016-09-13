import { UserInfoModel } from '../../shared/user-info/user-info.model'

export class CommentModel {
  id: string;
  user: UserInfoModel;
  content: string;
  msgId: string;
  createdAt: string;
}
