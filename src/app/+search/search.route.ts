import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {SearchResultComponent} from "./search-result/search-result.component";
import {AuthGuard} from "../shared/guard/auth.guard";

const route: Routes = [
  {
    path: 'result',
    component: SearchResultComponent,
    canActivate: [AuthGuard],
    data: {
      title: '搜索结果'
    }
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class SearchRoutingModule {}
