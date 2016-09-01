import { Routes, RouterModule } from '@angular/router';
import { LiveRoomComponent } from './live-room.component.ts';
import { LiveRoomPushCommentComponent } from './live-room-push-comment/live-room-push-comment.component';
import { LiveRoomPostCommentComponent } from './live-room-post-comment/live-room-post-comment.component';
import { HistoryComponent } from './history/history.component';
import { InviteComponent } from './invite/invite.component';
import { EmptyComponent } from '../shared/empty/empty.component';

const liveRoomRoute: Routes = [
  {
    path: 'lives/:id',
    component: LiveRoomComponent,
    children: [
      { path: '', component: EmptyComponent },
      { path: 'push-comment', component: LiveRoomPushCommentComponent },
      { path: 'post-comment', component: LiveRoomPostCommentComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'invitation', component: InviteComponent }
    ]
  }
]

export const ROUTES = RouterModule.forChild(liveRoomRoute);
