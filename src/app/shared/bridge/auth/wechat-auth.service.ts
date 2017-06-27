import {Injectable} from '@angular/core';
import {environment, host} from "../../../../environments/environment";
import {AuthBridge} from "../auth.interface";

@Injectable()
export class WechatAuthService implements AuthBridge {
  constructor() {
  }

  auth(redirectTo?: string) {
    redirectTo = redirectTo || encodeURIComponent(location.href);
    if (redirectTo.startsWith(encodeURIComponent('/'))) redirectTo = `${encodeURIComponent(host.self)}${redirectTo}`;
    if (redirectTo.startsWith('/')) redirectTo = encodeURIComponent(`${host.self}${redirectTo}`);
    location.href = `${environment.config.host.auth}/oauth2/wechat/redirect?to=${redirectTo}`;
  }
}
