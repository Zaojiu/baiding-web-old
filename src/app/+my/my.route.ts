import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {MyComponent} from "./my.component";

const route: Routes = [
  {
    path: 'favorites',
    component: MyComponent,
    data: {
      title: '我收藏的'
    }
  },
  {
    path: 'histories',
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
