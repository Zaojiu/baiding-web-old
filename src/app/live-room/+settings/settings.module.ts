import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";

import {ROUTES} from './settings.route';
import {TimelineService} from "../timeline/timeline.service";
import {SettingsComponent} from "./settings.component";
import {PipeModule} from "../../shared/pipe/pipe.module";
import {SwitchBtnModule} from "../../shared/switch-btn/switch-btn.module";

@NgModule({
  imports: [
    ROUTES,
    CommonModule,
    PipeModule,
    SwitchBtnModule,
  ],
  declarations: [
    SettingsComponent,
  ],
  providers: [
    TimelineService,
  ],
})

export class SettingsModule {
}
