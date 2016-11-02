import {NgModule} from '@angular/core';
import {ScrollerDirective} from "./scroller.directive";

@NgModule({
    imports: [],
    declarations: [
      ScrollerDirective
    ],
    exports: [
      ScrollerDirective,
    ],
  },
)
export class ScrollerModule {
}
