import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {LiveService} from "../api/live/live.service";
import {host} from "../../../environments/environment";
import {UserInfoService} from '../api/user-info/user-info.service';

@Injectable()
export class GuestLiveGuard implements CanActivate {
  constructor(private userInfoService: UserInfoService, private liveService: LiveService,
              private router: Router) {
  }

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const liveId = route.parent.params['id'];

    return this.liveService.getLiveInfo(liveId).then(liveInfo => {

      if ( liveInfo.isNeedPay && !liveInfo.paid) {
        this.router.navigate([`/lives/${liveId}/info`]);
        return false;
      }

      return true;
    }, (err) => {
      const to = `${host.self}${state.url}`;
      if (err.status === 404) {
        this.router.navigate([`/404`]);
      } else if (err.status !== 401) {
        this.router.navigate([`/reload`], {queryParams: {redirectTo: to}});
      }
      return false;
    });
  }
}
