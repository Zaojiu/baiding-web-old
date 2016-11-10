export class PermissionModel {
  publish: boolean;
}

export class UserInfoModel {
  uid: number;
  nick: string;
  avatar: string;
  permissions: PermissionModel;

  get canPublish(): boolean {
    return this.permissions.publish;
  }
}
