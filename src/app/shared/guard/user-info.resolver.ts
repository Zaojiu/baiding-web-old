import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';

import {UserInfoService} from "../api/user-info/user-info.service";

@Injectable()
export class UserInfoResolver implements Resolve<any>{
  constructor(private userInfoService: UserInfoService) {
  }

  resolve() {
    return this.userInfoService.getUserInfo().then((res)=> {
      return res
    });
  }
}
