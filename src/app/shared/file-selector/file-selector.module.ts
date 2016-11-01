import {NgModule} from '@angular/core';
import {FileSelectorDirective} from "./file-selector.directive";

@NgModule({
  declarations: [
    FileSelectorDirective
  ],
  exports: [
    FileSelectorDirective,
  ]
})

export class FileSelectorModule {
}
