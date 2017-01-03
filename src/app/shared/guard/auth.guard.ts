import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {AuthBridge} from "../bridge/auth.interface";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private authService: AuthBridge) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let to = `${location.protocol}//${location.hostname}${state.url}`;
    return this.userInfoService.getUserInfo().then(() => {
      return true;
    }, () => {
      this.authService.auth(encodeURIComponent(to));
      return false;
    });
  }
}
