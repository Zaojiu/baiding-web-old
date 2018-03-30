import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {DownloadAppTipsComponent} from "./download-app-tips.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DownloadAppTipsComponent
  ],
  exports: [
    DownloadAppTipsComponent
  ]
})

export class DownloadAppTipsModule {
}
