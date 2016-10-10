import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

const route: Routes = [
  {
    path: '', component: ImageViewerComponent
  }
]

export const ROUTES: ModuleWithProviders = RouterModule.forChild(route);
