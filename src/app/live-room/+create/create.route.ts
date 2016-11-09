import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {QuitEditGuard} from "../../shared/guard/quit-edit.guard";
import {CreateComponent} from "./create.component";
import {AuthGuard} from "../../shared/guard/auth.guard";

const route: Routes = [
  {
    path: '',
    canActivate: [AuthGuard], // TODO: 创建权限guard.
    canDeactivate: [QuitEditGuard],
    component: CreateComponent,
  }
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
