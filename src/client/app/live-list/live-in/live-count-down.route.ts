import { Routes, RouterModule } from '@angular/router';
import { LiveInComponent } from './live-in.component';

const liveInRoute: Routes = [
  { path: 'live-in', component: LiveInComponent}
]

export const ROUTES = RouterModule.forChild(liveInRoute);
