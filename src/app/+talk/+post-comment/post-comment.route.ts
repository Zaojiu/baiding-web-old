import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {TalkPostCommentComponent} from "./post-comment.component";
import {AuthGuard} from "../../shared/guard/auth.guard";
import {BindMobileGuard} from "../../shared/guard/bind-mobile.guard";

const route: Routes = [
  {
    path: '',
    component: TalkPostCommentComponent,
    canActivate: [AuthGuard, BindMobileGuard],
    data: {
      title: '发表评论',
    }
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class TalkPostCommentRoutingModule {
}

