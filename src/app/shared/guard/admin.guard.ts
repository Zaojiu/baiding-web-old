import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {LiveService} from "../api/live/live.service";
import {LiveInfoModel} from "../api/live/live.model";
import {UserInfoModel} from "../api/user-info/user-info.model";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private liveService: LiveService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let liveId = route.params['id'];
    const to = `${location.protocol}//${location.hostname}${state.url}`;

    if (!liveId) {
      let parent = route.parent;

      while (parent) {
        liveId = parent.params['id'];
        if (liveId) break;
        parent = parent.parent;
      }

      if (!liveId) {
        this.router.navigate([`/404`]);
        return Promise.resolve(false);
      }
    }

    return this.liveService.getLiveInfo(liveId).then(liveInfo => {
      const userInfo = this.userInfoService.getUserInfoCache(to);

      if (!userInfo) return false;

      return liveInfo.isAdmin(userInfo.uid);
    }, (err) => {

      if (err.status == 404) {
        this.router.navigate([`/404`]);
      } else {
        this.router.navigate([`/reload`], {queryParams: {redirectTo: to}});
      }
      return false;
    });
  }
}
