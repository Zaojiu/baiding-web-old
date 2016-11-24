import {NgModule} from '@angular/core';
import {ValidateOnBlurDirective} from "./validate-on-blur.directive";
import {FutureDirective} from "./future.validator";
import {ApiValidatorDirective} from "./api.validator";

@NgModule({
  declarations: [
    ValidateOnBlurDirective,
    FutureDirective,
    ApiValidatorDirective,
  ],
  exports: [
    ValidateOnBlurDirective,
    FutureDirective,
    ApiValidatorDirective,
  ]
})

export class FormModule {
}
