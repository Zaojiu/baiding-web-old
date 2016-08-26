import { Routes, RouterModule } from '@angular/router';
import { LiveRoomComponent } from './live-room.component.ts';
import { LiveRoomPushCommentComponent } from './live-room-push-comment/live-room-push-comment.component';
import { LiveRoomPostCommentComponent } from './live-room-post-comment/live-room-post-comment.component';
import { EmptyComponent } from '../shared/empty/empty.component';

const liveRoomRoute: Routes = [
  {
    path: 'lives/:id',
    component: LiveRoomComponent,
    children: [
      { path: '', component: EmptyComponent },
      { path: 'push-comment', component: LiveRoomPushCommentComponent },
      { path: 'post-comment', component: LiveRoomPostCommentComponent }
    ]
  }
]

export const ROUTES = RouterModule.forChild(liveRoomRoute);
