import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FuDan} from './fudan.route';
import {FuDanComponent} from './fudan.component';
import {PipeModule} from '../../shared/pipe/pipe.module';
import {LoadingModule} from '../../shared/bd-loading/bd-loading.module';
import {CountDownModule} from '../../shared/countdown/countdown.module';
import {ScrollerModule} from '../../shared/scroller/scroller.module';
import {HamburgerMenuModule} from '../../shared/hamburger-menu/hamburger-menu.module';
import {LiveCoverModule} from '../../shared/live-cover/live-cover.module';

@NgModule({
  imports: [
    FuDan,
    CommonModule,
    PipeModule,
    LoadingModule,
    CountDownModule,
    ScrollerModule,
    HamburgerMenuModule,
    LiveCoverModule,
  ],
  declarations: [
    FuDanComponent
  ],
  providers: []
})

export class FuDanModule {
}
