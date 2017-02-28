import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "../shared/guard/auth.guard";
import {TalkInfoComponent} from "./talk-info/talk-info.component";
import {ArticleComponent} from "./article/article.component";
import {TalkPostCommentComponent} from "./+post-comment/post-comment.component";

const route: Routes = [
  {
    path: ':id',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ArticleComponent,
        data: {
          isAsyncShareInfo: true,
        }
      },
      {
        path: 'info',
        component: TalkInfoComponent,
      },
      {
        path: 'post-comment', loadChildren: 'app/+talk/+post-comment/post-comment.module#TalkCommentModule'
      },
    ]
  },
];

const ROUTES = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class TalkRoutingModule {
}

