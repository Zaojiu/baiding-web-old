import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PipeModule} from "../pipe/pipe.module";
import {LiveCoverComponent} from "./live-cover.component";
import {CountDownModule} from "../countdown/countdown.module";

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    CountDownModule,
  ],
  declarations: [
    LiveCoverComponent,
  ],
  exports: [
    LiveCoverComponent,
  ],
})

export class LiveCoverModule {
}
