import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {SettingsComponent} from "./settings.component";
import {LiveInfoResolver} from "../../shared/guard/live.guard";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {ViewInfoComponent} from "./view-info/view-info.component";

const route: Routes = [
  {
    path: '',
    resolve: {
      liveInfo: LiveInfoResolver,
    },
    component: SettingsComponent,
  },
  {
    path: 'view-info', component: ViewInfoComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
    },
  },
  {
    path: 'edit-info', component: EditInfoComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
    },
  },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
