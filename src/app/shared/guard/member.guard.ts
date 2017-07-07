import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';

@Injectable()
export class MemberGuard implements CanActivate {
  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userInfo = this.userInfoService.getUserInfoCache(state.url);

    if (!userInfo) return false;

    if (!userInfo.member.valid) {
      this.router.navigate(['/member/activate']);
      return false;
    }

    return true;
  }
}
