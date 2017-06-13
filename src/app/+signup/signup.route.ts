import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "../shared/guard/auth.guard";
import {UserInfoResolver} from '../shared/guard/user-info.resolver';
import {SignupComponent} from "./signup.component";

const route: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: SignupComponent,
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
export class SignupRoutingModule {
}

