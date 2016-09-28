import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { HistoryComponent } from "./history.component";

const route: Routes = [
  {
    path: '', component: HistoryComponent
  }
]

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
