import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { VipInfoComponent } from './vip-info.component';

const route: Routes = [
  {
    path: '', component: VipInfoComponent
  }
]

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
