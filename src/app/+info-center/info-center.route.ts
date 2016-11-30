import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {InfoCenterComponent} from "./info-center.component";
import {EditInfoComponent} from "./edit-info/edit-info.component";
import {AuthGuard} from "../shared/guard/auth.guard";
import {UserInfoResolver} from "../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: 'edit-info',
    component: EditInfoComponent,
    canActivate: [AuthGuard],
    resolve: {
      userInfo: UserInfoResolver,
    },
    data: {
      title: '编辑个人信息'
    }
  },
  {
    path: ':uid',
    component: InfoCenterComponent,
    canActivate: [AuthGuard],
    resolve: {
      userInfo: UserInfoResolver,
    },
    data: {
      title: '个人话题间列表'
    }
  },
  {
    path: '',
    component: InfoCenterComponent,
    canActivate: [AuthGuard],
    resolve: {
      userInfo: UserInfoResolver,
    },
    data: {
      title: '个人话题间列表'
    }
  }
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
