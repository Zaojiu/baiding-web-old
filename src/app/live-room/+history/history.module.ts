import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ROUTES } from './history.route';
import { HistoryComponent } from "./history.component";
import { PipeModule } from "../../shared/pipe/pipe.module";
import { AudioPlayerModule } from "../../shared/audio-player/audio-player.module";
import { ImageViewerModule } from "../../shared/image-viewer/image-viewer.module";

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    AudioPlayerModule,
    ImageViewerModule,
    ROUTES,
  ],
  declarations: [
    HistoryComponent,
  ],
})

export class HistoryModule {}
