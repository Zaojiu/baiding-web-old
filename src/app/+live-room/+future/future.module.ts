import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {FutureRoutingModule} from "./future.route";
import {FutureComponent} from "./future.component";
import {PipeModule} from "../../shared/pipe/pipe.module";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";
import {CountDownModule} from "../../shared/countdown/countdown.module";
import {ScrollerModule} from "../../shared/scroller/scroller.module";
import {HamburgerMenuModule} from "../../shared/hamburger-menu/hamburger-menu.module";
import {LiveCoverModule} from "../../shared/live-cover/live-cover.module";

@NgModule({
  imports: [
    FutureRoutingModule,
    CommonModule,
    PipeModule,
    LoadingModule,
    CountDownModule,
    ScrollerModule,
    HamburgerMenuModule,
    LiveCoverModule,
  ],
  declarations: [
    FutureComponent,
  ],
  providers: []
})

export class FutureModule {
}
