import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {NowRoutingModule} from './now.route';
import {NowComponent} from "./now.component";
import {PipeModule} from "../../shared/pipe/pipe.module";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";
import {CountDownModule} from "../../shared/countdown/countdown.module";
import {ScrollerModule} from "../../shared/scroller/scroller.module";
import {HamburgerMenuModule} from "../../shared/hamburger-menu/hamburger-menu.module";
import {DraggableModule} from "../../shared/draggable/draggable.module";

@NgModule({
  imports: [
    NowRoutingModule,
    CommonModule,
    PipeModule,
    LoadingModule,
    CountDownModule,
    ScrollerModule,
    HamburgerMenuModule,
    DraggableModule,
  ],
  declarations: [
    NowComponent,
  ],
  providers: []
})

export class NowModule {
}
