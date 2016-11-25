import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';

import {ShareBridge} from "../share.interface";
import {SharePopupService} from "../../share-popup/share-popup.service";

@Injectable()
export class PcShareService implements ShareBridge {
  title: string;
  desc: string;
  cover: string;
  link: string;
  liveId?: string;

  constructor(private sharePopupService: SharePopupService) {
  }

  setShareInfo(title: string, desc: string, cover: string, link: string, liveId?: string) {}

  share() {
    this.sharePopupService.popup((<any>window).localtion.href);
  }
}
