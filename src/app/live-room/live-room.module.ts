import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { ROUTES as LiveRoomRoute } from './live-room.route';
import { LiveRoomComponent } from './live-room.component';
import { LiveRoomDanmuComponent } from './live-room-danmu/live-room-danmu.component';
import { EditorBottomBarComponent } from './editor-bottom-bar/editor-bottom-bar.component';
import { AudienceBottomBarComponent } from './audience-bottom-bar/audience-bottom-bar.component';
import { LiveRoomTimelineComponent } from './live-room-timeline/live-room-timeline.component';
import { AudioCommentComponent } from './live-room-timeline/timeline-comment/audio-comment/audio-comment.component';
import { TimelineCommentComponent } from './live-room-timeline/timeline-comment/timeline-comment.component';
import { LiveRoomPushDanmuComponent } from './live-room-push-danmu/live-room-push-danmu.component';
import { LiveRoomPostCommentComponent } from './live-room-post-comment/live-room-post-comment.component';
import { PraisedAnimationDirective } from '../shared/praised-animation/praised-animation.directive';
import { PraisedAnimationComponent } from '../shared/praised-animation/praised-animation.component';
import { HistoryComponent } from './history/history.component';
import { InviteComponent } from './invite/invite.component';
import { EmptyComponent } from '../shared/empty/empty.component';
import { TimelineCommentRolePipe } from './live-room-timeline/timeline-comment/timeline-comment-role.pipe';
import { TimelineCommentTimePipe } from './live-room-timeline/timeline-comment/timeline-comment-time.pipe';
import { TimelineScrollerDirective } from './live-room-timeline/timeline.directive';
import { PushDanmuScrollerDirective } from './live-room-push-danmu/push-danmu.directive';
import { TimeFormaterPipe, DurationFormaterPipe } from "./live-room-timeline/live-room-timeline.pipe";
import { ShareComponent } from "./share/share.component";
import { LiveGuard } from '../shared/guard/live.guard';
import { LiveRoomTimelineService } from './live-room-timeline/live-room-timeline.service';
import { LiveRoomCommentService } from './live-room-danmu/live-room-danmu.service';
import { LiveService } from '../shared/live/live.service';

@NgModule({
  imports: [
    LiveRoomRoute,
    BrowserModule,
    FormsModule
  ],
  declarations: [
    LiveRoomComponent,
    LiveRoomDanmuComponent,
    LiveRoomTimelineComponent,
    EditorBottomBarComponent,
    AudienceBottomBarComponent,
    LiveRoomPushDanmuComponent,
    LiveRoomPostCommentComponent,
    TimelineCommentComponent,
    EmptyComponent,
    ShareComponent,
    PraisedAnimationDirective,
    PraisedAnimationComponent,
    HistoryComponent,
    InviteComponent,
    TimelineCommentRolePipe,
    TimelineCommentTimePipe,
    TimeFormaterPipe,
    DurationFormaterPipe,
    TimelineScrollerDirective,
    AudioCommentComponent,
    PushDanmuScrollerDirective
  ],
  providers: [
    LiveGuard,
    LiveService,
    LiveRoomTimelineService,
    LiveRoomCommentService
  ]
})

export class LiveRoomModule {
}
