import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ROUTES} from './push-comment.route';
import {PushCommentComponent} from './push-comment.component';
import {PipeModule} from "../../shared/pipe/pipe.module";
import {LoadingModule} from "../../shared/bd-loading/bd-loading.module";
import {CommentApiService} from "../../shared/api/comment/comment.service";
import {PushCommentService} from "./push-comment.service";
import {ScrollerModule} from "../../shared/scroller/scroller.module";
import {LiveRoomTopBarModule} from "../../shared/live-room-top-bar/live-room-top-bar.module";

@NgModule({
  imports: [
    ROUTES,
    CommonModule,
    PipeModule,
    LoadingModule,
    ScrollerModule,
    LiveRoomTopBarModule,
  ],
  declarations: [
    PushCommentComponent,
  ],
  providers: [
    CommentApiService,
    PushCommentService,
  ],
})

export class PushCommentModule {
}
