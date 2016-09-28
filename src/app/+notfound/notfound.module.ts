import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './notfound.component';
import { ROUTES } from "./notfound.route";

@NgModule({
  imports: [
    CommonModule,
    ROUTES
  ],
  declarations: [
    NotFoundComponent
  ]
})

export class NotFoundModule {}
