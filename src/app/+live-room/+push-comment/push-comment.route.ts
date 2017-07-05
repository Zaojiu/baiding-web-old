import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {PushCommentComponent} from './push-comment.component';
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";

const route: Routes = [
  {
    path: '', component: PushCommentComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
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
