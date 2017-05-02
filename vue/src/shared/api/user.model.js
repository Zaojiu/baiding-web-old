export class PermissionModel {
  constructor(publish) {
    this.publish = publish;
  }
}

export class UserInfoModel {
  constructor(data) {
    this.nick = data.nick;
    this.username = data.username;
    this.avatar = data.avatar;
    this.uid = data.uid;
    this.permissions = new PermissionModel(data.permissions ? data.permissions.publish : false);
    this.isSubscribed = data.isSubscribed ? data.isSubscribed : false;
  }

  get canPublish() {
    return this.permissions.publish;
  }
}
