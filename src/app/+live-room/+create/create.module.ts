import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {CreateRoutingModule} from './create.route';
import {FileSelectorModule} from "../../shared/file-selector/file-selector.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {FormModule} from "../../shared/form/form.module";
import {CreateComponent} from "./create.component";
import {CreateGuard} from "../../shared/guard/create.guard";
import {UploadApiService} from "../../shared/api/upload/upload.api";
import {TimelineService} from "../timeline/timeline.service";

@NgModule({
  imports: [
    CreateRoutingModule,
    CommonModule,
    FileSelectorModule,
    LiveRoomTopBarModule,
    ReactiveFormsModule,
    FormModule,
  ],
  declarations: [
    CreateComponent
  ],
  providers: [
    UploadApiService,
    TimelineService,
    CreateGuard,
  ]
})

export class CreateModule {
}
