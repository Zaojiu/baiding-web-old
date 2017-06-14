import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {UserInfoResolver} from '../shared/guard/user-info.resolver';
import {SigninComponent} from "./signin.component";
import {GuestGuard} from "../shared/guard/guest.guard";

const route: Routes = [
  {
    path: '',
    canActivate: [GuestGuard],
    component: SigninComponent,
    resolve: {
      userInfo: UserInfoResolver,
    },
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class SigninRoutingModule {
}

