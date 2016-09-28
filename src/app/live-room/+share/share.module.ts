import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ROUTES } from './share.route';
import { ShareComponent } from './share.component';

@NgModule({
  imports: [
    CommonModule,
    ROUTES,
  ],
  declarations: [
    ShareComponent,
  ],
})

export class ShareModule {}
