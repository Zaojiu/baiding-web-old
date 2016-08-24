import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ROUTES as LiveRoomRoute } from './live-room.route';
import { LiveRoomComponent } from './live-room.component';
import { LiveRoomDanmuComponent } from './live-room-danmu/live-room-danmu.component';
import { LiveRoomEditorBottomBarComponent } from './live-room-editor-bottom-bar/live-room-editor-bottom-bar.component';
import { LiveRoomAudienceBottomBarComponent } from './live-room-audience-bottom-bar/live-room-audience-bottom-bar.component';
import { LiveRoomTimelineComponent } from './live-room-timeline/live-room-timeline.component';


@NgModule({
  imports: [
    LiveRoomRoute,
    BrowserModule
  ],
  declarations: [
    LiveRoomComponent,
    LiveRoomDanmuComponent,
    LiveRoomTimelineComponent,
    LiveRoomEditorBottomBarComponent,
    LiveRoomAudienceBottomBarComponent
  ]
})

export class LiveRoomModule {
}
