import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from "./notfound.component";
import {NgModule} from "@angular/core";

const route: Routes = [
  {
    path: '',
    component: NotFoundComponent
  }
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class NotFoundRoutingModule {}
