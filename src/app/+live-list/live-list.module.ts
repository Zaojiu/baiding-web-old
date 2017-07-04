import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {LiveListRoutingModule} from './live-list.route';
import {LiveListComponent} from "./live-list.component";
import {PipeModule} from "../shared/pipe/pipe.module";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";
import {CountDownModule} from "../shared/countdown/countdown.module";
import {ScrollerModule} from "../shared/scroller/scroller.module";
import {HamburgerMenuModule} from "../shared/hamburger-menu/hamburger-menu.module";
import {DraggableModule} from "../shared/draggable/draggable.module";

@NgModule({
  imports: [
    LiveListRoutingModule,
    CommonModule,
    PipeModule,
    LoadingModule,
    CountDownModule,
    ScrollerModule,
    HamburgerMenuModule,
    DraggableModule,
  ],
  declarations: [
    LiveListComponent,
  ],
  providers: []
})

export class LiveListModule {
}
