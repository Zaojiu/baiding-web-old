import {NgModule} from '@angular/core';
import {FadeDirective} from "./fade/fade.directive";

@NgModule({
  declarations: [
    FadeDirective,
  ],
  exports: [
    FadeDirective,
  ],
})

export class AnimationModule {
}
