import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {MyComponent} from "./my.component";
import {MyRoutingModule} from "./my.route";
import {MyApiService} from "../shared/api/my/my.api";
import {ListViewModule} from "../shared/list-view/list-view.module";
import {TicketComponent} from "./ticket.component";

@NgModule({
  imports: [
    MyRoutingModule,
    CommonModule,
    ListViewModule,
  ],
  declarations: [
    MyComponent,
    TicketComponent,
  ],
  providers: [
    MyApiService,
  ]
})

export class MyModule {
}
