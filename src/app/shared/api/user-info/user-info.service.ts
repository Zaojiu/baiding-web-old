import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {
  UserInfoModel, PermissionModel, UserPublicInfoModel, UserDetailInfoModel, MobileModel,
  WechatQrcodeModel, MemberModel
} from './user-info.model';
import {StoreService} from '../../store/store.service';
import {environment} from "../../../../environments/environment";
import {CustomHttp} from "../custom-http.service";
import {Router} from "@angular/router";

@Injectable()
export class UserInfoService {
  constructor(private http: CustomHttp, private router: Router) {
  }

  // 传 to 的话，代表userInfo没有的时候，需要跳转到singin页面
  getUserInfoCache(signInAndredirectTo?: string): UserInfoModel {
    const userInfo = StoreService.localStore.get('userinfo');

    if (!userInfo && signInAndredirectTo) {
      this.router.navigate(['/signin'], {queryParams: {redirectTo: signInAndredirectTo || location.href}});
    }

    if (userInfo) {
      return this.parseUserInfo(userInfo);
    }

    return null;
  }

  parseUserInfo(data: any): UserInfoModel {
    let info = new UserInfoModel();
    info.nick = data.nick;
    info.username = data.username || '';
    info.avatar = data.avatar;
    info.uid = data.uid;
    info.permissions = new PermissionModel;
    info.permissions.publish = data.permissions ? data.permissions.publish : false;
    info.isSubscribed = data.isSubscribed ? data.isSubscribed : false;
    info.mobile = new MobileModel;
    info.mobile.number = data.mobile && data.mobile.number ? data.mobile.number : '';
    info.mobile.updatedAt = data.mobile && data.mobile.updatedAt ? data.mobile.updatedAt : '';
    info.member = new MemberModel();
    info.member.valid = data.member ? data.member.valid : false;
    info.member.joinAt = data.member ? moment(data.member.joinAt) : null;
    info.member.expiredAt = data.member ? moment(data.member.expiredAt) : null;

    return info;

  }

  getUserInfo(autoHandleError = true): Promise<UserInfoModel> {
    return this.http.get(`${environment.config.host.io}/api/user`, {useIntercept: autoHandleError}).toPromise().then(res => {
      let data = res.json();
      let userInfo = this.parseUserInfo(data);
      StoreService.localStore.set('userinfo', userInfo);
      return userInfo;
    });
  }


  getUserPublicInfo(uid: number): Promise<UserPublicInfoModel> {
    let publicUserInfo = StoreService.get('publicUserInfo') || {};
    if (publicUserInfo[uid]) return Promise.resolve(publicUserInfo[uid]);

    return this.http.get(`${environment.config.host.io}/api/user/${uid}`).toPromise()
      .then(res => {
        let data = res.json();
        let info = this.parseUserPublicInfo(data);
        publicUserInfo[uid] = info;
        StoreService.set('publicUserInfo', publicUserInfo);
        return info;
      });
  }

  parseUserPublicInfo(data: any): UserPublicInfoModel {
    let userPublicInfo = new UserPublicInfoModel();

    if (data.uid) userPublicInfo.uid = data.uid;
    if (data.sex) userPublicInfo.sex = data.sex;
    if (data.username) userPublicInfo.username = data.username;
    if (data.nick) userPublicInfo.nick = data.nick;
    if (data.avatar) userPublicInfo.avatar = data.avatar;
    if (data.realName) userPublicInfo.realName = data.realName;
    if (data.country) userPublicInfo.country = data.country;
    if (data.province) userPublicInfo.province = data.province;
    if (data.city) userPublicInfo.city = data.city;
    if (data.intro) userPublicInfo.intro = data.intro;

    return userPublicInfo;

  }

  getUserDetailInfo(): Promise<UserDetailInfoModel> {
    return this.http.get(`${environment.config.host.io}/api/user/detail`).toPromise()
      .then(res => {
        let data = res.json();
        return this.parseUserDetailInfo(data);
      });
  }

