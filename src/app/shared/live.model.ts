import { LiveStatus } from './live.enums';
import { UserInfoModel } from './user-info.model';

export class LiveModel {
  id: number;
  title: string;
  status: LiveStatus;
  user: UserInfoModel;
}
