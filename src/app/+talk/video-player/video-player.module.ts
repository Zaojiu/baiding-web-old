import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {VideoPlayerComponent} from "./video-player.component";
import {AutoresizeModule} from "../../shared/autoresize/autoresize.module";
import {FormModule} from "../../shared/form/form.module";
import {AutofocusFirstInvalidInputModule} from "../../shared/first-invalid/first-invalid.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutofocusFirstInvalidInputModule,
    FormModule,
    AutoresizeModule,
  ],
  declarations: [
    VideoPlayerComponent,
  ],
  exports: [
    VideoPlayerComponent,
  ],
})

export class VideoPlayerModule {
}
