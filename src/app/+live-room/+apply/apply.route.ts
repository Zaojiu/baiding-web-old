import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {QuitEditGuard} from "../../shared/guard/quit-edit.guard";
import {AuthGuard} from "../../shared/guard/auth.guard";
import {ApplyComponent} from "./apply.component";
import {BindMobileGuard} from "../../shared/guard/bind-mobile.guard";

const route: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, BindMobileGuard],
    canDeactivate: [QuitEditGuard],
    component: ApplyComponent,
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class ApplyRoutingModule {}
