import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TopBarSwitchBtnComponent} from "./topbar-switch-btn.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TopBarSwitchBtnComponent,
  ],
  exports: [
    TopBarSwitchBtnComponent,
  ]
})

export class TopBarSwitchBtnModule {
}
