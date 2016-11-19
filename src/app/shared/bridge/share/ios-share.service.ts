import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {ShareBridge} from "../share.interface";
import {IosBridgeService} from "../../ios-bridge/ios-bridge.service";
import {LiveService} from "../../api/live/live.service";

@Injectable()
export class IosShareService implements ShareBridge {
  title: string;
  desc: string;
  cover: string;
  link: string;
  liveId?: string;

  constructor(private iosBridgeService: IosBridgeService, private liveService: LiveService) {
  }

  setShareInfo(title: string, desc: string, cover: string, link: string, liveId?: string) {
    this.title = title;
    this.desc = desc;
    this.cover = cover;
    this.link = link;
    this.liveId = liveId;
  }

  share(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.iosBridgeService.hasInit) {
        this.iosBridgeService.bridge.callHandler('share', {title: this.title, desc: this.desc, cover: this.cover, link: this.link}, (result) => {
          this.liveService.confirmShare(this.liveId);
          resolve(result);
        }, (err) => {
          reject(err);
        });
      } else {
        this.iosBridgeService.init().then(() => {
          this.iosBridgeService.bridge.callHandler('share', {title: this.title, desc: this.desc, cover: this.cover, link: this.link}, (result) => {
            this.liveService.confirmShare(this.liveId);
            resolve(result);
          }, (err) => {
            reject(err);
          });
        });
      }
    });
  }
}
