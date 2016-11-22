import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {QuitEditGuard} from "../../shared/guard/quit-edit.guard";
import {CreateComponent} from "./create.component";
import {AuthGuard} from "../../shared/guard/auth.guard";
import {CreateGuard} from "../../shared/guard/create.guard";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '',
    resolve: {
      userInfo: UserInfoResolver,
    },
    canActivate: [AuthGuard, CreateGuard],
    canDeactivate: [QuitEditGuard],
    component: CreateComponent,
  }
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
