import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserInfoService} from "../../shared/api/user-info/user-info.service";

@Injectable()
export class ApplyGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.userInfoService.getUserInfo().then(userInfo => {
      if (userInfo.permissions.publish) {
        this.router.navigate(['/lives/create']);
      }

      return !userInfo.permissions.publish;
    }, () => {
      return false;
    });
  }
}
