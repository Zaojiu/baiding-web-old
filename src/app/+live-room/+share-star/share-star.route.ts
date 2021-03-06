import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {ShareStarComponent} from './share-star.component';

const route: Routes = [
  {
    path: '',
    component: ShareStarComponent,
    data: {
      isInheritShareInfo: true,
      title: '分享达人',
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

