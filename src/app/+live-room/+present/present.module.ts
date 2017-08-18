import {NgModule} from '@angular/core';
import {PresentRoutingModule} from "./present.route";
import {PresentComponent} from "./present.conponent";
import {InviteApiService} from "../../shared/api/invite/invite.api";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {FormModule} from "../../shared/form/form.module";
import {SenderApiService} from "../../shared/api/sender/sender.api";

@NgModule({
  imports: [
    CommonModule,
    PresentRoutingModule,
    LoadingModule,
    ReactiveFormsModule,
    FormModule,
  ],
  declarations: [
    PresentComponent,
  ],
  providers: [
    InviteApiService,
    SenderApiService,
  ]
})

export class PresentModule {
}
