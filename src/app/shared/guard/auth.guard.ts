import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';
import {host} from "../../../environments/environment";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const to = `${host.self}${state.url}`;
    const userInfo = this.userInfoService.getUserInfoCache(to);
    return userInfo ? true : false;
  }
}
