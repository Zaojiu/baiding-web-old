import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {HamburgerMenuComponent} from "./hamburger-menu.component";
import {AnimationModule} from "../animation/animation.module";

@NgModule({
  imports: [
    CommonModule,
    AnimationModule,
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
