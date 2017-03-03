import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TextPopupComponent} from "./text-popup.component";
import {TextPopupService} from "./text-popup.service";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TextPopupComponent,
  ],
  exports: [
    TextPopupComponent,
  ],
  providers: [
    TextPopupService,
  ],
})

export class TextPopupModule {
}
