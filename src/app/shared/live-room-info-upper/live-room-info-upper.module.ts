import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PipeModule} from "../pipe/pipe.module";
import {LiveRoomInfoUpperComponent} from "./live-room-info-upper.component";
import {LiveCoverModule} from "../live-cover/live-cover.module";

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    LiveCoverModule,
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
