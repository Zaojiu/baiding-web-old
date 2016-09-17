import { Routes, RouterModule } from '@angular/router';
import { LiveListComponent } from './live-list.component';
import { LiveAllComponent } from './live-all/live-all.component';
import { LiveCountDownComponent } from './live-count-down/live-count-down.component';
import { LiveInComponent } from './live-in/live-in.component';


const liveRoute: Routes = [
  {
    path: 'lives',
    component: LiveListComponent,
    children: [
      { path: 'all', component: LiveAllComponent },
      { path: 'count-down', component: LiveCountDownComponent },
      { path: 'live-in', component: LiveInComponent },
    ]
  }
]

export const ROUTES = RouterModule.forChild(liveRoute);
