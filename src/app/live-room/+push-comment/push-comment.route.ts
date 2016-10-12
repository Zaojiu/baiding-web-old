import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { PushCommentComponent } from './push-comment.component';

const route: Routes = [
  {
    path: '', component: PushCommentComponent
  }
];

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
