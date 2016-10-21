import {NgModule} from '@angular/core';
import {RolePipe} from "./role.pipe";
import {TimeFormaterPipe, DurationFormaterPipe, FromNowPipe, TimeToPipe} from "./time.pipe";

@NgModule({
  declarations: [
    RolePipe,
    TimeFormaterPipe,
    DurationFormaterPipe,
    TimeToPipe,
    FromNowPipe,
  ],
  exports: [
    RolePipe,
    TimeFormaterPipe,
    DurationFormaterPipe,
    TimeToPipe,
    FromNowPipe,
  ]
})

export class PipeModule {
}
