import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {UserInfoModel, PermissionModel, UserPublicInfoModel, UserDetailInfoModel} from './user-info.model';
import {StoreService} from '../../store/store.service';
import {environment} from "../../../../environments/environment";
import {Router} from "@angular/router";


@Injectable()
export class UserInfoService {

  constructor(private http: Http, private router: Router, private store: StoreService) {
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
    info.permissions.publish = data.permissions ? data.permissions.publish : false;

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
    return this.http.get(`${environment.config.host.io}/api/user/${uid}`).toPromise()
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
    return this.http.get(`${environment.config.host.io}/api/user/detail`).toPromise()
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

  postUserInfo(nameContent: string, introContent: string): Promise<void> {
    let headers = new Headers({'Content-Type': 'application/json'});
    const url = `${environment.config.host.io}/api/user/detail`;
    let user = new UserInfoModel();
    user.nick = nameContent;
    user.intro = introContent;
    return this.http.put(url, JSON.stringify(user), {headers: headers}).toPromise().then((res)=> {
      return;
    });
  }
}
