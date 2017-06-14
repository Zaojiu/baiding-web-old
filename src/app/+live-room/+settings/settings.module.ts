import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {SettingsRoutingModule} from './settings.route';
import {SettingsComponent} from "./settings.component";
import {PipeModule} from "../../shared/pipe/pipe.module";
import {SwitchBtnModule} from "../../shared/switch-btn/switch-btn.module";
import {FileSelectorModule} from "../../shared/file-selector/file-selector.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {FormModule} from "../../shared/form/form.module";
import {ViewInfoComponent} from "./view-info/view-info.component";
import {LiveRoomInfoUpperModule} from "../../shared/live-room-info-upper/live-room-info-upper.module";
import {LiveRoomService} from "../live-room.service";
import {TimelineService} from "../timeline/timeline.service";
import {UploadApiService} from "../../shared/api/upload/upload.api";

@NgModule({
  imports: [
    SettingsRoutingModule,
    CommonModule,
    PipeModule,
    SwitchBtnModule,
    FileSelectorModule,
    LiveRoomTopBarModule,
    ReactiveFormsModule,
    FormModule,
    LiveRoomInfoUpperModule,
  ],
  declarations: [
    SettingsComponent,
    EditInfoComponent,
    ViewInfoComponent,
  ],
  providers: [
    LiveRoomService,
    TimelineService,
    UploadApiService,
  ],
})

export class SettingsModule {
}
