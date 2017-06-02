import {Routes, RouterModule} from '@angular/router';
import {ReloadComponent} from "./reload.component";
import {NgModule} from "@angular/core";

const route: Routes = [
  {
    path: '',
    component: ReloadComponent
  }
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class ReloadRoutingModule {}
