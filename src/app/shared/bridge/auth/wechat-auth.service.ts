import {Injectable} from '@angular/core';
import {environment, host} from "../../../../environments/environment";
import {AuthBridge} from "../auth.interface";

@Injectable()
export class WechatAuthService implements AuthBridge {
  constructor() {
  }

  auth(redirectTo?: string) {
    redirectTo = redirectTo || location.href;
    if (redirectTo.startsWith('/')) redirectTo = `${host.self}${redirectTo}`;
    location.href = `${environment.config.host.auth}/oauth2/wechat/redirect?to=${encodeURIComponent(redirectTo)}`;
  }
}
