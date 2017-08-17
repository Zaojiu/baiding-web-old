import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {VipInfoComponent} from './vip-info.component';
import {AdminGuard} from "../../shared/guard/admin.guard";
import {CachedLiveInfoResolver} from "../../shared/guard/cached-live-info.resolver";

const route: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: VipInfoComponent,
    data: {
      isInheritShareInfo: true,
      title: '嘉宾信息',
    },
    resolve: {
      liveInfo: CachedLiveInfoResolver,
    },
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class VipInfoRoutingModule {}
