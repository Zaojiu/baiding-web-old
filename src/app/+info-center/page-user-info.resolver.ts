import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';

import {UserInfoModel} from "../shared/api/user-info/user-info.model";
import {UserInfoService} from "../shared/api/user-info/user-info.service";

@Injectable()
export class PageUserInfoResolver implements Resolve<UserInfoModel>{
  constructor(private userInfoService: UserInfoService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<UserInfoModel> {
    let uid = route.params['uid'];

    return this.userInfoService.getUserPublicInfo(uid).then((res)=> {
      return res
    }, () => {
      this.router.navigate([`/404`]);
      return false;
    });
  }
}
