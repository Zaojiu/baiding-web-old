import {Injectable} from '@angular/core';
import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';
import {UserInfoService} from "../shared/api/user-info/user-info.service";
import {host} from "../../environments/environment";
import {UtilsService} from "../shared/utils/utils";
import {AuthBridge} from "../shared/bridge/auth.interface";

@Injectable()
export class SigninGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private router: Router, private authBridge: AuthBridge) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let redirectTo = route.queryParams['redirectTo'] || '/';
    redirectTo = redirectTo.replace(host.self, '');

    return this.userInfoService.getUserInfo(false).then(() => {
      this.router.navigateByUrl(redirectTo);
      return false;
    }, (err) => {
      if (err.status === 401) {
        if (UtilsService.isInApp || UtilsService.isInWechat) {
          redirectTo = location.href;
          this.authBridge.auth(redirectTo);
          return false;
        } else {
          return true;
        }
      } else {
        this.router.navigate([`/reload`], {queryParams: {backTo: redirectTo}});
        return false;
      }
    });
  }
}
