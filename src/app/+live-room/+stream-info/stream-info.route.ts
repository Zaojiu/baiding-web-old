import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {StreamInfoComponent} from './stream-info.component';
import {AdminGuard} from "../../shared/guard/admin.guard";
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: StreamInfoComponent,
    data: {
      title: '推流地址'
    }
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class StreamInfoRoutingModule {
}

