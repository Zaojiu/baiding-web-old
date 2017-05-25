import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {ArticleComponent} from "./article/article.component";
import {UserInfoResolver} from "../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: ':id',
    children: [
      {
        path: '',
        component: ArticleComponent,
        data: {
          isAsyncShareInfo: true,
          isAsyncTitle: true,
        },
        resolve: {
          userInfo: UserInfoResolver,
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

