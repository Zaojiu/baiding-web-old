import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';

@Injectable()
export class CreateGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService) {
  }

  canActivate() {
    return this.userInfoService.getUserInfo().then(userInfo => {
      return userInfo.permissions.publish;
    });
  }
}
