import {NgModule} from '@angular/core';
import {AutoresizeDirective} from "./autoresize.directive";

@NgModule({
  declarations: [
    AutoresizeDirective,
  ],
  exports: [
    AutoresizeDirective,
  ]
})

export class AutoresizeModule {
}
