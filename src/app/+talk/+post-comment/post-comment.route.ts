import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {TalkPostCommentComponent} from "./post-comment.component";
import {AuthGuard} from "../../shared/guard/auth.guard";

const route: Routes = [
  {
    path: '',
    component: TalkPostCommentComponent,
    canActivate: [AuthGuard],
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

