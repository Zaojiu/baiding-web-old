import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {SearchResultComponent} from "./search-result/search-result.component";
import {SearchRoutingModule} from "./search.route";
import {ListViewModule} from "../shared/list-view/list-view.module";
import {SearchApiService} from "../shared/api/search/search.api";

@NgModule({
  imports: [
    SearchRoutingModule,
    CommonModule,
    ListViewModule,
  ],
  declarations: [
    SearchResultComponent,
  ],
  providers: [
    SearchApiService,
  ]
})

export class SearchModule {
}
