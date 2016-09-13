import { Routes, RouterModule } from '@angular/router';
import { LiveRoomComponent } from './live-room.component.ts';
import { PushCommentComponent } from './push-comment/push-comment.component';
import { PostComponent } from './post/post.component';
import { HistoryComponent } from './history/history.component';
import { InviteComponent } from './invite/invite.component';
import { EmptyComponent } from '../shared/empty/empty.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { LiveGuard } from '../shared/guard/live.guard';
import { QuitEditGuard } from '../shared/guard/quit-edit.guard';
import { ShareComponent } from '../live-room/share/share.component';

const liveRoomRoute: Routes = [
  {
    path: 'lives/:id',
    component: LiveRoomComponent,
    canActivate: [ AuthGuard, LiveGuard ],
    children: [
      { path: '', component: EmptyComponent },
      { path: 'push-comment', component: PushCommentComponent },
      { path: 'post', component: PostComponent, canDeactivate: [ QuitEditGuard ] },
      { path: 'history', component: HistoryComponent },
      { path: 'invitation', component: InviteComponent },
      { path: 'share/:message_id', component: ShareComponent }
    ]
  }
]

export const ROUTES = RouterModule.forChild(liveRoomRoute);
