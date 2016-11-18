import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {UserInfoModel, PermissionModel, UserPublicInfoModel, UserDetailInfoModel} from './user-info.model';
import {StoreService} from '../../store/store.service';
import {environment} from "../../../../environments/environment";


@Injectable()
export class UserInfoService {
  private userInfoUrl: string;
  private userPublicInfoUrl: string;
  private userDetailInfoUrl: string;

  constructor(private http: Http, private store: StoreService) {}

  getUserInfoCache(): UserInfoModel {
    return this.store.get('userinfo') as UserInfoModel;
  }

  parseUserInfo(data: any): UserInfoModel {
    let info = new UserInfoModel();
    info.nick = data.nick;
    info.avatar = data.avatar;
    info.uid = data.uid;
    info.permissions = new PermissionModel;
    info.permissions.publish = false;

    if (data.permissions && data.permissions.publish) {
      info.permissions.publish = true;
    }

    return info;

  }

  getUserInfo(needRefresh?: boolean): Promise<UserInfoModel> {
    let userInfoCache = this.store.get('userinfo') as UserInfoModel;
    if (userInfoCache && !needRefresh) {
      return Promise.resolve(userInfoCache);
    }

    return this.http.get(`${environment.config.host.io}/api/user`).toPromise()
      .then(res => {
        let data = res.json();
        let userInfo = this.parseUserInfo(data);
        this.store.set('userinfo', userInfo);
        (<any>window).ga('set', 'userId', userInfo.uid); // 登录用户增加ga的userId追踪
        return userInfo;
      });
  }


  getUserPublicInfo(uid: number): Promise<UserPublicInfoModel> {
    this.userPublicInfoUrl = `${environment.config.host.io}/api/user/${uid}`;

    return this.http.get(this.userPublicInfoUrl).toPromise()
      .then(res => {
        let data = res.json();
        return this.parseUserPublicInfo(data);
      });
  }

  parseUserPublicInfo(data: any): UserPublicInfoModel {
    let userPublicInfo = new UserPublicInfoModel();

    if (data.uid) userPublicInfo.uid = data.uid;
    if (data.sex) userPublicInfo.sex = data.sex;
    if (data.nick) userPublicInfo.nick = data.nick;
    if (data.avatar) userPublicInfo.avatar = data.avatar;
    if (data.realName) userPublicInfo.realName = data.realName;
    if (data.country) userPublicInfo.country = data.country;
    if (data.province) userPublicInfo.province = data.province;
    if (data.city) userPublicInfo.city = data.city;
    if (data.intro) userPublicInfo.intro = data.intro;

    return userPublicInfo;

  }

  getUserDetailInfo(uid: number): Promise<UserDetailInfoModel> {
    this.userDetailInfoUrl = `${environment.config.host.io}/api/user/detail`;

    return this.http.get(this.userDetailInfoUrl).toPromise()
      .then(res => {
        let data = res.json();
        return this.parseUserDetailInfo(data);
      });
  }

  parseUserDetailInfo(data: any): UserDetailInfoModel {
    let userDetailInfo = new UserDetailInfoModel();

    if (data.uid) userDetailInfo.uid = data.uid;
    if (data.nick) userDetailInfo.nick = data.nick;
    if (data.intro) userDetailInfo.intro = data.intro;
    if (data.avatar) userDetailInfo.avatar = data.avatar;
    if (data.sex) userDetailInfo.sex = data.sex;

    return userDetailInfo;

  }
}
