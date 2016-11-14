import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {UserInfoModel, PermissionModel, UserPublicInfoModel} from './user-info.model';
import {StoreService} from '../../store/store.service';
import {environment} from "../../../../environments/environment";


@Injectable()
export class UserInfoService {
  private userInfoUrl: string;
  private userPublicInfoUrl: string;

  constructor(private http: Http, private store: StoreService) {}

  goWechatAuth() {
    location.href = `${environment.config.host.auth}/oauth2/wechat/redirect?to=${encodeURIComponent(window.location.href)}`;
  }

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

  getUserInfo(needWechatAuth?: boolean, needRefresh?: boolean): Promise<UserInfoModel> {
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
      })
      .catch(res => {
        if (+res.status === 401) {
          if (needWechatAuth) {
            this.goWechatAuth();
          } else {
            // TODO: pc auth;
          }
        } else {
          // TODO: error;
        }
        return Promise.reject(res);
      });
  }

  getUserPublicInfo(userUid: number): Promise<UserPublicInfoModel> {
    this.userPublicInfoUrl = `${environment.config.host.io}/api/user/${userUid}`;

    return this.http.get(this.userPublicInfoUrl).toPromise()
      .then(res => {
        let data = res.json();
        return this.parseUserPublicInfo(data);
      })
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

    return userPublicInfo;

  }
}
