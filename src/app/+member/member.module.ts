import {NgModule} from '@angular/core';
import {MemberRoutingModule} from "./member.route";
import {ActivateComponent} from "./activate/activate.component";
import {CommonModule} from "@angular/common";
import {FormModule} from "../shared/form/form.module";
import {ReactiveFormsModule} from "@angular/forms";
import {SenderApiService} from "../shared/api/sender/sender.api";
import {InfoComponent} from "./info/info.component";
import {ActivateGuard} from "./activate/activate.guard";
import {MemberGuard} from "../shared/guard/member.guard";
import {BindMobileGuard} from "../shared/guard/bind-mobile.guard";

@NgModule({
  imports: [
    CommonModule,
    MemberRoutingModule,
    ReactiveFormsModule,
    FormModule,
  ],
  declarations: [
    ActivateComponent,
    InfoComponent,
  ],
  providers: [
    SenderApiService,
    ActivateGuard,
    MemberGuard,
    BindMobileGuard,
  ]
})

export class MemberModule {

}
