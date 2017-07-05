import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../shared/api/user-info/user-info.service';

@Injectable()
export class SignupGuard implements CanActivate {
  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userInfo = this.userInfoService.getUserInfoCache(state.url);

    if (!userInfo) return false;

    if (userInfo.mobile.number) {
      this.router.navigateByUrl(state.url);
      return false;
    }

    return true;
  }
}
