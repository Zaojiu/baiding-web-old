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
