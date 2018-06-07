import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LiveRoomComponent} from './live-room.component';
import {AuthGuard} from '../shared/guard/auth.guard';
import {CachedLiveInfoResolver} from '../shared/guard/cached-live-info.resolver';
import {LiveInfoResolver} from '../shared/guard/live-info.resolver';
import {LiveRoomTitleResolver} from '../shared/guard/title.resolver';
import {LiveRoomInfoComponent} from './live-room-info/live-room-info.component';
import {LiveRoomInfoRedBookComponent} from './live-room-redBook/live-room-info.component';
import {RoleAuthGuard} from '../shared/guard/role-auth.guard';
import {RoleAuthGuardRedBook} from '../shared/guard/role-auth-redbook.guard';
import {BindMobileGuard} from '../shared/guard/bind-mobile.guard';
import {GuestLiveGuard} from "../shared/guard/guest-live.guard";
import {LiveAuthGuard} from "../shared/guard/live-auth.guard";

const route: Routes = [
  {
    path: '',
    loadChildren: 'app/+live-room/+now/now.module#NowModule',
    data: {
      title: 'ZaojiuTV'
    }
  },
  {
    path: 'wiee',
    loadChildren: 'app/+live-room/+wiee/wiee.module#WieeModule',
    data: {
      title: 'WIEE直播'
    }
  },
  {
    path: 'future',
    loadChildren: 'app/+live-room/cooperate+future/future.module#FutureModule',
    data: {
      title: '创行-未来力大会'
    }
  },
  {
    path: 'changsanjiao2018',
    loadChildren: 'app/+live-room/cooperate+changsanjiao2018/changsanjiao.module#ChangSanJiaoModule',
    data: {
      title: '活力长三角，青商新机遇'
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
    component: LiveRoomInfoComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
      title: LiveRoomTitleResolver,
    },
  },
  {
    path: ':id/red-book-info',
    component: LiveRoomInfoRedBookComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
      title: LiveRoomTitleResolver,
    },
    data: {
      isAsyncShareInfo: true,
    },
    children: [
      {path: '', canActivate: [RoleAuthGuardRedBook]},
    ]
  },
  {
    path: ':id/present',
    canActivate: [AuthGuard],
    loadChildren: 'app/+live-room/+present/present.module#PresentModule',
  },
  {
    path: ':id/share-star',
    canActivate: [AuthGuard, BindMobileGuard],
    loadChildren: 'app/+live-room/+share-star/share-star.module#ShareStarModule',
  },
  {
    path: 'fudan',
    loadChildren: 'app/+live-room/fudan/fudan.module#FuDanModule',
    data: {
      title: '复旦EMBA'
    }
  },
  {
    path: ':id',
    canActivate: [LiveAuthGuard],
    component: LiveRoomComponent,
    data: {
      isAsyncShareInfo: true,
    },
    resolve: {
      liveInfo: CachedLiveInfoResolver,
      title: LiveRoomTitleResolver,
    },
    children: [
      {path: '', canActivate: [GuestLiveGuard]},
      {path: 'push-comment', loadChildren: 'app/+live-room/+push-comment/push-comment.module#PushCommentModule'},
      {path: 'post', loadChildren: 'app/+live-room/+post/post.module#PostModule'},
      {path: 'vip-info', loadChildren: 'app/+live-room/+vip-info/vip-info.module#VipInfoModule'},
      {path: 'stream-info', loadChildren: 'app/+live-room/+stream-info/stream-info.module#StreamInfoModule'},
      {
        path: 'invitation',
        loadChildren: 'app/+live-room/+invite/invite.module#InviteModule',
        data: {name: 'invitation'}
      },
      {path: 'share/:message_id', loadChildren: 'app/+live-room/+share/share.module#ShareModule'},
      {path: 'settings', loadChildren: 'app/+live-room/+settings/settings.module#SettingsModule'},
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

