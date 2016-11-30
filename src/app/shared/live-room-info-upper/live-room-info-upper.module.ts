import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PipeModule} from "../pipe/pipe.module";
import {LiveRoomInfoUpperComponent} from "./live-room-info-upper.component";
import {CountDownModule} from "../countdown/countdown.module";

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    CountDownModule,
  ],
  declarations: [
    LiveRoomInfoUpperComponent,
  ],
  exports: [
    LiveRoomInfoUpperComponent,
  ],
})

export class LiveRoomInfoUpperModule {
}
