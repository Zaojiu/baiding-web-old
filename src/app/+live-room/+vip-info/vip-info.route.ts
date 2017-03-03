import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {VipInfoComponent} from './vip-info.component';
import {AdminGuard} from "../../shared/guard/admin.guard";
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: VipInfoComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
      userInfo: UserInfoResolver,
    },
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class VipInfoRoutingModule {}
