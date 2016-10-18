import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { UserInfoService } from '../api/user-info/user-info.service';
import { WechatService } from '../wechat/wechat.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userInfoService: UserInfoService, private wechatService: WechatService) {}

  canActivate() {
    const needWechatAuth = this.wechatService.isInWechat()
    return Promise.all([this.userInfoService.getUserInfo(needWechatAuth), this.wechatService.initWechat()])
      .then(() => { return true })
  }
}
