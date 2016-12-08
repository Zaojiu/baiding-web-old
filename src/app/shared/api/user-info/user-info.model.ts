export class PermissionModel {
  publish: boolean;
}

export class UserInfoModel {
  uid: number;
  username: string;
  nick: string;
  avatar: string;
  intro: string;
  permissions: PermissionModel;
  isSubscribed: boolean;

  get canPublish(): boolean {
    return this.permissions.publish;
  }
}
export class UserDetailInfoModel {
  uid: number;
  username: string;
  nick = '';
  intro = '';
  avatar = '';
  sex = UserSex.Unknow;
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
