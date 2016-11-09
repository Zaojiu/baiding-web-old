import {NgModule} from '@angular/core';
import {EmptyComponent} from "./empty.component";

@NgModule({
  declarations: [
    EmptyComponent,
  ],
  exports: [
    EmptyComponent
  ],
})

export class EmptyModule {
}
