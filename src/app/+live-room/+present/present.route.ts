import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {PresentComponent} from './present.conponent';

const route: Routes = [
  {
    path: '',
    component: PresentComponent,
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class PresentRoutingModule {}
