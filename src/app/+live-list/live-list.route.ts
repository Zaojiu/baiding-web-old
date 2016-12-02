import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {LiveListComponent} from "./live-list.component";
import {AuthGuard} from "../shared/guard/auth.guard";

const route: Routes = [
  {
    path: '',
    component: LiveListComponent,
    canActivate: [AuthGuard]
  },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
