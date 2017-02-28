import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {MyComponent} from "./my.component";
import {AuthGuard} from "../shared/guard/auth.guard";

const route: Routes = [
  {
    path: 'favorites',
    component: MyComponent,
    canActivate: [AuthGuard],
    data: {
      title: '我收藏的'
    }
  },
  {
    path: 'histories',
    canActivate: [AuthGuard],
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
