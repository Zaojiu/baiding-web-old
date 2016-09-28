import { NgModule } from '@angular/core';

import { ROUTES as LiveRoute } from './live-list.route'
import { EmptyComponent } from "../shared/empty/empty.component";


@NgModule({
  imports: [
    LiveRoute
  ],
  declarations: [
    EmptyComponent
  ]
})

export class LiveListModule {}
