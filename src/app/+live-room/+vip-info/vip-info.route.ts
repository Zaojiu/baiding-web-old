import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {VipInfoComponent} from './vip-info.component';
import {AdminGuard} from "../../shared/guard/admin.guard";
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";

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
      liveInfo: LiveInfoResolver,
    },
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class VipInfoRoutingModule {}
