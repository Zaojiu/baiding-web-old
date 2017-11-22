export class PermissionModel {
  publish: boolean;

  constructor(permissions: any) {
    this.publish = permissions ? permissions.publish : false;
  }

}

export class MobileModel {
  number: string;
  updatedAt: string;

  constructor(mobile: any) {
    this.number = mobile ? mobile.number : '';
    this.updatedAt = mobile ? mobile.updateAt : '';
  }
}

export class MemberModel {
  valid: boolean;
  joinAt: Moment;
  expiredAt: Moment;

  constructor(member: any) {
    this.valid = member ? member.valid : false;
    this.joinAt = member ? moment(member.joinAt) : moment.unix(0);
    this.expiredAt = member ? moment(member.expiredAt) : moment.unix(0);
  }
}

export class UserInfoModel {
  uid: number;
  username: string;
  nick: string;
  avatar: string;
  permissions: PermissionModel;
  isSubscribed: boolean;
  mobile: MobileModel;
  member: MemberModel;

  constructor(data: any) {
    this.nick = data.nick;
    this.username = data.username;
    this.avatar = data.avatar;
    this.uid = data.uid;
    this.isSubscribed = data.isSubscribed ? data.isSubscribed : false;
    this.permissions = new PermissionModel(data.permissions);
    this.mobile = new MobileModel(data.mobile);
    this.member = new MemberModel(data.member);
  }

  get canPublish(): boolean {
    return this.permissions.publish;
  }

  get isMember(): boolean {
    return this.member.valid;
  }

  get isMobileBinded(): boolean {
    return this.mobile && !!this.mobile.number;
  }
}

export class WechatSigninQrcodeModel {
  appid: string;
  redirect_uri: string;
  state: string;
  response_type: string;
  wechat_uri: string;
  scope: string;
  self_redirect = false;

  constructor(data: any) {
    this.appid = data.appid;
    this.redirect_uri = data.redirect_uri;
    this.state = data.state;
    this.response_type = data.response_type;
    this.wechat_uri = data.wechat_uri;
    this.scope = data.scope;
  }
}

export enum UserSex {
  Unknow = 0,
  Male,
  Female,
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

  constructor(data: any) {
    if (data.uid) this.uid = data.uid;
    if (data.username) this.username = data.username;
    if (data.nick) this.nick = data.nick;
    if (data.intro) this.intro = data.intro;
    if (data.avatar) this.avatar = data.avatar;
    if (data.sex) this.sex = data.sex;
    if (data.realname) this.realname = data.realname;
    if (data.company) this.company = data.company;
    if (data.position) this.position = data.position;

    this.member = new MemberModel(data.member);
  }
}

export class UserPublicInfoModel {
  uid = 0;
  nick = '';
  avatar = '';

  constructor(data: any) {
    if (!data) return;

    this.uid = data.uid;;
    this.nick = data.nick;
    this.avatar = data.avatar;
  }
}
