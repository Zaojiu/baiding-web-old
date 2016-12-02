import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {HamburgerMenuComponent} from "./hamburger-menu.component";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    HamburgerMenuComponent,
  ],
  exports: [
    HamburgerMenuComponent,
  ],
})

export class HamburgerMenuModule {
}
