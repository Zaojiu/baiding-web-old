import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {SettingsComponent} from "./settings.component";
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {ViewInfoComponent} from "./view-info/view-info.component";
import {QuitEditGuard} from "../../shared/guard/quit-edit.guard";
import {AdminGuard} from "../../shared/guard/admin.guard";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '',
    resolve: {
      liveInfo: LiveInfoResolver,
      userInfo: UserInfoResolver,
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
    canActivate: [AdminGuard],
    canDeactivate: [QuitEditGuard],
    resolve: {
      liveInfo: LiveInfoResolver,
    },
  },
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
