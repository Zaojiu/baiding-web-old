import { Routes, RouterModule } from '@angular/router';
import { EmptyComponent } from "../shared/empty/empty.component";

const route: Routes = [
  { path: 'lives', component: EmptyComponent }
]

export const ROUTES = RouterModule.forChild(route);
