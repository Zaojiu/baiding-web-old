import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {SigninComponent} from "./signin.component";
import {GuestGuard} from "../shared/guard/guest.guard";
import {ResetPwdComponent} from "./reset/reset.component";
import {SigninGuard} from "./signin.guard";

const route: Routes = [
  {
    path: '',
    data: {
      title: '登录',
    },
    canActivate: [SigninGuard],
    component: SigninComponent,
  },
  {
    path: 'reset-password',
    data: {
      title: '忘记密码',
    },
    canActivate: [GuestGuard],
    component: ResetPwdComponent,
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class SigninRoutingModule {
}

