import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ChangSanJiaoComponent} from './changsanjiao.component';

const route: Routes = [
  {
    path: '',
    component: ChangSanJiaoComponent,
    data: {
      title: '活力长三角，青商新机遇',
    },
  },
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})

export class ChangSanJiaoRoutingModule {

}
