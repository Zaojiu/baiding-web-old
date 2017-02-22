import {NgModule} from '@angular/core';
import {SpeakerComponent} from "./speaker.component";
import {SpeakerRoutingModule} from "./speaker.route";

@NgModule({
  imports: [
    SpeakerRoutingModule,
  ],
  declarations: [
    SpeakerComponent,
  ],
  providers: [

  ]
})

export class SpeakerModule {
}
