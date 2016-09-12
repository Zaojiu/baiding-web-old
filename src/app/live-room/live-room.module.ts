import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { ROUTES as LiveRoomRoute } from './live-room.route';
import { LiveRoomComponent } from './live-room.component';
import { LiveRoomDanmuComponent } from './live-room-danmu/live-room-danmu.component';
import { EditorBottomBarComponent } from './editor-bottom-bar/editor-bottom-bar.component';
import { AudienceBottomBarComponent } from './audience-bottom-bar/audience-bottom-bar.component';
import { TimelineComponent } from './timeline/timeline.component';
import { AudioMessageComponent } from './timeline/message/audio-message/audio-message.component';
import { MessageComponent } from './timeline/message/message.component';
import { LiveRoomPushDanmuComponent } from './live-room-push-danmu/live-room-push-danmu.component';
import { PostComponent } from './post/post.component';
import { PraisedAnimationDirective } from '../shared/praised-animation/praised-animation.directive';
import { PraisedAnimationComponent } from '../shared/praised-animation/praised-animation.component';
import { HistoryComponent } from './history/history.component';
import { InviteComponent } from './invite/invite.component';
import { EmptyComponent } from '../shared/empty/empty.component';
import { RolePipe } from '../shared/pipe/role.pipe';
import { TimelineScrollerDirective } from './timeline/timeline.directive';
import { PushDanmuScrollerDirective } from './live-room-push-danmu/push-danmu.directive';
import { TimeFormaterPipe, DurationFormaterPipe } from "../shared/pipe/time.pipe";
import { ShareComponent } from "./share/share.component";
import { LiveGuard } from '../shared/guard/live.guard';
import { TimelineService } from './timeline/timeline.service';
import { LiveRoomCommentService } from './live-room-danmu/live-room-danmu.service';
import { LiveService } from '../shared/live/live.service';
import { FromNowPipe } from "../shared/pipe/time.pipe";
import { MessageApiService } from "../shared/api/message.api";

@NgModule({
  imports: [
    LiveRoomRoute,
    BrowserModule,
    FormsModule
  ],
  declarations: [
    LiveRoomComponent,
    LiveRoomDanmuComponent,
    TimelineComponent,
    EditorBottomBarComponent,
    AudienceBottomBarComponent,
    LiveRoomPushDanmuComponent,
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
    PushDanmuScrollerDirective
  ],
  providers: [
    LiveGuard,
    LiveService,
    TimelineService,
    LiveRoomCommentService,
    MessageApiService
  ]
})

export class LiveRoomModule {}
