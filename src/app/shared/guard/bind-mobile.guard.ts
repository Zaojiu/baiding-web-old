import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {AuthBridge} from "../bridge/auth.interface";

@Injectable()
export class BindMobileGuard implements CanActivate {
  constructor(private userInfoService: UserInfoService, private authService: AuthBridge, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const to = `${location.protocol}//${location.hostname}${state.url}`;
    const innerTo = state.url;
    return this.userInfoService.getUserInfo().then(userInfo => {
      if (userInfo.mobile.number) return true;

      this.router.navigate([`/signup`], {queryParams: {redirectTo: innerTo}});

      return false;
    }, (err) => {
      if (err.status == 401) {
        this.authService.auth(to)
      } else {
        this.router.navigate([`/reload`], {queryParams: {backTo: to}});
      }
      return false;
    });
  }
}
