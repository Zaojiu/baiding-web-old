import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DqlComponent} from './dql.component';
import {AuthGuard} from '../../shared/guard/auth.guard';

const route: Routes = [
  {
    path: '',
    data: {
      title: '  潜力测试',
      isAsyncShareInfo: true,
    },
    children: [
      {
        path: 'question',
        component: DqlComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'answer',
        component: DqlComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'share',
        component: DqlComponent,
        canActivate: [AuthGuard],
      }
    ]
  }
];

const ROUTES: ModuleWithProviders = RouterModule.forChild(route);

@NgModule({
  imports: [ ROUTES ],
  exports: [ RouterModule ]
})
export class DqlRoutingModule {}
