import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {AuthBridge} from "../auth.interface";

@Injectable()
export class PcAuthService implements AuthBridge {
  constructor() {
  }

  auth(redirectTo: string) {
    location.href = `${environment.config.host.auth}/oauth2/wechat/redirect?device=web&to=${redirectTo}`;
  }
}
