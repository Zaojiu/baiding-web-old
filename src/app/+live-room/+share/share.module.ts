import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ShareRoutingModule} from './share.route';
import {ShareComponent} from './share.component';
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";


@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
    ShareRoutingModule,
  ],
  declarations: [
    ShareComponent,
  ],
})

export class ShareModule {
}
