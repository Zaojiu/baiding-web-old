import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';

import {PostComponent} from './post.component';
import {LiveInfoResolver} from "../../shared/guard/live-info.resolver";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '', component: PostComponent,
    resolve: {
      liveInfo: LiveInfoResolver,
      userInfo: UserInfoResolver,
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
