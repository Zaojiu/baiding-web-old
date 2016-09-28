import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ROUTES } from './history.route';
import { HistoryComponent } from "./history.component";

@NgModule({
  imports: [
    CommonModule,
    ROUTES,
  ],
  declarations: [
    HistoryComponent,
  ],
})

export class InviteModule {}
