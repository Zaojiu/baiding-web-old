import {NgModule} from '@angular/core';
import {UserInfoCardComponent} from "./user-info-card.component";
import {UserInfoCardService} from "./user-info-card.service";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    UserInfoCardComponent,
  ],
  exports: [
    UserInfoCardComponent,
  ],
  providers: [
    UserInfoCardService,
  ],
})

export class UserInfoCardModule {
}
