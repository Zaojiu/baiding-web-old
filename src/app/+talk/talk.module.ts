import {NgModule} from '@angular/core';
import {TalkRoutingModule} from "./talk.route";
import {TalkInfoComponent} from "./talk-info/talk-info.component";
import {ArticleComponent} from "./article/article.component";
import {TalkService} from "../shared/api/talk/talk.api";
import {VideoPlayerComponent} from "./video-player/video-player.component";

@NgModule({
  imports: [
    TalkRoutingModule,
  ],
  declarations: [
    TalkInfoComponent,
    ArticleComponent,
    VideoPlayerComponent,
  ],
  providers: [
    TalkService,
  ]
})

export class TalkModule {
}
