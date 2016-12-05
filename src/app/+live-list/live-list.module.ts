import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ROUTES} from './live-list.route';
import {LiveListComponent} from "./live-list.component";
import {PipeModule} from "../shared/pipe/pipe.module";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";
import {CountDownModule} from "../shared/countdown/countdown.module";
import {ScrollerModule} from "../shared/scroller/scroller.module";
import {DurationFormaterPipe} from "../shared/pipe/time.pipe";

@NgModule({
  imports: [
    ROUTES,
    CommonModule,
    PipeModule,
    LoadingModule,
    CountDownModule,
    ScrollerModule,
  ],
  declarations: [
    LiveListComponent,
  ],
  providers: [
    DurationFormaterPipe,
  ]
})

export class LiveListModule {
}
