import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {VipInfoComponent} from './vip-info.component';
import {AdminGuard} from "../../shared/guard/admin.guard";

const route: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: VipInfoComponent,
  }
]

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