  parseUserDetailInfo(data: any): UserDetailInfoModel {
    let userDetailInfo = new UserDetailInfoModel();

    if (data.uid) userDetailInfo.uid = data.uid;
    if (data.username) userDetailInfo.username = data.username;
    if (data.nick) userDetailInfo.nick = data.nick;
    if (data.intro) userDetailInfo.intro = data.intro;
    if (data.avatar) userDetailInfo.avatar = data.avatar;
    if (data.sex) userDetailInfo.sex = data.sex;
    if (data.realname) userDetailInfo.realname = data.realname;
    if (data.company) userDetailInfo.company = data.company;
    if (data.position) userDetailInfo.position = data.position;

    userDetailInfo.member = new MemberModel();
    userDetailInfo.member.valid = data.member ? data.member.valid : false;
    userDetailInfo.member.joinAt = data.member? moment(data.member.joinAt) : null;
    userDetailInfo.member.expiredAt = data.member ? moment(data.member.expiredAt) : null;

    return userDetailInfo;
  }

  postUserInfo(nick: string, intro: string): Promise<void> {
    const url = `${environment.config.host.io}/api/user/detail`;
    let data: { [key: string]: string } = {
      nick: nick,
      intro: intro,
    };

    return this.http.put(url, data).toPromise().then(() => {
      // 更新用户信息, 避免缓存数据不一致。
      return this.getUserInfo().then(() => {
        return
      });
    });
  }

  verifyUsername(username: string): Promise<void> {
    return this.http.post(`${environment.config.host.io}/api/user/username/verify`, {username: username}).toPromise()
      .then(() => {
        return;
      });
  }

  bindMobile(mobile: string, smsCode: string, password: string, name: string, company: string, title: string): Promise<void> {
    const url = `${environment.config.host.io}/api/user/mobile/bind`;
    const data = {
      mobile: mobile,
      password: password,
      code: smsCode,
      realname: name,
      company: company,
      position: title,
    };

    return this.http.post(url, data).toPromise().then(() => {
      return;
    });
  }

  signin(username: string, password: string, codeMap?: {[key: number]: string}): Promise<void> {
    const url = `${environment.config.host.io}/api/user/login`;
    const data: {[key: string]: string} = {username, password};
    return this.http.post(url, data, {customCodeMap: codeMap}).toPromise().then(() => {
      return this.getUserInfo(false);
    });
  }

  signup(mobile: string, code: string, codeMap?: {[key: number]: string}): Promise<void> {
    const url = `${environment.config.host.io}/api/user/login_or_register?useSms=true`;
    const data: {[key: string]: string} = {mobile, code};

    return this.http.post(url, data, {customCodeMap: codeMap}).toPromise().then(() => {
      return this.getUserInfo(false);
    });
  }

  resetPassword(mobile: string, code: string, password: string, codeMap?: {[key: number]: string}): Promise<void> {
    const url = `${environment.config.host.io}/api/user/login/reset`;
    const data = {
      mobile,
      password,
      code,
    };

    return this.http.post(url, data, {customCodeMap: codeMap}).toPromise().then(() => {
      return;
    });
  }

  getWechatSigninQrcode(redirectTo: string): Promise<WechatQrcodeModel> {
    const query = {
      device: 'web',
      to: redirectTo,
    };
    const url = `${environment.config.host.auth}/oauth2/wechat/redirect?${$.param(query)}`;
    return this.http.get(url).toPromise().then(res => {
      const data = res.json();
      return new WechatQrcodeModel(data);
    });
  }

  activateMember(code: string, wechat: string, realname: string, company: string, position: string): Promise<void> {
    const url = `${environment.config.host.io}/api/user/member/activate`;
    const data = {
      code: code,
      wechat: wechat,
      realname: realname,
      company: company,
      position: position,
    };

    return this.http.post(url, data).toPromise().then(() => {
      return;
    });
  }
}
