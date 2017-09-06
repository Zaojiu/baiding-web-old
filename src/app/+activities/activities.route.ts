import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "../shared/guard/auth.guard";
import {ScheduleComponent} from "./0908/schedule/schedule.component";

const route: Routes = [
  {
    path: '0908/schedule',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class ActivitiesRoutingModule {}
