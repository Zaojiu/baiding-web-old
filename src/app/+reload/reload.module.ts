import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReloadComponent} from './reload.component';
import {ReloadRoutingModule} from "./reload.route";

@NgModule({
  imports: [
    CommonModule,
    ReloadRoutingModule,
  ],
  declarations: [
    ReloadComponent
  ]
})

export class ReloadModule {
}
