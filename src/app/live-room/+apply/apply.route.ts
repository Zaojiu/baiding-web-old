import {ModuleWithProviders} from "@angular/core";
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

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
