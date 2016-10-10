import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ImageViewerComponent} from '../image-viewer/image-viewer.component';
import {LoadingModule} from "../bd-loading/bd-loading.module";
import {PreviewComponent} from "./preview/preview.component";


@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
  ],
  declarations: [
    ImageViewerComponent,
    PreviewComponent,
  ],
  exports: [
    ImageViewerComponent,
    PreviewComponent,
  ],
})

export class ImageViewerModule {
}
