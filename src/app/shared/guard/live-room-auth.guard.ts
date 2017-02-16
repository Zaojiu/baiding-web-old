import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Routes, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {AuthBridge} from "../bridge/auth.interface";
import {LiveService} from "../api/live/live.service";
import {LiveInfoModel} from "../api/live/live.model";

@Injectable()
export class RoleAuthGuard implements CanActivate {
  liveInfo: LiveInfoModel;

  constructor(private userInfoService: UserInfoService, private liveService: LiveService,
              private authService: AuthBridge, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let to = `${location.protocol}//${location.hostname}${state.url}`;

    return this.userInfoService.getUserInfo().then((userInfo) => {
      if (route && route.params['id']) {
        return this.liveService.getLiveInfo(route.params['id']).then((liveInfo) => {
          this.liveInfo = liveInfo
          return !this.liveInfo.isAudience(userInfo.uid)
        })
      } else {
        return true
      }
    }, () => {
      this.authService.auth(encodeURIComponent(to));
      return false;
    });
  }
}
