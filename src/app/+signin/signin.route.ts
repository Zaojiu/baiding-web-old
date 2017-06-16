import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {SigninComponent} from "./signin.component";
import {GuestGuard} from "../shared/guard/guest.guard";
import {ResetPwdComponent} from "./reset/reset.component";

const route: Routes = [
  {
    path: '',
    canActivate: [GuestGuard],
    component: SigninComponent,
  },
  {
    path: 'reset-password',
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

