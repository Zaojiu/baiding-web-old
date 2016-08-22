import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LiveListComponent } from './live-list.component'
import { LiveAllComponent } from './live-all/live-all.component'
import { LiveCountDownComponent } from './live-count-down/live-count-down.component'
import { LiveInComponent } from './live-in/live-in.component'
import { ROUTES as LiveRoute } from './live-list.route'


@NgModule({
  imports: [
    LiveRoute,
    BrowserModule
  ],
  declarations: [
    LiveListComponent,
    LiveAllComponent,
    LiveCountDownComponent,
    LiveInComponent
  ]
})

export class LiveListModule {
}
