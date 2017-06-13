import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {QuitEditGuard} from "../../shared/guard/quit-edit.guard";
import {CreateComponent} from "./create.component";
import {AuthGuard} from "../../shared/guard/auth.guard";
import {CreateGuard} from "../../shared/guard/create.guard";
import {BindMobileGuard} from "../../shared/guard/bind-mobile.guard";

const route: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, BindMobileGuard, CreateGuard],
    canDeactivate: [QuitEditGuard],
    component: CreateComponent,
    data: {
      title: '创建话题间'
    }
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class CreateRoutingModule {}

