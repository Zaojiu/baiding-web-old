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

export class UserPublicInfoModel {
  uid: number;
  sex: string;
  nick: string;
  avatar: string;
  realName: string;
  country: string;
  province: string;
  city: string;
}

export enum UserSex {
  Unknow = 0,
  Male,
  Female,
}
