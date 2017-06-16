import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {StreamInfoRoutingModule} from './stream-info.route';
import {StreamInfoComponent} from './stream-info.component';
import {FormModule} from "../../shared/form/form.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {FormsModule} from "@angular/forms";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";
import {TimelineService} from "../timeline/timeline.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StreamInfoRoutingModule,
    FormModule,
    LiveRoomTopBarModule,
    LoadingModule,
  ],
  declarations: [
    StreamInfoComponent,
  ],
  providers: [
    TimelineService,
  ],
})

export class StreamInfoModule {
}
