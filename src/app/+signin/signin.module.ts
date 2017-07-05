import {NgModule} from '@angular/core';
import {SigninRoutingModule} from "./signin.route";
import {SigninComponent} from "./signin.component";
import {CommonModule} from "@angular/common";
import {FormModule} from "../shared/form/form.module";
import {ReactiveFormsModule} from "@angular/forms";
import {SenderApiService} from "../shared/api/sender/sender.api";
import {LoadingModule} from "../shared/bd-loading/bd-loading.module";
import {ResetPwdComponent} from "./reset/reset.component";
import {SigninGuard} from "./signin.guard";
import {GuestGuard} from "../shared/guard/guest.guard";

@NgModule({
  imports: [
    CommonModule,
    SigninRoutingModule,
    ReactiveFormsModule,
    FormModule,
    LoadingModule,
  ],
  declarations: [
    SigninComponent,
    ResetPwdComponent,
  ],
  providers: [
    SenderApiService,
    SigninGuard,
    GuestGuard,
  ]
})

export class SigninModule {

}
