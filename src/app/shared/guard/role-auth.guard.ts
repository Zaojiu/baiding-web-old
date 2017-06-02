import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Routes, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {AuthBridge} from "../bridge/auth.interface";
import {LiveService} from "../api/live/live.service";

@Injectable()
export class RoleAuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private liveService: LiveService,
              private authService: AuthBridge, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let liveId = route.parent.params['id'];

    return this.userInfoService.getUserInfo().then((userInfo) => {
      return this.liveService.getLiveInfo(liveId).then((liveInfo) => {
        if (liveInfo.isAudience(userInfo.uid) && liveInfo.isNeedPay && !liveInfo.paid) {
          this.router.navigate([`${state.url}/info`]);
          return false;
        }

        return true;
      })
    }, (err) => {
      const to = encodeURIComponent(`${location.protocol}//${location.hostname}${state.url}/info`);
      if (err.status === 401) {
        this.authService.auth(to)
      } else if (err.status === 404) {
        this.router.navigate([`/404`]);
      } else {
        this.router.navigate([`/reload`], {queryParams: {backTo: to}});
      }
      this.authService.auth(to);
      return false;
    });
  }
}
