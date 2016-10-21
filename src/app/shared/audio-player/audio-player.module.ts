import {NgModule} from '@angular/core';
import {AudioPlayerComponent} from "./audio-player.component";
import {WavingProgressComponent} from "./waving-progress.component";
import {CommonModule} from "@angular/common";
import {PlayingBtnComponent} from "./playing-btn.component";

@NgModule({
    imports: [
      CommonModule,
    ],
    declarations: [
      AudioPlayerComponent,
      WavingProgressComponent,
      PlayingBtnComponent
    ],
    exports: [
      AudioPlayerComponent,
    ],
  }
)

export class AudioPlayerModule {
}
