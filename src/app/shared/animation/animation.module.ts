import {NgModule} from '@angular/core';
import {FadeDirective} from "./fade/fade.directive";
import {AutoOpacityDownDirective} from "./auto-opacity-down/auto-opacity-down.directive";

@NgModule({
  declarations: [
    FadeDirective,
    AutoOpacityDownDirective,
  ],
  exports: [
    FadeDirective,
    AutoOpacityDownDirective,
  ],
})

export class AnimationModule {
}
