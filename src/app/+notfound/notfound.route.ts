import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from "./notfound.component";

const route: Routes = [
  {
    path: '',
    component: NotFoundComponent
  }
];

export const ROUTES = RouterModule.forChild(route);
