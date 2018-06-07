import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FuDanComponent} from './fudan.component';

const route: Routes = [
  {
    path: '',
    component: FuDanComponent,
    data: {
      title: '复旦EMBA'
    }
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ROUTES],
  exports: [RouterModule]
})

export class FuDan {

}
