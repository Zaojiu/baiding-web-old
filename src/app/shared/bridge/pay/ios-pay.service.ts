import {Injectable} from '@angular/core';
import {PayBridge} from "../pay.interface";
import {IosBridgeService} from "../../ios-bridge/ios-bridge.service";

@Injectable()
export class IosPayService implements PayBridge {
  constructor(private iosBridgeService: IosBridgeService) {
  }

  pay(redirectTo: string): Promise<string> {
    return Promise.resolve('');
  }
}
