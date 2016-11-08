import {UserInfoModel} from '../user-info/user-info.model';

export class InvitationModel {
  id: string;
  name: string;
  desc: string;
  userInfo: UserInfoModel;
  token: string;
}

export class PostInvitationModel {
  name: string;
  desc: string;

}

export class AudienceInvitationModel {
  id: string;
  name: string;
  desc: string;
  userInfo: UserInfoModel;
}
