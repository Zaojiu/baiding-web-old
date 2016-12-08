import {NgModule} from '@angular/core';
import {AutofocusFirstInvalidInputDirective} from "./first-invalid.directive";

@NgModule({
  declarations: [
    AutofocusFirstInvalidInputDirective,
  ],
  exports: [
    AutofocusFirstInvalidInputDirective,
  ]
})

export class AutofocusFirstInvalidInputModule {
}
