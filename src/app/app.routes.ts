import {Routes, RouterModule} from '@angular/router';
import {NgModule} from "@angular/core";

const appRoutes: Routes = [
  {path: '404', loadChildren: 'app/+notfound/notfound.module#NotFoundModule'},
  {path: 'reload', loadChildren: 'app/+reload/reload.module#ReloadModule'},
  {path: 'my', loadChildren: 'app/+my/my.module#MyModule'},
  {path: 'info-center', loadChildren: 'app/+info-center/info-center.module#InfoCenterModule'},
  {path: 'lives', loadChildren: 'app/+live-room/live-room.module#LiveRoomModule'},
  {path: 'talks', loadChildren: 'app/+talk/talk.module#TalkModule'},
  {path: 'speaker', loadChildren: 'app/+speaker/speaker.module#SpeakerModule'},
  {path: 'search', loadChildren: 'app/+search/search.module#SearchModule'},
  {path: 'signup', loadChildren: 'app/+signup/signup.module#SignupModule'},
  {path: 'signin', loadChildren: 'app/+signin/signin.module#SigninModule'},
  {path: 'member', loadChildren: 'app/+member/member.module#MemberModule'},
  {path: 'wa/ddi', loadChildren: 'app/H5WA/DDI/ddi.module#DdiModule'},
  {path: 'wa/dql', loadChildren: 'app/H5WA/DQL/dql.module#DqlModule'},
  {path: 'activities', loadChildren: 'app/+activities/activities.module#ActivitiesModule'},
  {path: '', redirectTo: '/lives', pathMatch: 'full'},
  {path: '**', redirectTo: '/404', pathMatch: 'full'},
];

const ROUTES = RouterModule.forRoot(appRoutes, {useHash: false});

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
