import {NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {InfoCenterRoutingModule} from './info-center.route';
import {InfoCenterComponent} from "./info-center.component";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {LiveRoomTopBarModule} from "../shared/live-room-top-bar/live-room-top-bar.module";
import {LiveRoomInfoUpperModule} from "../shared/live-room-info-upper/live-room-info-upper.module";
import {PipeModule} from "../shared/pipe/pipe.module";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";
import {InviteApiService} from "../shared/api/invite/invite.api";
import {CountDownModule} from "../shared/countdown/countdown.module";
import {HamburgerMenuModule} from "../shared/hamburger-menu/hamburger-menu.module";
import {FormModule} from "../shared/form/form.module";
import {UserNickResolver} from "../shared/guard/title.resolver";
import {LiveCoverModule} from "../shared/live-cover/live-cover.module";

@NgModule({
  imports: [
    InfoCenterRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    FormModule,
    PipeModule,
    LiveRoomTopBarModule,
    LiveRoomInfoUpperModule,
    LoadingModule,
    CountDownModule,
    HamburgerMenuModule,
    LiveCoverModule,
  ],
  declarations: [
    InfoCenterComponent,
    EditInfoComponent,
  ],
  providers: [
    InviteApiService,
    UserNickResolver,
  ]
})

export class InfoCenterModule {
}
