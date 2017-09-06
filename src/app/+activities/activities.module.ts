import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ActivitiesRoutingModule} from './activities.route';
import {ScheduleComponent} from "./0908/schedule/schedule.component";

@NgModule({
  imports: [
    ActivitiesRoutingModule,
    CommonModule,
  ],
  declarations: [
    ScheduleComponent,
  ],
  providers: []
})

export class ActivitiesModule {
}
