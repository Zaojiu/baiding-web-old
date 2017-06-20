import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {InfoCenterComponent} from "./info-center.component";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {AuthGuard} from "../shared/guard/auth.guard";
import {UserInfoResolver} from "../shared/guard/user-info.resolver";
import {BindMobileGuard} from "../shared/guard/bind-mobile.guard";
import {UserNickResolver} from "../shared/guard/title.resolver";

const route: Routes = [
  {
    path: 'edit-info',
    component: EditInfoComponent,
    canActivate: [AuthGuard, BindMobileGuard],
    resolve: {
      userInfo: UserInfoResolver,
    },
    data: {
      title: '编辑个人信息'
    }
  },
  {
    path: ':uid',
    component: InfoCenterComponent,
    canActivate: [AuthGuard, BindMobileGuard],
    resolve: {
      userInfo: UserInfoResolver,
      title: UserNickResolver,
    },
    data: {
      isAsyncShareInfo: true,
    }
  },
  {
    path: '**',
    redirectTo: '/404',
    pathMatch: 'full',
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class InfoCenterRoutingModule {}
