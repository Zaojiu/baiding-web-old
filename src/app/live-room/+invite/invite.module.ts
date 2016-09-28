import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ROUTES } from './invite.route';
import { InviteComponent } from './invite.component';

@NgModule({
  imports: [
    CommonModule,
    ROUTES,
  ],
  declarations: [
    InviteComponent,
  ],
})

export class InviteModule {}
