import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';

import {UserInfoService} from '../shared/api/user-info/user-info.service';

@Injectable()
export class SignupGuard implements CanActivate {
  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.userInfoService.getUserInfo().then(userInfo => {
      if (userInfo.mobile.number) {
        if (!this.router.navigated) this.router.navigate(['/lives']);
        return false;
      }

      return true;
    });
  }
}
