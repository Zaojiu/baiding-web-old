import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ROUTES } from './history.route';
import { HistoryComponent } from "./history.component";
import { PipeModule } from "../../shared/pipe/pipe.module";
import { AudioPlayerModule } from "../../shared/audio-player/audio-player.module";
import { ImageViewerModule } from "../../shared/image-viewer/image-viewer.module";
import { LoadingModule } from "../../shared/bd-loading/bd-loading.module";

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    AudioPlayerModule,
    ImageViewerModule,
    LoadingModule,
    ROUTES,
  ],
  declarations: [
    HistoryComponent,
  ],
})

export class HistoryModule {}
