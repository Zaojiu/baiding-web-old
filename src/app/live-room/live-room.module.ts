import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ROUTES as LiveRoomRoute } from './live-room.route';
import { LiveRoomComponent } from './live-room.component';
import { LiveRoomDanmuComponent } from './live-room-danmu/live-room-danmu.component';

@NgModule({
  imports: [
    LiveRoomRoute,
    BrowserModule
  ],
  declarations: [
    LiveRoomComponent,
    LiveRoomDanmuComponent
  ]
})

export class LiveRoomModule {
}
