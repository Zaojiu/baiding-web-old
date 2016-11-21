import {NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {ROUTES} from './info-center.route';
import {InfoCenterComponent} from "./info-center.component";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {LiveRoomTopBarModule} from "../shared/live-room-top-bar/live-room-top-bar.module";
import {LiveRoomInfoUpperModule} from "../shared/live-room-info-upper/live-room-info-upper.module";
import {PipeModule} from "../shared/pipe/pipe.module";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";
import {InviteApiService} from "../shared/api/invite/invite.api";

@NgModule({
  imports: [
    ROUTES,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    PipeModule,
    LiveRoomTopBarModule,
    LiveRoomInfoUpperModule,
    LoadingModule,
  ],
  declarations: [
    InfoCenterComponent,
    EditInfoComponent,
  ],
  providers: [
    InviteApiService,
  ]
})

export class InfoCenterModule {
}
