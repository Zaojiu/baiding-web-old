import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {LiveRoomTopBarComponent} from "./live-room-top-bar.component";

@NgModule({
    imports: [
      CommonModule,
    ],
    declarations: [
      LiveRoomTopBarComponent,
    ],
    exports: [
      LiveRoomTopBarComponent
    ],
  }
)

export class LiveRoomTopBarModule {
}
