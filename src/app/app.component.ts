import { Component, OnInit } from '@angular/core';
import { Angulartics2GoogleTagManager } from 'angulartics2';
import { Router, Route, RoutesRecognized, NavigationEnd } from "@angular/router";
import { AppJumperGuard } from "./shared/guard/app-jumper.guard";
import { AnalyticsService } from "./shared/analytics/analytics.service"

@Component({
  selector: 'bd-app',
  templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
  constructor(angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private analytics: AnalyticsService,
    private router: Router) {
  }

  initAppJumperGuard() {
    this.router.config.forEach((root) => {
      let queue = [root];

      while (queue.length > 0) {
        let route = queue.pop();
        this.injectAppJumperGuard(route);

        let children = route.children;
        if (route['_loadedConfig'] && route['_loadedConfig'].routes && route['_loadedConfig'].routes.length) {
          children = route['_loadedConfig'].routes;
        }

        if (!children) continue;

        queue.push(...children);
      }
    });
  }

  injectAppJumperGuard(route: Route) {
    if (route.redirectTo || (route.children && route.children.length) || route.loadChildren) return;

    route.canActivate = route.canActivate || [];

    for (let guard of route.canActivate) {
      if (guard === AppJumperGuard) return;
    }

    route.canActivate.unshift(AppJumperGuard);
  }

  ngOnInit() {
    this.analytics.eventEnterpage()

    this.router.events.subscribe(e => {
      if (e instanceof RoutesRecognized) {
        this.initAppJumperGuard();
      }

      if (e instanceof NavigationEnd) {
        this.analytics.eventPageview()
      }
    });
  }
}
