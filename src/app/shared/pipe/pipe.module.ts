import { NgModule } from '@angular/core';
import { RolePipe } from "./role.pipe";
import { TimeFormaterPipe, DurationFormaterPipe, FromNowPipe } from "./time.pipe";

@NgModule({
  declarations: [
    RolePipe,
    TimeFormaterPipe,
    DurationFormaterPipe,
    FromNowPipe,
  ],
  exports: [
    RolePipe,
    TimeFormaterPipe,
    DurationFormaterPipe,
    FromNowPipe,
  ]
})

export class PipeModule {}
