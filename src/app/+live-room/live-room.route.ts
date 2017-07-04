import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {LiveRoomComponent} from './live-room.component';
import {AuthGuard} from '../shared/guard/auth.guard';
import {LiveInfoResolver} from '../shared/guard/live-info.resolver';
import {UserInfoResolver} from '../shared/guard/user-info.resolver';
import {LiveRoomTitleResolver} from '../shared/guard/title.resolver';
import {LiveRoomInfoComponent} from "./live-room-info/live-room-info.component";
import {RoleAuthGuard} from "../shared/guard/role-auth.guard";
import {BindMobileGuard} from "../shared/guard/bind-mobile.guard";

const route: Routes = [
  {
    path: '',
    loadChildren: 'app/+live-room/+now/now.module#NowModule',
    data: {
      title: '造就Now'
    }
  },
  {
    path: 'apply',
    loadChildren: 'app/+live-room/+apply/apply.module#ApplyModule',
    data: {
      title: '申请开通话题间权限'
    }
  },
  {
    path: 'create',
    loadChildren: 'app/+live-room/+create/create.module#CreateModule',
    data: {
      title: '新建话题间'
    }
  },
  {
    path: ':id/history', loadChildren: 'app/+live-room/+history/history.module#HistoryModule'
  },
  {
    path: ':id/info',
    canActivate: [AuthGuard],
    component: LiveRoomInfoComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
      userInfo: UserInfoResolver,
      title: LiveRoomTitleResolver,
    },
  },
  {
    path: ':id',
    canActivate: [AuthGuard, BindMobileGuard],
    component: LiveRoomComponent,
    data: {
      isAsyncShareInfo: true,
    },
    resolve: {
      liveInfo: LiveInfoResolver,
      userInfo: UserInfoResolver,
      title: LiveRoomTitleResolver,
    },
    children: [
      {path: '', canActivate: [RoleAuthGuard]},
      {path: 'push-comment', loadChildren: 'app/+live-room/+push-comment/push-comment.module#PushCommentModule'},
      {path: 'post', loadChildren: 'app/+live-room/+post/post.module#PostModule'},
      {path: 'vip-info', loadChildren: 'app/+live-room/+vip-info/vip-info.module#VipInfoModule'},
      {path: 'stream-info', loadChildren: 'app/+live-room/+stream-info/stream-info.module#StreamInfoModule'},
      {path: 'invitation', loadChildren: 'app/+live-room/+invite/invite.module#InviteModule'},
      {path: 'share/:message_id', loadChildren: 'app/+live-room/+share/share.module#ShareModule'},
      {path: 'settings', loadChildren: 'app/+live-room/+settings/settings.module#SettingsModule'},
      {path: 'share-star', loadChildren: 'app/+live-room/+share-star/share-star.module#ShareStarModule'},
    ]
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class LiveRoomRoutingModule {
}

