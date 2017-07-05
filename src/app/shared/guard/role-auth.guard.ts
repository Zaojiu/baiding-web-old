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
    const liveId = route.parent.params['id'];

    return this.liveService.getLiveInfo(liveId).then(liveInfo => {
      const userInfo = this.userInfoService.getUserInfoCache(state.url);

      if (!userInfo) return false;

      if (liveInfo.isAudience(userInfo.uid) && liveInfo.isNeedPay && !liveInfo.paid) {
        this.router.navigate([`${state.url}/info`]);
        return false;
      }

      return true;
    }, (err) => {
      const to = `${location.protocol}//${location.hostname}${state.url}`;
      if (err.status === 404) {
        this.router.navigate([`/404`]);
      } else {
        this.router.navigate([`/reload`], {queryParams: {backTo: to}});
      }
      return false;
    });
  }
}
