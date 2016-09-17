import { Routes, RouterModule } from '@angular/router';
import { LiveCountDownComponent } from './live-count-down.component';

const liveCountDownRoute: Routes = [
  { path: 'count-down', component: LiveCountDownComponent}
]

export const ROUTES = RouterModule.forChild(liveCountDownRoute);
