import {ModuleWithProviders, NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DdiComponent} from './ddi.component';
import {AuthGuard} from '../../shared/guard/auth.guard';

const route: Routes = [
  {
    path: '',
    data: {
      title: '领导力测试',
      isAsyncShareInfo: true,
    },
    children: [
      {
        path: 'question',
        component: DdiComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'answer',
        component: DdiComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'share',
        component: DdiComponent,
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
export class DdiRoutingModule {}
