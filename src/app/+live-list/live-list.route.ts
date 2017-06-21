import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {LiveListComponent} from "./live-list.component";
import {UserInfoResolver} from "../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '',
    component: LiveListComponent,
    data: {
      title: '首页',
    },
    resolve: {
      userInfo: UserInfoResolver,
    }
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class LiveListRoutingModule {}
