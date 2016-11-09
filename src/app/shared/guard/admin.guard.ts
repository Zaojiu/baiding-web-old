import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {LiveService} from "../api/live/live.service";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private liveService: LiveService) {
  }

  canActivate(route: ActivatedRouteSnapshot) {
    let liveId = route.params['id'];
    return Promise.all([this.liveService.getLiveInfo(liveId), this.userInfoService.getUserInfo()]).then((result) => {
      let userInfo = result[1];

      return this.liveService.isAdmin(liveId, userInfo.uid);
    });
  }
}
