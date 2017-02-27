import {NgModule} from '@angular/core';
import {TalkRoutingModule} from "./talk.route";
import {TalkInfoComponent} from "./talk-info/talk-info.component";
import {CommonModule} from "@angular/common";
import {TalkCommentModule} from "./+post-comment/post-comment.module";
import {ArticleModule} from "./article/article.module";

@NgModule({
  imports: [
    CommonModule,
    TalkRoutingModule,
    TalkCommentModule,
    ArticleModule,
  ],
  declarations: [
    TalkInfoComponent,
  ],
})

export class TalkModule {
}
