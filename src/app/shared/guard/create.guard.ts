import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';

@Injectable()
export class CreateGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userInfo = this.userInfoService.getUserInfoCache(state.url);

    if (!userInfo) return false;

    return userInfo.permissions.publish;
  }
}
