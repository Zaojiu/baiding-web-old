import {NgModule} from '@angular/core';
import {SignupRoutingModule} from "./signup.route";
import {SignupComponent} from "./signup.component";
import {CommonModule} from "@angular/common";
import {FormModule} from "../shared/form/form.module";
import {ReactiveFormsModule} from "@angular/forms";
import {SenderApiService} from "../shared/api/sender/sender.api";

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
  ]
})

export class SignupModule {
}
