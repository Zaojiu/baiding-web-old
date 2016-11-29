import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PipeModule} from "../pipe/pipe.module";
import {CountDownComponent} from "./countdown.component";

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
  ],
  declarations: [
    CountDownComponent,
  ],
  exports: [
    CountDownComponent,
  ],
})

export class CountDownModule {
}
