import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from '@angular/forms';

import {PostRoutingModule} from './post.route';
import {PostComponent} from './post.component';
import {PipeModule} from "../../shared/pipe/pipe.module";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {ScrollerModule} from "../../shared/scroller/scroller.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";
import {PostService} from "./post.service";

@NgModule({
  imports: [
    PostRoutingModule,
    CommonModule,
    FormsModule,
    PipeModule,
    LoadingModule,
    ScrollerModule,
    LiveRoomTopBarModule,
  ],
  declarations: [
    PostComponent,
  ],
  providers: [
    PostService,
    CommentApiService,
  ],
})

export class PostModule {
}
