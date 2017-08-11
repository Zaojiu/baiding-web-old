import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

import {EventRoutingModule} from './event.route';
import {BuyComponent} from "./buy/buy.component";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";
import {EventApiService} from "../shared/api/event/ticket.api";
import {PayPopupService} from "../shared/pay-popup/pay-popup.service";

@NgModule({
  imports: [
    EventRoutingModule,
    CommonModule,
    FormsModule,
    LoadingModule,
  ],
  declarations: [
    BuyComponent,
  ],
  providers: [
    EventApiService,
    PayPopupService,
  ]
})

export class EventModule {
}
