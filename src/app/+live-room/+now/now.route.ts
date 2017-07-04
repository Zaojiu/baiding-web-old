import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {NowComponent} from "./now.component";
import {UserInfoResolver} from "../../shared/guard/user-info.resolver";

const route: Routes = [
  {
    path: '',
    component: NowComponent,
    data: {
      title: 'Now',
    },
    resolve: {
      userInfo: UserInfoResolver,
    }
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class NowRoutingModule {
}
