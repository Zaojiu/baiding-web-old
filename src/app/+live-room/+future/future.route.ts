import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FutureComponent} from '../+future/future.component';

const route: Routes = [
  {
    path: '',
    component: FutureComponent,
    data: {
      title: '创行-未来力大会',
    },
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})

export class FutureRoutingModule {

}
