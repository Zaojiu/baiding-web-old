import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {VipInfoComponent} from './vip-info.component';
import {AdminGuard} from "../../shared/guard/admin.guard";

const route: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: VipInfoComponent,
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class VipInfoRoutingModule {}
