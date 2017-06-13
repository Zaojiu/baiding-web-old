import {NgModule} from '@angular/core';
import {SignupRoutingModule} from "./signup.route";
import {SignupComponent} from "./signup.component";
import {CommonModule} from "@angular/common";
import {FormModule} from "../shared/form/form.module";
import {ReactiveFormsModule} from "@angular/forms";
import {SenderApiService} from "../shared/api/sender/sender.api";
import {SignupGuard} from "./signup.guard";

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    FormModule,
  ],
  declarations: [
    SignupComponent,
  ],
  providers: [
    SenderApiService,
    SignupGuard,
  ]
})

export class SignupModule {

}
