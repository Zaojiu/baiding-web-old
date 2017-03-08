import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {PayPopupComponent} from "./pay-popup.component";
import {PayPopupService} from "./pay-popup.service";
import {LoadingModule} from "../bd-loading/bd-loading.module";

@NgModule({
  imports: [
    LoadingModule,
    CommonModule,
  ],
  declarations: [
    PayPopupComponent,
  ],
  exports: [
    PayPopupComponent,
  ],
  providers: [
    PayPopupService,
  ],
})

export class PayPopupModule {
}
