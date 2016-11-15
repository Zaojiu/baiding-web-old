import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";

@Injectable()
export class WechatAuthService {
  constructor() {}

  auth(redirectTo: string) {
    location.href = `${environment.config.host.auth}/oauth2/wechat/redirect?to=${redirectTo}`;
  }
}
