import {Routes, RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";

const appRoutes: Routes = [
  {path: '404', loadChildren: 'app/+notfound/notfound.module#NotFoundModule'},
  {path: 'my', loadChildren: 'app/+my/my.module#MyModule'},
  {path: 'info-center', loadChildren: 'app/+info-center/info-center.module#InfoCenterModule'},
  {path: 'talks', loadChildren: 'app/+talk/talk.module#TalkModule'},
  {path: 'speaker', loadChildren: 'app/+speaker/speaker.module#SpeakerModule'},
  {path: 'search', loadChildren: 'app/+search/search.module#SearchModule'},
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
