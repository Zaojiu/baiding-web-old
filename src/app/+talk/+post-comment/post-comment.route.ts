import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {TalkPostCommentComponent} from "./post-comment.component";

const route: Routes = [
  {
    path: '',
    component: TalkPostCommentComponent,
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

