import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ROUTES} from './vip-info.route';
import {VipInfoComponent} from './vip-info.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ROUTES,
  ],
  declarations: [
    VipInfoComponent,
  ],
})

export class VipInfoModule {
}
