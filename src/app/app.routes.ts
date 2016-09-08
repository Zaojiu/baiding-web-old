import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
import { Routes, RouterModule } from '@angular/router';

// // AngularClass
import { provideWebpack } from '@angularclass/webpack-toolkit';
import { providePrefetchIdleCallbacks } from '@angularclass/request-idle-callback';
import { NotFoundComponent } from "./notfound/notfound.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/lives/all', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
];

export const ROUTES = RouterModule.forRoot(appRoutes, { useHash: true });

// ------------- starter 保留异步加载路由，勿删 ---------------
const asyncRoutes: AsyncRoutes = {
  // 'About': require('es6-promise-loader!./about')
};

const prefetchRouteCallbacks: Array<IdleCallbacks> = [
  // asyncRoutes['About'],
];

export const ROUTING_PROVIDERS = [
  provideWebpack(asyncRoutes),
  providePrefetchIdleCallbacks(prefetchRouteCallbacks)
];
// ------------- starter 保留异步加载路由，勿删 ---------------
