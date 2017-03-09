import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { InviteRoutingModule } from './invite.route';
import { InviteComponent } from './invite.component';

@NgModule({
  imports: [
    CommonModule,
    InviteRoutingModule,
  ],
  declarations: [
    InviteComponent,
  ],
})

export class InviteModule {}
