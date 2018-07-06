import { Component } from '@angular/core';
import {UtilsService} from "../utils/utils";
import {appConfig, host} from "../../../environments/environment";
import {ModalLink} from "../modal/modal.model";
import {ModalService} from "../../shared/modal/modal.service";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'download-app-tips',
  templateUrl: './download-app-tips.component.html',
  styleUrls: ['./download-app-tips.component.scss']
})

export class DownloadAppTipsComponent {
  isDownloadTipsShow = !UtilsService.isInApp;
  isiOS = UtilsService.isiOS;
  isAndroid = UtilsService.isAndroid;

  constructor (private modalService: ModalService, private sanitizer: DomSanitizer) {
  }

  redirectToYingYongBao() {
    location.href = appConfig.iosDownloadPage;
  }

  showDownloadModal() {
    const content = `<img style="max-width: 80vw; height: auto;" src="${host.assets}/assets/img/yingyongbao-ios-qrcode.png"><p>点击下载按钮或扫码，下载造就APP</p>`;
    const link = this.sanitizer.bypassSecurityTrustUrl(appConfig.iosDownloadPage);
    const target = '_target';
    const confirmLink = new ModalLink(link, target);
    this.modalService.popup(content, '取消', '下载', true, confirmLink);
  }
}
