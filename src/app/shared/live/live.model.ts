import { LiveStatus } from './live.enums';
import { UserInfoModel } from '../user-info/user-info.model';

export class LiveInfoModel {
  id: string;
  subject: string;
  desc: string;
  kind: string;
  owner: UserInfoModel;
  admin: UserInfoModel;
  editors: UserInfoModel[];
  expectStartAt: string;
  expectDuration: number;
  startedAt: string;
  closedAt: string;
  createdAt: string;
  isDraft: boolean;
  status: LiveStatus;
  praised: number;
  commented: number;
  niced: number;
  shared: number;
  lcConvId: string;
}
