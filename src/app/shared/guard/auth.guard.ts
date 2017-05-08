import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {AuthBridge} from "../bridge/auth.interface";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private authService: AuthBridge) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let to = `${location.protocol}//${location.hostname}${state.url}`;
    return this.userInfoService.getUserInfo(true).then(() => {
      return true;
    }, (err) => {
      console.log(err);
      this.authService.auth(encodeURIComponent(to));
      return false;
    });
  }
}
