import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LivesComponent } from './lives.component'
import { LiveAllComponent } from './live-all/live-all.component'
import { LiveCountDownComponent } from './live-count-down/live-count-down.component'
import { LiveInComponent } from './live-in/live-in.component'
import { ROUTES as LivesRoute } from './lives.route'


@NgModule({
  imports: [
    LivesRoute,
    BrowserModule
  ],
  declarations: [
    LivesComponent,
    LiveAllComponent,
    LiveCountDownComponent,
    LiveInComponent
  ]
})

export class LivesModule {
}
