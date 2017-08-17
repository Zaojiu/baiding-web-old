import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {PostComponent} from './post.component';
import {CachedLiveInfoResolver} from "../../shared/guard/cached-live-info.resolver";

const route: Routes = [
  {
    path: '', component: PostComponent,
    resolve: {
      liveInfo: CachedLiveInfoResolver,
    },
    data: {
      title: '消息推送',
      isInheritShareInfo: true,
    }
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);


@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class PostRoutingModule {}
