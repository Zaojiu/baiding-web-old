import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VipInfoRoutingModule} from './vip-info.route';
import {VipInfoComponent} from './vip-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {FormModule} from "../../shared/form/form.module";
import {TimelineService} from "../timeline/timeline.service";
import {FileSelectorModule} from "../../shared/file-selector/file-selector.module";
import {UploadApiService} from "../../shared/api/upload/upload.api";

@NgModule({
  imports: [
    CommonModule,
    VipInfoRoutingModule,
    LiveRoomTopBarModule,
    ReactiveFormsModule,
    FormsModule,
    FormModule,
    FileSelectorModule,
  ],
  declarations: [
    VipInfoComponent,
  ],
  providers: [
    TimelineService,
    UploadApiService,
  ],
})

export class VipInfoModule {
}
