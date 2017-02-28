import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TalkService} from "../../shared/api/talk/talk.api";
import {ArticleComponent} from "./article.component";
import {VideoPlayerModule} from "../../shared/video-player/video-player.module";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";

@NgModule({
  imports: [
    CommonModule,
    VideoPlayerModule,
    LoadingModule,
  ],
  declarations: [
    ArticleComponent,
  ],
  providers: [
    TalkService,
  ]
})

export class ArticleModule {
}
