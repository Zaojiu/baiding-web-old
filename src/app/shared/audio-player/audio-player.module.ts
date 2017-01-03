import {NgModule} from '@angular/core';
import {AudioPlayerComponent} from "./audio-player.component";
import {WavingProgressComponent} from "./waving-progress.component";
import {CommonModule} from "@angular/common";
import {PlayingBtnComponent} from "./playing-btn.component";
import {AudioPlayerSmallComponent} from "./audio-player-small.component";
import {AudioPlayerService} from "./audio-player.service";
import {AudioListPlayerComponent} from "./audio-list-player.component";

@NgModule({
    imports: [
      CommonModule,
    ],
    declarations: [
      AudioPlayerComponent,
      AudioPlayerSmallComponent,
      WavingProgressComponent,
      PlayingBtnComponent,
      AudioListPlayerComponent,
    ],
    exports: [
      AudioPlayerComponent,
      AudioPlayerSmallComponent,
      AudioListPlayerComponent,
    ],
    providers: [
      AudioPlayerService,
    ]
  }
)

export class AudioPlayerModule {
}
