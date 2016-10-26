import {NgModule} from '@angular/core';
import {AutoBlurDirective} from "./auto-blur.directive";

@NgModule({
  declarations: [
    AutoBlurDirective,
  ],
  exports: [
    AutoBlurDirective,
  ]
})

export class AutoBlurModule {
}
