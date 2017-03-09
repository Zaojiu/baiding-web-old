import {Component, OnInit} from '@angular/core';

import {SharePopupService} from './share-popup.service';
import {UtilsService} from "../utils/utils";

@Component({
  selector: 'share-popup',
  templateUrl: './share-popup.component.html',
  styleUrls: ['./share-popup.component.scss']
})

export class SharePopupComponent implements OnInit {
  isPopup: boolean;
  isInWechat = UtilsService.isInWechat;
  isInWeb = !UtilsService.isInWechat && !UtilsService.isInApp;
  link: string;
  qrcodeGenerator: any;

  constructor(private sharePopupService: SharePopupService) {
  }

  ngOnInit() {
    // 此组件由于是全局组件，生命周期与app一样长，所以不需退订。
    this.sharePopupService.popup$.subscribe((link) => {
      if (this.isInWeb && !this.qrcodeGenerator) {
        System.import('yaqrcode').then(yaqrcode => {
          this.qrcodeGenerator = yaqrcode;
          this.link = link;
          this.isPopup = true;
        });
      } else {
        this.link = link;
        this.isPopup = true;
      }
    });
  }

  get getQrcode(): string {
    if (!this.qrcodeGenerator) return null;
    return this.qrcodeGenerator(this.link, {size: 240});
  }
}
