import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {BuyComponent} from "./buy/buy.component";
import {AuthGuard} from "../shared/guard/auth.guard";
import {BindMobileGuard} from "../shared/guard/bind-mobile.guard";

const route: Routes = [
  {
    path: ':id/buy',
    component: BuyComponent,
    canActivate: [AuthGuard, BindMobileGuard],
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
export class EventRoutingModule {}
