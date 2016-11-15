import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {AuthBridge} from "../bridge/bridge.interface";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private authService: AuthBridge) {
  }

  canActivate() {
    return this.userInfoService.getUserInfo().then(() => {
      return true;
    }, () => {
      this.authService.auth(encodeURIComponent(window.location.href));
    });
  }
}
