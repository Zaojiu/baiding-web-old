import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { ShareComponent } from './share.component';

const route: Routes = [
  {
    path: '', component: ShareComponent
  }
]

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
