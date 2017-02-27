import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {LoadingModule} from "../bd-loading/bd-loading.module";
import {ListViewComponent} from "./list-view.component";

@NgModule({
  imports: [
    CommonModule,
    LoadingModule,
  ],
  declarations: [
    ListViewComponent,
  ],
  exports: [
    ListViewComponent,
  ],
})

export class ListViewModule {
}
