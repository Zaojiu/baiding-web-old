import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { UserInfoModel } from './user-info.model'
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserInfoService {
  private userInfo: UserInfoModel;

  getUserInfo(needRefresh?: boolean): Promise<UserInfoModel> {
    if ( this.userInfo && !needRefresh ) { return Promise.resolve(this.userInfo); }

    this.userInfo = new UserInfoModel();
    this.userInfo.nick = '杜先生';
    this.userInfo.avatar = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
    this.userInfo.uid = '12345';

    return Promise.resolve(this.userInfo);
  }
}
