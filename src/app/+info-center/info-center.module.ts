import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ROUTES} from './info-center.route';
import {InfoCenterComponent} from "./info-center.component";

@NgModule({
  imports: [
    ROUTES,
    CommonModule,
  ],
  declarations: [
    InfoCenterComponent,
  ],
})

export class InfoCenterModule {
}
