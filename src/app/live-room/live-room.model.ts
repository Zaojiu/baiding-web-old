import { UserInfoModel } from '../shared/user-info/user-info.model';

export class LiveRoomInfoModel {
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
  status: string;
  praised: number;
  lcConvId: string;
}
