import {UserInfoModel} from '../user-info/user-info.model';

export class InvitationSummaryModel {
  name: string;
  desc: string;
  used: boolean;

  constructor(name = '', desc = '', used = false) {
    this.name = name;
    this.desc = desc;
    this.used = used;
  }
}

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
