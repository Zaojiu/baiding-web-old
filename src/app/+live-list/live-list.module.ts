import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ROUTES} from './live-list.route';
import {LiveListComponent} from "./live-list.component";
import {PipeModule} from "../shared/pipe/pipe.module";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";

@NgModule({
  imports: [
    ROUTES,
    CommonModule,
    PipeModule,
    LoadingModule,
  ],
  declarations: [
    LiveListComponent,
  ],
})

export class LiveListModule {
}
