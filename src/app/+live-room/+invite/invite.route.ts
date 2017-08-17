import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {InviteComponent} from './invite.component';
import {CachedLiveInfoResolver} from "../../shared/guard/cached-live-info.resolver";

const route: Routes = [
  {
    path: '', component: InviteComponent,
    resolve: {
      liveInfo: CachedLiveInfoResolver,
    },
    data: {
      title: '邀请嘉宾'
    }
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class InviteRoutingModule {}
