import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "../shared/guard/auth.guard";
import {ArticleComponent} from "./article/article.component";

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
        },
        children: [
          { path: '' },
          { path: 'post-comment', loadChildren: 'app/+talk/+post-comment/post-comment.module#TalkCommentModule' },
        ]
      },
      {
        // TODO: talk info
        path: 'info',
      }
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

