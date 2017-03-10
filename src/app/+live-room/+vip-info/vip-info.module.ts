import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VipInfoRoutingModule} from './vip-info.route';
import {VipInfoComponent} from './vip-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {AutofocusFirstInvalidInputModule} from "../../shared/first-invalid/first-invalid.module";
import {AutoresizeModule} from "../../shared/autoresize/autoresize.module";
import {FormModule} from "../../shared/form/form.module";
import {TimelineService} from "../timeline/timeline.service";

@NgModule({
  imports: [
    CommonModule,
    VipInfoRoutingModule,
    LiveRoomTopBarModule,
    ReactiveFormsModule,
    AutofocusFirstInvalidInputModule,
    FormsModule,
    FormModule,
    AutoresizeModule,
  ],
  declarations: [
    VipInfoComponent,
  ],
  providers: [
    TimelineService,
  ],
})

export class VipInfoModule {
}
