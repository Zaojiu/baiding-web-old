import {Injectable} from '@angular/core';
import {AuthBridge} from "../auth.interface";
import {IosBridgeService} from "../../ios-bridge/ios-bridge.service";

@Injectable()
export class IosAuthService implements AuthBridge {
  constructor(private iosBridgeService: IosBridgeService) {
  }

  auth(redirectTo?: string) {
    let query = redirectTo ? {to: redirectTo} : null;

    if (this.iosBridgeService.hasInit) {
      this.iosBridgeService.bridge.callHandler('login', query, (result) => {
        return;
      });

      return;
    }

    this.iosBridgeService.init().then(() => {
      this.iosBridgeService.bridge.callHandler('login', query, (result) => {
        return;
      });
    });
  }
}
