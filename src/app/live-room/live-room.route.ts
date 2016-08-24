import { Routes, RouterModule } from '@angular/router';
import { LiveRoomComponent } from './live-room.component.ts';

const liveRoomRoute: Routes = [
  {
    path: 'lives/:id',
    component: LiveRoomComponent,
  }
]

export const ROUTES = RouterModule.forChild(liveRoomRoute);
