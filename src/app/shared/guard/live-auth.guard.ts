import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {host} from "../../../environments/environment";
import {LiveService} from "../api/live/live.service";

@Injectable()
export class LiveAuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService,
              private liveService: LiveService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const liveId = route.params['id'];
    const to = `${host.self}${state.url}`;

    return this.liveService.getLiveInfo(liveId).then(liveInfo => {
      const userInfo = this.userInfoService.getUserInfoCache();

      if (!liveInfo) return false;

      switch (liveInfo.requirement) {
        case 0:
          return true;
        case 1:
          if (userInfo) {
            return true;
          } else {
            this.router.navigate([`/signin`], {queryParams: {redirectTo: to}});
            return false;
          }
        case 3:
          if (userInfo && userInfo.mobile.number) {
            return true;
          } else {
            this.router.navigate([`/signup`], {queryParams: {redirectTo: to}});
            return false;
          }
        default:
          return true;
      }

    }, (err) => {
      if (err.status === 404) {
        this.router.navigate([`/404`]);
      } else if (err.status !== 401) {
        this.router.navigate([`/reload`], {queryParams: {redirectTo: to}});
        this.router.navigate([`/signin`], {queryParams: {redirectTo: to}});
        return false;
      }
    });
  }
}
