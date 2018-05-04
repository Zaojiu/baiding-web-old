import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {WieeComponent} from "../+wiee/wiee.component";

const route: Routes = [
  {
    path: '',
    component: WieeComponent,
    data: {
      title: 'WIEE直播',
    },
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})

export class WieeRoutingModule {

}
