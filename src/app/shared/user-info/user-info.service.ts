import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { AppConfig } from '../../app.config'
import { UserInfoModel } from './user-info.model';
import { StoreService } from '../store/store.service';


@Injectable()
export class UserInfoService {
  private userInfoUrl: string;

  constructor (private http: Http, private config: AppConfig, private store: StoreService) {
    this.userInfoUrl = `${config.urlPrefix.auth}/api/user`;
  }

  goWechatAuth() {
    location.href = `${this.config.urlPrefix.auth}/oauth2/wechat/redirect?to=${encodeURIComponent(window.location.href)}`;
  }

  getUserInfo(needWechatAuth?: boolean, needRefresh?: boolean): Promise<UserInfoModel> {
    let userInfoCache = this.store.get('userinfo') as UserInfoModel;
    if ( userInfoCache && !needRefresh ) { return Promise.resolve(userInfoCache); }

    return this.http.get(this.userInfoUrl).toPromise()
      .then(res => {
        let userInfo = res.json() as UserInfoModel
        this.store.set('userinfo', userInfo)
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
}
