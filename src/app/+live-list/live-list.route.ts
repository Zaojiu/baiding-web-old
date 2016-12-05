import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {LiveListComponent} from "./live-list.component";
import {AuthGuard} from "../shared/guard/auth.guard";
import {UserInfoResolver} from "../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '',
    component: LiveListComponent,
    resolve: {
      userInfo: UserInfoResolver,
    },
    canActivate: [AuthGuard]
  },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
