import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ROUTES} from './vip-info.route';
import {VipInfoComponent} from './vip-info.component';
import {FormsModule} from '@angular/forms';
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ROUTES,
    LiveRoomTopBarModule,
  ],
  declarations: [
    VipInfoComponent,
  ],
})

export class VipInfoModule {
}
