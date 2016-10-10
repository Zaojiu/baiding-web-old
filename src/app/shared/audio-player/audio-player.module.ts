import { NgModule } from '@angular/core';
import { AudioPlayerComponent } from "./audio-player.component";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
      CommonModule,
    ],
    declarations: [
      AudioPlayerComponent,
    ],
    exports: [
      AudioPlayerComponent,
    ],
  }
)

export class AudioPlayerModule {}
