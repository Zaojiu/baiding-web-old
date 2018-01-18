import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DdiComponent} from './ddi.component';
import {DdiRoutingModule} from './ddi.route';
import {DdiApiService} from '../../shared/api/ddi/ddi.api';
import {LoadingModule} from '../../shared/bd-loading/bd-loading.module';
import {ShareApiService} from '../../shared/api/share/share.api';

@NgModule({
  imports: [
    DdiRoutingModule,
    CommonModule,
    LoadingModule,
  ],
  declarations: [
    DdiComponent,
  ],
  providers: [
    DdiApiService,
    ShareApiService
  ]
})

export class DdiModule {
}
