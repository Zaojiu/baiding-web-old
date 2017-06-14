import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {FileSelectorModule} from "../../shared/file-selector/file-selector.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {FormModule} from "../../shared/form/form.module";
import {ApplyRoutingModule} from "./apply.route";
import {ApplyComponent} from "./apply.component";
import {ApplyApiService} from "../../shared/api/apply/apply.service";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";
import {TimelineService} from "../timeline/timeline.service";

@NgModule({
  imports: [
    ApplyRoutingModule,
    CommonModule,
    FileSelectorModule,
    LiveRoomTopBarModule,
    ReactiveFormsModule,
    FormModule,
    LoadingModule,
  ],
  declarations: [
    ApplyComponent
  ],
  providers: [
    TimelineService,
    ApplyApiService,
  ]
})

export class ApplyModule {
}
