import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {VideoPlayerComponent} from "./video-player.component";
import {CountDownModule} from "../countdown/countdown.module";

@NgModule({
  imports: [
    CommonModule,
    CountDownModule,
  ],
  declarations: [
    VideoPlayerComponent,
  ],
  exports: [
    VideoPlayerComponent,
  ],
})

export class VideoPlayerModule {
}
