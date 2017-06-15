import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {AuthBridge} from "../bridge/auth.interface";
import {host} from "../../../environments/environment";

@Injectable()
export class GuestGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private authService: AuthBridge, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let redirectTo = decodeURIComponent(route.params['redirectTo'] || '/');
    redirectTo = redirectTo.replace(host.self, '');
    if (!redirectTo.startsWith('/')) redirectTo = '/';

    return this.userInfoService.getUserInfo(true).then(() => {
      this.router.navigateByUrl(redirectTo);
      return false;
    }, (err) => {
      if (err.status !== 401) {
        this.router.navigate([`/reload`], {queryParams: {backTo: redirectTo}});
      }
      return true;
    });
  }
}
