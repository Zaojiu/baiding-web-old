import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {ROUTES} from './create.route';
import {FileSelectorModule} from "../../shared/file-selector/file-selector.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {FormModule} from "../../shared/form/form.module";
import {CreateComponent} from "./create.component";
import {CreateGuard} from "../../shared/guard/create.guard";
import {AutofocusFirstInvalidInputModule} from "../../shared/first-invalid/first-invalid.module";

@NgModule({
  imports: [
    ROUTES,
    CommonModule,
    FileSelectorModule,
    LiveRoomTopBarModule,
    ReactiveFormsModule,
    AutofocusFirstInvalidInputModule,
    FormModule,
  ],
  declarations: [
    CreateComponent
  ],
  providers: [
    CreateGuard,
  ]
})

export class CreateModule {
}
