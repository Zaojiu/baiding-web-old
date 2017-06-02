import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {AuthBridge} from "../bridge/auth.interface";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private authService: AuthBridge, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const to = encodeURIComponent(`${location.protocol}//${location.hostname}${state.url}`);
    return this.userInfoService.getUserInfo(true).then(() => {
      return true;
    }, (err) => {
      if (err.status == 401) {
        this.authService.auth(to)
      } else {
        this.router.navigate([`/reload`], {queryParams: {backTo: to}});
      }
      this.authService.auth(to);
      return false;
    });
  }
}
