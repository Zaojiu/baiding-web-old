import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {LiveService} from "../api/live/live.service";
import {LiveInfoModel} from "../api/live/live.model";
import {UserInfoModel} from "../api/user-info/user-info.model";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private liveService: LiveService) {
  }

  canActivate(route: ActivatedRouteSnapshot) {
    let liveId = route.params['id'];

    return Promise.all<LiveInfoModel, UserInfoModel>([this.liveService.getLiveInfo(liveId), this.userInfoService.getUserInfo()]).then((result) => {
      let liveInfo = result[0];
      let userInfo = result[1];

      return liveInfo.isAdmin(userInfo.uid);
    });
  }
}
