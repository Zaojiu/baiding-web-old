import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {InfoCenterComponent} from "./info-center.component";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {LiveInfoResolver} from "../shared/guard/live-info.resolver";
import {UserInfoResolver} from "../shared/guard/user-info.resolver";
import {QuitEditGuard} from "../shared/guard/quit-edit.guard";
import {AdminGuard} from "../shared/guard/admin.guard";

const route: Routes = [
  {
    path: ':uid',
    component: InfoCenterComponent,
  },
  {
    path: ':uid/edit-info',
    component: EditInfoComponent,
  },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
