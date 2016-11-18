import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {InfoCenterComponent} from "./info-center.component";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {LiveInfoResolver} from "../shared/guard/live-info.resolver";
import {UserInfoResolver} from "../shared/guard/user-info.resolver";
import {QuitEditGuard} from "../shared/guard/quit-edit.guard";
import {AuthGuard} from "../shared/guard/auth.guard";

const route: Routes = [
  {
    path: 'edit-info',
    component: EditInfoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ':uid',
    component: InfoCenterComponent,
    canActivate: [AuthGuard],
  },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
