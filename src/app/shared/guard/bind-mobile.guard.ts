import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {host} from "../../../environments/environment";

@Injectable()
export class BindMobileGuard implements CanActivate {
  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const to = `${host.self}${state.url}`;
    const userInfo = this.userInfoService.getUserInfoCache(to);

    if (!userInfo) return false;

    if (!userInfo.mobile.number) {
      this.router.navigate([`/signup`], {queryParams: {redirectTo: to}});
      return false;
    }

    return true;
  }
}
