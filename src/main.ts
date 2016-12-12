import './polyfills';
import './scripts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/';
import {environment} from "./environments/environment";
import {enableProdMode} from "@angular/core";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
