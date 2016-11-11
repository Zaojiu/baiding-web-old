import {NgModule} from '@angular/core';
import {ValidateOnBlurDirective} from "./validate-on-blur.directive";
import {FutureDirective} from "./future.validator";

@NgModule({
  declarations: [
    ValidateOnBlurDirective,
    FutureDirective,
  ],
  exports: [
    ValidateOnBlurDirective,
    FutureDirective,
  ]
})

export class FormModule {
}
