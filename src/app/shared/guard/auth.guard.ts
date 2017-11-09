import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {host} from "../../../environments/environment";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.userInfoService.getUserInfo().then(() => {
      return true;
    }, (err) => {
      const to = `${host.self}${state.url}`;
      if (err.status === 404) {
        this.router.navigate([`/404`]);
      } else if (err.status !== 401) {
        this.router.navigate([`/reload`], {queryParams: {redirectTo: to}});
      }

      this.router.navigate([`/signin`], {queryParams: {redirectTo: to}});
      return false;
    });
  }
}
