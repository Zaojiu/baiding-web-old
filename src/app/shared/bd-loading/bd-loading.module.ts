import {NgModule} from '@angular/core';
import {BdLoadingComponent} from "./bd-loading.component";
import {CircleLoadingComponent} from "./circle-loading.component";

@NgModule({
    imports: [],
    declarations: [
      BdLoadingComponent,
      CircleLoadingComponent,
    ],
    exports: [
      BdLoadingComponent,
      CircleLoadingComponent,
    ],
  },
)
export class LoadingModule {
}
