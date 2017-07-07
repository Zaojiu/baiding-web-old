import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "../shared/guard/auth.guard";
import {ActivateComponent} from "./activate/activate.component";
import {InfoComponent} from "./info/info.component";
import {ActivateGuard} from "./activate/activate.guard";
import {BindMobileGuard} from "../shared/guard/bind-mobile.guard";
import {MemberGuard} from "../shared/guard/member.guard";

const route: Routes = [
  {
    path: 'activate',
    canActivate: [AuthGuard, ActivateGuard],
    data: {
      title: '会员卡激活',
    },
    component: ActivateComponent,
  },
  {
    path: 'info',
    data: {
      title: '会员信息',
    },
    canActivate: [AuthGuard, BindMobileGuard, MemberGuard],
    component: InfoComponent,
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class MemberRoutingModule {
}

