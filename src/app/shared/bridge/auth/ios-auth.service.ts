import {Injectable} from '@angular/core';
import {AuthBridge} from "../auth.interface";
import {IosBridgeService} from "../../ios-bridge/ios-bridge.service";

@Injectable()
export class IosAuthService implements AuthBridge {
  constructor(private iosBridgeService: IosBridgeService) {
  }

  auth(redirectTo: string) {
    if (this.iosBridgeService.hasInit) {
      this.iosBridgeService.bridge.callHandler('login', {to: redirectTo}, (result) => {
        return;
      });

      return;
    }

    this.iosBridgeService.init().then(() => {
      this.iosBridgeService.bridge.callHandler('login', {to: redirectTo}, (result) => {
        return;
      });
    });
  }
}
