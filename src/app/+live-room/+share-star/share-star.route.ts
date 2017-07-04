import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {ShareStarComponent} from './share-star.component';

const route: Routes = [
  {
    path: '',
    component: ShareStarComponent,
    data: {
      isInheritShareInfo: true,
    },
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class ShareStarRoutingModule {
}

