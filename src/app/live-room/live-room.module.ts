import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { ROUTES as LiveRoomRoute } from './live-room.route';
import { LiveRoomComponent } from './live-room.component';
import { LiveRoomDanmuComponent } from './live-room-danmu/live-room-danmu.component';
import { LiveRoomEditorBottomBarComponent } from './live-room-editor-bottom-bar/live-room-editor-bottom-bar.component';
import { LiveRoomAudienceBottomBarComponent } from './live-room-audience-bottom-bar/live-room-audience-bottom-bar.component';
import { LiveRoomTimelineComponent } from './live-room-timeline/live-room-timeline.component';
import { TimelineCommentComponent } from './live-room-timeline/timeline-comment/timeline-comment.component';
import { LiveRoomPushCommentComponent } from './live-room-push-comment/live-room-push-comment.component';
import { LiveRoomPostCommentComponent } from './live-room-post-comment/live-room-post-comment.component';
import { PraisedAnimationsDirective } from './live-room-timeline/timeline-comment/praised-animations.directive';
import { PraisedAnimationComponent } from './live-room-timeline/timeline-comment/praised-animation/praised-animation.component';
import { HistoryComponent } from './history/history.component';
import { InviteComponent } from './invite/invite.component';
import { EmptyComponent } from '../shared/empty/empty.component';
import { TimelineCommentRolePipe } from './live-room-timeline/timeline-comment/timeline-comment-role.pipe';
import { TimelineCommentTimePipe } from './live-room-timeline/timeline-comment/timeline-comment-time.pipe';
import { TimelineScrollerDirective } from './live-room-timeline/timeline.directive';


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
    LiveRoomEditorBottomBarComponent,
    LiveRoomAudienceBottomBarComponent,
    LiveRoomPushCommentComponent,
    LiveRoomPostCommentComponent,
    TimelineCommentComponent,
    EmptyComponent,
    PraisedAnimationsDirective,
    PraisedAnimationComponent,
    HistoryComponent,
    InviteComponent,
    TimelineCommentRolePipe,
    TimelineCommentTimePipe,
    TimelineScrollerDirective
  ]
})

export class LiveRoomModule {
}
