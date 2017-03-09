import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {QuitEditGuard} from "../../shared/guard/quit-edit.guard";
import {AuthGuard} from "../../shared/guard/auth.guard";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";
import {ApplyComponent} from "./apply.component";

const route: Routes = [
  {
    path: '',
    resolve: {
      userInfo: UserInfoResolver,
    },
    canActivate: [AuthGuard],
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
