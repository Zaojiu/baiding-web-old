import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AtKeyBoardComponent} from "./at-keyboard.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AtKeyBoardComponent,
  ],
  exports: [
    AtKeyBoardComponent,
  ],
})

export class AtKeyBoardModule {
}
