import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { InviteComponent } from './invite.component';

const route: Routes = [
  {
    path: '', component: InviteComponent
  }
]

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
