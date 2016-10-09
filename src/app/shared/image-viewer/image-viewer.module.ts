import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ROUTES } from './image-viewer.route';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { LoadingModule } from "../bd-loading/bd-loading.module";


@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
    ROUTES,
  ],
  declarations: [
    ImageViewerComponent,
  ],
})

export class ImageViewerModule {}
