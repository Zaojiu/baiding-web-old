import {NgModule} from '@angular/core';
import {AudioPlayerComponent} from "./audio-player.component";
import {WavingProgressComponent} from "./waving-progress.component";
import {CommonModule} from "@angular/common";
import {AudioPlayerSmallComponent} from "./audio-player-small.component";
import {AudioPlayerService} from "./audio-player.service";
import {AudioListPlayerComponent} from "./audio-list-player.component";
import {SinglePlayerComponent} from "./single-player.component";
import {LoadingModule} from "../bd-loading/bd-loading.module";

@NgModule({
    imports: [
      CommonModule,
      LoadingModule,
    ],
    declarations: [
      AudioPlayerComponent,
      AudioPlayerSmallComponent,
      WavingProgressComponent,
      AudioListPlayerComponent,
      SinglePlayerComponent,
    ],
    exports: [
      AudioPlayerComponent,
      AudioPlayerSmallComponent,
      AudioListPlayerComponent,
      SinglePlayerComponent,
    ],
    providers: [
      AudioPlayerService,
    ]
  }
)

export class AudioPlayerModule {
}
