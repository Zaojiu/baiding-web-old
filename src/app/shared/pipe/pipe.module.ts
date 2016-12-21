import {NgModule} from '@angular/core';
import {RolePipe} from "./role.pipe";
import {TimeToFormatedPipe, TimeFormaterPipe, DurationFormaterPipe, FromNowPipe, TimeToPipe} from "./time.pipe";

@NgModule({
  declarations: [
    RolePipe,
    TimeFormaterPipe,
    DurationFormaterPipe,
    TimeToPipe,
    FromNowPipe,
    TimeToFormatedPipe,
  ],
  exports: [
    RolePipe,
    TimeFormaterPipe,
    DurationFormaterPipe,
    TimeToPipe,
    FromNowPipe,
    TimeToFormatedPipe,
  ]
})

export class PipeModule {
}
