import {NgModule} from '@angular/core';
import {TalkRoutingModule} from "./talk.route";
import {TalkInfoComponent} from "./talk-info/talk-info.component";
import {ArticleComponent} from "./article/article.component";
import {TalkService} from "../shared/api/talk/talk.api";

@NgModule({
  imports: [
    TalkRoutingModule,
  ],
  declarations: [
    TalkInfoComponent,
    ArticleComponent,
  ],
  providers: [
    TalkService,
  ]
})

export class TalkModule {
}
