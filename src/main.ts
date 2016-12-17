import './polyfills.ts';
import './scripts.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {environment} from "./environments/environment";
import {enableProdMode} from "@angular/core";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
