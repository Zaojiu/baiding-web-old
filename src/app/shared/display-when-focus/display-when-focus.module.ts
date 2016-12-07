import {NgModule} from '@angular/core';
import {DisplayWhenFocusDirective} from "./display-when-focus.directive";

@NgModule({
  declarations: [
    DisplayWhenFocusDirective,
  ],
  exports: [
    DisplayWhenFocusDirective,
  ]
})

export class DisplayWhenFocusModule {
}
