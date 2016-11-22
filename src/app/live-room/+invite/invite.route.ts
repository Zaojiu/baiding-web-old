import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {InviteComponent} from './invite.component';
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";

const route: Routes = [
  {
    path: '', component: InviteComponent,
    resolve: {
      userInfo: UserInfoResolver,
      liveInfo: LiveInfoResolver,
    },
  }
]

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
