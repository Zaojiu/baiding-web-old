import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from './notfound.component';
import {NotFoundRoutingModule} from "./notfound.route";

@NgModule({
  imports: [
    CommonModule,
    NotFoundRoutingModule,
  ],
  declarations: [
    NotFoundComponent
  ]
})

export class NotFoundModule {
}
