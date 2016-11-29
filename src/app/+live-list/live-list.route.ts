import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {LiveListComponent} from "./live-list.component";
import {UserInfoResolver} from "../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '',
    component: LiveListComponent,
  },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
