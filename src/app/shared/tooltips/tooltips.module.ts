import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ToolTipsComponent} from "./tooltips.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ToolTipsComponent,
  ],
  exports: [
    ToolTipsComponent,
  ]
})

export class ToolTipsModule {
}
