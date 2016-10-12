import { NgModule } from '@angular/core';
import { AudioPlayerComponent } from "./audio-player.component";
import { WavingProgressComponent } from "./waving-progress.component";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
      CommonModule,
    ],
    declarations: [
      AudioPlayerComponent,
      WavingProgressComponent
    ],
    exports: [
      AudioPlayerComponent,
    ],
  }
)

export class AudioPlayerModule {}
