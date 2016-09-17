import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from "./notfound/notfound.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/lives/all', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
];

export const ROUTES = RouterModule.forRoot(appRoutes, { useHash: true });
