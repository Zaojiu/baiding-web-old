import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const to = `${location.protocol}//${location.hostname}${state.url}`;
    const userInfo = this.userInfoService.getUserInfoCache(to);
    return userInfo ? true : false;
  }
}
