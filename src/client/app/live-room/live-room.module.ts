import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { ROUTES as LiveRoomRoute } from './live-room.route';
import { LiveRoomComponent } from './live-room.component';
import { CommentComponent } from './comment/comment.component';
import { EditorBottomBarComponent } from './editor-bottom-bar/editor-bottom-bar.component';
import { AudienceBottomBarComponent } from './audience-bottom-bar/audience-bottom-bar.component';
import { TimelineComponent } from './timeline/timeline.component';
import { AudioMessageComponent } from './timeline/message/audio-message/audio-message.component';
import { MessageComponent } from './timeline/message/message.component';
import { PushCommentComponent } from './push-comment/push-comment.component';
import { PostComponent } from './post/post.component';
import { PraisedAnimationDirective } from '../shared/praised-animation/praised-animation.directive';
import { PraisedAnimationComponent } from '../shared/praised-animation/praised-animation.component';
import { HistoryComponent } from './history/history.component';
import { InviteComponent } from './invite/invite.component';
import { EmptyComponent } from '../shared/empty/empty.component';
import { RolePipe } from '../shared/pipe/role.pipe';
import { TimelineScrollerDirective } from './timeline/timeline.directive';
import { PushCommentScrollerDirective } from './push-comment/push-comment.directive';
import { TimeFormaterPipe, DurationFormaterPipe } from "../shared/pipe/time.pipe";
import { ShareComponent } from "./share/share.component";
import { LiveGuard } from '../shared/guard/live.guard';
import { TimelineService } from './timeline/timeline.service';
import { CommentService } from './comment/comment.service';
import { LiveService } from '../shared/live/live.service';
import { FromNowPipe } from "../shared/pipe/time.pipe";
import { MessageApiService } from "../shared/api/message.api";
import { QuitEditGuard } from '../shared/guard/quit-edit.guard';
import { FileSelectorDirective } from "../shared/file-selector/file-selector.directive";
import { ImageViewerComponent } from "../shared/image-viewer/image-viewer.component";
import { UploadApiService } from "../shared/api/upload.api";

@NgModule({
  imports: [
    LiveRoomRoute,
    BrowserModule,
    FormsModule
  ],
  declarations: [
    LiveRoomComponent,
    CommentComponent,
    TimelineComponent,
    EditorBottomBarComponent,
    AudienceBottomBarComponent,
    PushCommentComponent,
    PostComponent,
    MessageComponent,
    EmptyComponent,
    ShareComponent,
    PraisedAnimationDirective,
    PraisedAnimationComponent,
    HistoryComponent,
    InviteComponent,
    RolePipe,
    FromNowPipe,
    TimeFormaterPipe,
    DurationFormaterPipe,
    TimelineScrollerDirective,
    AudioMessageComponent,
    PushCommentScrollerDirective,
    FileSelectorDirective,
    ImageViewerComponent,
  ],
  providers: [
    LiveGuard,
    LiveService,
    TimelineService,
    CommentService,
    MessageApiService,
    UploadApiService,
    QuitEditGuard,
  ]
})

export class LiveRoomModule {}
