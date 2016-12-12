import {NgModule} from '@angular/core';
import {ValidateOnBlurDirective} from "./validate-on-blur.directive";
import {FutureDirective} from "./future.validator";
import {ApiValidatorDirective} from "./api.validator";
import {InputHasValueDirective} from "./input-has-value.directive";

@NgModule({
  declarations: [
    ValidateOnBlurDirective,
    FutureDirective,
    ApiValidatorDirective,
    InputHasValueDirective,
  ],
  exports: [
    ValidateOnBlurDirective,
    FutureDirective,
    ApiValidatorDirective,
    InputHasValueDirective,
  ]
})

export class FormModule {
}
