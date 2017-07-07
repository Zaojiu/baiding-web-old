export class WechatQrcodeModel {
  appid: string;
  redirect_uri: string;
  state: string;
  response_type: string;
  wechat_uri: string;
  scope: string;
  self_redirect = false;

  constructor(data) {
    this.appid = data.appid;
    this.redirect_uri = data.redirect_uri;
    this.state = data.state;
    this.response_type = data.response_type;
    this.wechat_uri = data.wechat_uri;
    this.scope = data.scope;
  }
}

export class PermissionModel {
  publish: boolean;
}

export class MobileModel {
  number: string;
  updatedAt: string;
}

export class MemberModel {
  valid: boolean;
  joinAt: Moment;
  expiredAt: Moment;
}

export class UserInfoModel {
  uid: number;
  username: string;
  nick: string;
  avatar: string;
  intro: string;
  permissions: PermissionModel;
  isSubscribed: boolean;
  mobile: MobileModel;
  member: MemberModel;

  get canPublish(): boolean {
    return this.permissions.publish;
  }

  get isMember(): boolean {
    return this.member.valid;
  }
}
export class UserDetailInfoModel {
  uid: number;
  username: string;
  nick = '';
  intro = '';
  avatar = '';
  sex = UserSex.Unknow;
  member: MemberModel;
  realname: string;
  company: string;
  position: string;
}

export class UserPublicInfoModel {
  uid: number;
  username: string;
  sex = UserSex.Unknow;
  nick = '';
  avatar = '';
  realName = '';
  country = '';
  province = '';
  city = '';
  intro = '';


  get userSex(): string {
    switch (this.sex) {
      case UserSex.Unknow:
        return '未知';
      case UserSex.Male:
        return '男';
      case UserSex.Female:
        return '女';
      default:
        return '未知';
    }
  }
}

export enum UserSex {
  Unknow = 0,
  Male,
  Female,
}
