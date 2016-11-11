import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {InfoCenterComponent} from "./info-center.component";

const route: Routes = [
  {
    path: '',
    component: InfoCenterComponent,
  }
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
