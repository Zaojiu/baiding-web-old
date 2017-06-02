import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';

import {UserInfoService} from "../api/user-info/user-info.service";
import {UserInfoModel} from "../api/user-info/user-info.model";

@Injectable()
export class UserInfoResolver implements Resolve<UserInfoModel> {
  constructor(private userInfoService: UserInfoService) {
  }

  resolve(): Promise<UserInfoModel> {
    return this.userInfoService.getUserInfo().then((res) => {
      return res
    }, () => {
      return null;
    });
  }
}
