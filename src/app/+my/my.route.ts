import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {MyComponent} from "./my.component";
import {AuthGuard} from "../shared/guard/auth.guard";
import {BindMobileGuard} from "../shared/guard/bind-mobile.guard";

const route: Routes = [
  {
    path: 'favorites',
    component: MyComponent,
    canActivate: [AuthGuard, BindMobileGuard],
    data: {
      title: '我收藏的'
    }
  },
  {
    path: 'histories',
    canActivate: [AuthGuard, BindMobileGuard],
    component: MyComponent,
    data: {
      title: '我看过的'
    }
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class MyRoutingModule {}
