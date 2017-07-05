import {ModuleWithProviders, NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router';
import {NowComponent} from "./now.component";

const route: Routes = [
  {
    path: '',
    component: NowComponent,
    data: {
      title: 'Now',
    },
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})
export class NowRoutingModule {
}
