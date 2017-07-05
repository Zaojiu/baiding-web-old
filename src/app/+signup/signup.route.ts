import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "../shared/guard/auth.guard";
import {SignupComponent} from "./signup.component";
import {SignupGuard} from "./signup.guard";

const route: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, SignupGuard],
    component: SignupComponent,
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class SignupRoutingModule {
}

