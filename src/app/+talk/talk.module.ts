import {NgModule} from '@angular/core';
import {TalkRoutingModule} from "./talk.route";
import {CommonModule} from "@angular/common";
import {TalkCommentModule} from "./+post-comment/post-comment.module";
import {ArticleModule} from "./article/article.module";
import {IosBridgeService} from "../shared/ios-bridge/ios-bridge.service";

@NgModule({
  imports: [
    CommonModule,
    TalkRoutingModule,
    TalkCommentModule,
    ArticleModule,
  ],
  declarations: [
  ],
  providers:[
    IosBridgeService
  ]
})

export class TalkModule {
}
