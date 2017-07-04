import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ShareStarRoutingModule} from './share-star.route';
import {ShareStarComponent} from './share-star.component';
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";


@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
    ShareStarRoutingModule,
  ],
  declarations: [
    ShareStarComponent,
  ],
})

export class ShareStarModule {
}
