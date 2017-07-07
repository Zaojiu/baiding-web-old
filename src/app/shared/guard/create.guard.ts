import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {UserInfoService} from '../api/user-info/user-info.service';

@Injectable()
export class CreateGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.userInfoService.getUserInfo(false).then(userInfo => {
      if (!userInfo.permissions.publish) {
        this.router.navigate(['/lives/apply']);
      }

      return userInfo.permissions.publish;
    }, () => {
      return false;
    });
  }
}
