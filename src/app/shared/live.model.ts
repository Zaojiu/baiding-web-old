import { LiveStatus } from './live.enums';
import { UserInfoModel } from './user.model';

export class LiveModel {
  id: number;
  title: string;
  status: LiveStatus;
  user: UserInfoModel;
}
