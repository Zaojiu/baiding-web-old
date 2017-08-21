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
  joinAt: Moment|null;
  expiredAt: Moment|null;

  constructor(member: any) {
    this.valid = member ? member.valid : false;
    this.joinAt = member ? moment(member.joinAt) : null;
    this.expiredAt = member ? moment(member.expiredAt) : null;
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
