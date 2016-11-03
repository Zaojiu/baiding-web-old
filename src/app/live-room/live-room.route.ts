import { Routes, RouterModule } from '@angular/router';
import { LiveRoomComponent } from './live-room.component';
import { PostComponent } from './post/post.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { LiveInfoResolver } from '../shared/guard/live.guard';
import { QuitEditGuard } from '../shared/guard/quit-edit.guard';
import {EmptyComponent} from '../shared/empty/empty.component';

const route: Routes = [
  {
    path: 'lives/:id',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '', component: LiveRoomComponent,
        resolve: {
          liveInfo: LiveInfoResolver,
        },
        children: [
          { path: '', component: EmptyComponent},
          { path: 'post', component: PostComponent, canDeactivate: [ QuitEditGuard ]},
        ],
      },
      { path: 'push-comment', loadChildren: 'app/live-room/+push-comment/push-comment.module#PushCommentModule' },
      { path: 'history', loadChildren: 'app/live-room/+history/history.module#HistoryModule' },
      { path: 'vip-info', loadChildren: 'app/live-room/+vip-info/vip-info.module#VipInfoModule' },
      { path: 'invitation', loadChildren: 'app/live-room/+invite/invite.module#InviteModule' },
      { path: 'share/:message_id', loadChildren: 'app/live-room/+share/share.module#ShareModule' },
      { path: 'settings', loadChildren: 'app/live-room/+settings/settings.module#SettingsModule' }
    ]
  }
]

export const ROUTES = RouterModule.forChild(route);
