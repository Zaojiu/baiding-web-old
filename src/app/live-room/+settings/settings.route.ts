import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {SettingsComponent} from "./settings.component";
import {LiveInfoResolver} from "../../shared/guard/live.guard";

const route: Routes = [
  {
    path: '',
    resolve: {
      liveInfo: LiveInfoResolver,
    },
    component: SettingsComponent
  }
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
