import {NgModule} from '@angular/core';
import {FileSelectorSizeDirective, FileSelectorTypeDirective} from "./file-selector.validator";
import {FileControlValueAccessor} from "./file-selector.directive";

@NgModule({
  declarations: [
    FileControlValueAccessor,
    FileSelectorSizeDirective,
    FileSelectorTypeDirective,
  ],
  exports: [
    FileControlValueAccessor,
    FileSelectorSizeDirective,
    FileSelectorTypeDirective,
  ]
})

export class FileSelectorModule {
}
