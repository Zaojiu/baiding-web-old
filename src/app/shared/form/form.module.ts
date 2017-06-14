import {NgModule} from '@angular/core';
import {ValidateOnBlurDirective} from "./validate-on-blur.directive";
import {FutureDirective} from "./future.validator";
import {ApiValidatorDirective} from "./api.validator";
import {InputHasValueDirective} from "./input-has-value.directive";
import {AutofocusDirective} from "./autofocus.directive";
import {AutofocusFirstInvalidInputDirective} from "./first-invalid.directive";
import {AutoBlurDirective} from "./auto-blur.directive";
import {DisplayWhenFocusDirective} from "./display-when-focus.directive";
import {AutoresizeDirective} from "./autoresize.directive";

@NgModule({
  declarations: [
    ValidateOnBlurDirective,
    FutureDirective,
    ApiValidatorDirective,
    InputHasValueDirective,
    AutofocusDirective,
    AutofocusFirstInvalidInputDirective,
    AutoBlurDirective,
    DisplayWhenFocusDirective,
    AutoresizeDirective,
  ],
  exports: [
    ValidateOnBlurDirective,
    FutureDirective,
    ApiValidatorDirective,
    InputHasValueDirective,
    AutofocusDirective,
    AutofocusFirstInvalidInputDirective,
    AutoBlurDirective,
    DisplayWhenFocusDirective,
    AutoresizeDirective,

  ]
})

export class FormModule {
}
