import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {StreamInfoRoutingModule} from './stream-info.route';
import {StreamInfoComponent} from './stream-info.component';
import {FormModule} from "../../shared/form/form.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {FormsModule} from "@angular/forms";
import {AutoresizeModule} from "../../shared/autoresize/autoresize.module";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StreamInfoRoutingModule,
    FormModule,
    LiveRoomTopBarModule,
    AutoresizeModule,
    LoadingModule,
  ],
  declarations: [
    StreamInfoComponent,
  ],
})

export class StreamInfoModule {
}
