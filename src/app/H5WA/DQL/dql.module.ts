import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DqlComponent} from './dql.component';
import {DqlRoutingModule} from './dql.route';
import {DdiApiService} from '../../shared/api/ddi/ddi.api';
import {LoadingModule} from '../../shared/bd-loading/bd-loading.module';
import {ShareApiService} from '../../shared/api/share/share.api';

@NgModule({
  imports: [
    DqlRoutingModule,
    CommonModule,
    LoadingModule,
  ],
  declarations: [
    DqlComponent,
  ],
  providers: [
    DdiApiService,
    ShareApiService
  ]
})

export class DqlModule {
}
