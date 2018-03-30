import {NgModule} from '@angular/core';
import {TalkRoutingModule} from "./talk.route";
import {CommonModule} from "@angular/common";
import {TalkCommentModule} from "./+post-comment/post-comment.module";
import {ArticleModule} from "./article/article.module";
import {IosBridgeService} from "../shared/ios-bridge/ios-bridge.service";
import {TalkInfoResolver} from "../shared/guard/talk-info.resolver";
import {TalkTitleResolver} from "../shared/guard/title.resolver";

@NgModule({
  imports: [
    CommonModule,
    TalkRoutingModule,
    TalkCommentModule,
    ArticleModule,
  ],
  declarations: [
  ],
  providers: [
    IosBridgeService,
    TalkInfoResolver,
    TalkTitleResolver,
  ]
})

export class TalkModule {
}
