import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {SwitchBtnComponent} from "./switch-btn.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SwitchBtnComponent,
  ],
  exports: [
    SwitchBtnComponent,
  ]
})

export class SwitchBtnModule {
}
