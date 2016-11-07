import {NgModule} from '@angular/core';
import {ValidateOnBlurDirective} from "./validate-on-blur.directive";

@NgModule({
  declarations: [
    ValidateOnBlurDirective,
  ],
  exports: [
    ValidateOnBlurDirective,
  ]
})

export class FormModule {
}
