import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "../shared/guard/auth.guard";

const route: Routes = [
  {
    path: ':id',
    canActivate: [AuthGuard],
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class SpeakerRoutingModule {
}

