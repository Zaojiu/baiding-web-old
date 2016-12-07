import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {ROUTES} from './settings.route';
import {SettingsComponent} from "./settings.component";
import {PipeModule} from "../../shared/pipe/pipe.module";
import {SwitchBtnModule} from "../../shared/switch-btn/switch-btn.module";
import {FileSelectorModule} from "../../shared/file-selector/file-selector.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {FormModule} from "../../shared/form/form.module";
import {ViewInfoComponent} from "./view-info/view-info.component";
import {LiveRoomInfoUpperModule} from "../../shared/live-room-info-upper/live-room-info-upper.module";
import {AutofocusFirstInvalidInputModule} from "../../shared/first-invalid/first-invalid.module";
import {AutoresizeModule} from "../../shared/autoresize/autoresize.module";

@NgModule({
  imports: [
    ROUTES,
    CommonModule,
    PipeModule,
    SwitchBtnModule,
    FileSelectorModule,
    LiveRoomTopBarModule,
    ReactiveFormsModule,
    FormModule,
    LiveRoomInfoUpperModule,
    AutofocusFirstInvalidInputModule,
    AutoresizeModule,
  ],
  declarations: [
    SettingsComponent,
    EditInfoComponent,
    ViewInfoComponent,
  ],
})

export class SettingsModule {
}
