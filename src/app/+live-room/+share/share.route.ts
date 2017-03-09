import {ModuleWithProviders, NgModule} from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { ShareComponent } from './share.component';

const route: Routes = [
  {
    path: '', component: ShareComponent
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class ShareRoutingModule {}

