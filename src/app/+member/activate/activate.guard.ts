import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../../shared/api/user-info/user-info.service';
import {host} from "../../../environments/environment";

@Injectable()
export class ActivateGuard implements CanActivate {
  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const to = `${host.self}${state.url}`;
    const userInfo = this.userInfoService.getUserInfoCache(state.url);

    if (!userInfo) return false;

    if (!userInfo.mobile.number) {
      this.router.navigate([`/signup`], {queryParams: {redirectTo: to}});
      return false;
    }

    if (userInfo.member.valid) {
      this.router.navigate(['/member/info']);
      return false;
    }

    return true;
  }
}
