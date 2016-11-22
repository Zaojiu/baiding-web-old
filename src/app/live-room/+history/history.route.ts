import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { HistoryComponent } from "./history.component";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";

const route: Routes = [
  {
    path: '', component: HistoryComponent,
    resolve: {
      userInfo: UserInfoResolver,
      liveInfo: LiveInfoResolver,
    }
  }
]

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
