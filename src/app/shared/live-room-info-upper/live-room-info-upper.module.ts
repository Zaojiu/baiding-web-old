import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PipeModule} from "../pipe/pipe.module";
import {LiveRoomInfoUpperComponent} from "./live-room-info-upper.component";

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
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
