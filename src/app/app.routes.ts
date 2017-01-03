import {Routes, RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";

const appRoutes: Routes = [
  {path: '404', loadChildren: 'app/+notfound/notfound.module#NotFoundModule'},
  {path: 'info-center', loadChildren: 'app/+info-center/info-center.module#InfoCenterModule'},
  {path: '', loadChildren: 'app/+live-list/live-list.module#LiveListModule'},
  {path: '**', redirectTo: '/404', pathMatch: 'full'},
];

const ROUTES = RouterModule.forRoot(appRoutes, {useHash: false});

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})

export class AppRoutingModule {
}

