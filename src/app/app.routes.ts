import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '404', loadChildren: 'app/+notfound/notfound.module#NotFoundModule'},
  { path: 'info-center', loadChildren: 'app/+info-center/info-center.module#InfoCenterModule'},
  { path: 'lives', loadChildren: 'app/+live-list/live-list.module#LiveListModule'},
  { path: '', loadChildren: 'app/+live-list/live-list.module#LiveListModule' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

export const ROUTES = RouterModule.forRoot(appRoutes, { useHash: true });
