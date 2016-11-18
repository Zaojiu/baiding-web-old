import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {ShareBridge} from "../share.interface";
import {IosBridgeService} from "../../ios-bridge/ios-bridge.service";
import {LiveService} from "../../api/live/live.service";

declare var wx: any;

@Injectable()
export class IosShareService implements ShareBridge {
  constructor(private iosBridgeService: IosBridgeService, private liveService: LiveService) {
  }

  share(title: string, desc: string, cover: string, link: string, liveId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.iosBridgeService.hasInit) {
        this.iosBridgeService.bridge.callHandler('share', {title: title, desc: desc, cover: cover, link: link}, (result) => {
          this.liveService.confirmShare(liveId);
          resolve(result);
        }, (err) => {
          reject(err);
        });
      } else {
        this.iosBridgeService.init().then(() => {
          this.iosBridgeService.bridge.callHandler('share', {title: title, desc: desc, cover: cover, link: link}, (result) => {
            this.liveService.confirmShare(liveId);
            resolve(result);
          }, (err) => {
            reject(err);
          });
        });
      }
    });
  }
}
