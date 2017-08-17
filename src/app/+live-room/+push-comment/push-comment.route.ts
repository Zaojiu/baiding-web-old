import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {PushCommentComponent} from './push-comment.component';
import {CachedLiveInfoResolver} from "../../shared/guard/cached-live-info.resolver";

const route: Routes = [
  {
    path: '', component: PushCommentComponent,
    resolve: {
      liveInfo: CachedLiveInfoResolver,
    },
    data: {
      title: '评论列表',
      isInheritShareInfo: true,
    }
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class PushCommentRoutingModule {}
