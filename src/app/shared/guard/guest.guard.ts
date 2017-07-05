import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {host} from "../../../environments/environment";

@Injectable()
export class GuestGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let redirectTo = route.params['redirectTo'] || '/';
    redirectTo = redirectTo.replace(host.self, '');
    if (!redirectTo.startsWith('/')) redirectTo = '/';

    const userInfo = this.userInfoService.getUserInfoCache();
    if (userInfo) {
      this.router.navigateByUrl(redirectTo);
      return false;
    }

    return true;
  }
}
