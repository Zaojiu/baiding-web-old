import {ModuleWithProviders, NgModule} from "@angular/core";
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
    data: {
      title: '话题间设置',
      isInheritShareInfo: true,
    },
    component: SettingsComponent,
  },
  {
    path: 'view-info', component: ViewInfoComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
      userInfo: UserInfoResolver,
    },
    data: {
      title: '话题间信息',
      isInheritShareInfo: true,
    }
  },
  {
    path: 'edit-info', component: EditInfoComponent,
    canActivate: [AdminGuard],
    canDeactivate: [QuitEditGuard],
    resolve: {
      liveInfo: LiveInfoResolver,
      userInfo: UserInfoResolver,
    },
    data: {
      title: '编辑话题间信息',
      isInheritShareInfo: true,
    }
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule {}
