import { Component } from '@angular/core';
import {UtilsService} from "../utils/utils";

@Component({
  selector: 'download-tips',
  templateUrl: './download-tips.component.html',
  styleUrls: ['./download-tips.component.scss']
})

export class DownloadTipsComponent {
  isDownloadTipsShow = !UtilsService.isAndroid && !UtilsService.isInApp;
  isiOS = UtilsService.isiOS;
  isAndroid = UtilsService.isAndroid;

  constructor () {
  }
}
